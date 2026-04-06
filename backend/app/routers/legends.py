from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..database import get_db
from ..models.legends import PaymentMode, ServiceStatus, VehicleService
from ..security import authenticate_admin, require_admin

router = APIRouter()


class AdminLogin(BaseModel):
    username: str
    passcode: str


class ServiceCreate(BaseModel):
    customerName: str = Field(default="Client", min_length=2)
    customerPhone: Optional[str] = None
    vehicleBrand: Optional[str] = None
    carModel: str = Field(..., min_length=2)
    plateNumber: str = Field(..., min_length=5)
    serviceType: str
    amount: float = Field(..., gt=0)
    paymentMode: str
    serviceLocation: str = "In-Shop"
    notes: Optional[str] = None
    assignedTo: Optional[str] = None


class ServiceUpdate(BaseModel):
    status: Optional[str] = None
    paymentMode: Optional[str] = None
    amount: Optional[float] = Field(default=None, gt=0)
    assignedTo: Optional[str] = None
    notes: Optional[str] = None
    serviceLocation: Optional[str] = None


@router.post("/admin/login")
async def admin_login(payload: AdminLogin):
    token = authenticate_admin(payload.username, payload.passcode)
    return {"token": token, "username": payload.username.strip()}


@router.get("/admin/session")
async def admin_session(_admin: dict = Depends(require_admin)):
    return {"status": "ok"}


def normalize_payment_mode(value: str) -> PaymentMode:
    normalized = value.strip().lower()
    aliases = {
        "cash": PaymentMode.CASH,
        "online": PaymentMode.ONLINE,
        "online / upi": PaymentMode.ONLINE,
        "online/upi": PaymentMode.ONLINE,
        "upi": PaymentMode.ONLINE,
    }
    if normalized not in aliases:
        raise HTTPException(status_code=400, detail=f"Invalid payment mode: {value}")
    return aliases[normalized]


def normalize_service_status(value: str) -> ServiceStatus:
    normalized = value.strip().lower()
    aliases = {
        "pending": ServiceStatus.PENDING,
        "in progress": ServiceStatus.IN_PROGRESS,
        "in-progress": ServiceStatus.IN_PROGRESS,
        "progress": ServiceStatus.IN_PROGRESS,
        "completed": ServiceStatus.COMPLETED,
        "complete": ServiceStatus.COMPLETED,
        "delivered": ServiceStatus.DELIVERED,
        "delivery": ServiceStatus.DELIVERED,
    }
    if normalized not in aliases:
        raise HTTPException(status_code=400, detail=f"Invalid service status: {value}")
    return aliases[normalized]


def serialize_service(service: VehicleService) -> dict:
    return {
        "id": service.id,
        "customer_name": service.customer_name or "Client",
        "customer_phone": service.customer_phone,
        "vehicle_brand": service.vehicle_brand,
        "plate_number": service.plate_number,
        "car_model": service.car_model,
        "service_type": service.service_type,
        "amount": service.amount,
        "payment_mode": service.payment_mode.value if service.payment_mode else None,
        "status": service.status.value if service.status else None,
        "check_in_time": service.check_in_time.isoformat() if service.check_in_time else None,
        "completion_time": service.completion_time.isoformat() if service.completion_time else None,
        "notes": service.notes,
        "service_location": service.service_location or "In-Shop",
        "assigned_to": service.assigned_to,
    }


async def get_service_or_404(service_id: int, db: AsyncSession) -> VehicleService:
    result = await db.execute(select(VehicleService).where(VehicleService.id == service_id))
    service = result.scalar_one_or_none()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.post("/services")
async def create_service(
    service: ServiceCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(require_admin),
):
    try:
        db_service = VehicleService(
            customer_name=service.customerName.strip(),
            customer_phone=service.customerPhone,
            vehicle_brand=service.vehicleBrand,
            plate_number=service.plateNumber.upper(),
            car_model=service.carModel,
            service_type=service.serviceType,
            amount=service.amount,
            payment_mode=normalize_payment_mode(service.paymentMode),
            notes=service.notes,
            service_location=service.serviceLocation,
            assigned_to=service.assignedTo,
        )
        db.add(db_service)
        await db.commit()
        await db.refresh(db_service)
        return serialize_service(db_service)
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/services", response_model=List[dict])
async def get_services(
    q: Optional[str] = Query(default=None, min_length=2),
    status: Optional[str] = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(VehicleService).order_by(VehicleService.check_in_time.desc()).limit(limit)

    if q:
        like_query = f"%{q}%"
        stmt = stmt.where(
            or_(
                VehicleService.plate_number.ilike(like_query),
                VehicleService.car_model.ilike(like_query),
                VehicleService.customer_name.ilike(like_query),
                VehicleService.service_type.ilike(like_query),
            )
        )

    if status:
        try:
            stmt = stmt.where(VehicleService.status == normalize_service_status(status))
        except HTTPException:
            raise

    result = await db.execute(stmt)
    services = result.scalars().all()
    return [serialize_service(service) for service in services]


@router.patch("/services/{service_id}")
async def update_service(
    service_id: int,
    payload: ServiceUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(require_admin),
):
    service = await get_service_or_404(service_id, db)

    try:
        if payload.status is not None:
            service.status = normalize_service_status(payload.status)
            if service.status in {ServiceStatus.COMPLETED, ServiceStatus.DELIVERED}:
                service.completion_time = datetime.utcnow()

        if payload.paymentMode is not None:
            service.payment_mode = normalize_payment_mode(payload.paymentMode)
        if payload.amount is not None:
            service.amount = payload.amount
        if payload.assignedTo is not None:
            service.assigned_to = payload.assignedTo or None
        if payload.notes is not None:
            service.notes = payload.notes or None
        if payload.serviceLocation is not None:
            service.service_location = payload.serviceLocation

        await db.commit()
        await db.refresh(service)
        return serialize_service(service)
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/history")
async def get_history(q: str = Query(..., min_length=2), db: AsyncSession = Depends(get_db)):
    stmt = select(VehicleService).where(
        or_(
            VehicleService.plate_number.ilike(f"%{q}%"),
            VehicleService.car_model.ilike(f"%{q}%"),
            VehicleService.customer_name.ilike(f"%{q}%"),
        )
    ).order_by(VehicleService.check_in_time.desc())

    result = await db.execute(stmt)
    services = result.scalars().all()
    return [serialize_service(service) for service in services]


@router.get("/turnover")
async def get_turnover(db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    month_start = datetime(now.year, now.month, 1)

    result = await db.execute(select(VehicleService))
    services = result.scalars().all()

    daily_total = sum(
        service.amount for service in services
        if service.check_in_time and service.check_in_time >= today_start
    )
    monthly_total = sum(
        service.amount for service in services
        if service.check_in_time and service.check_in_time >= month_start
    )

    return {
        "daily_turnover": daily_total,
        "monthly_turnover": monthly_total,
        "total_tasks": len(services),
        "total_count": len(services),
    }


@router.get("/dashboard")
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    month_start = datetime(now.year, now.month, 1)

    result = await db.execute(select(VehicleService).order_by(VehicleService.check_in_time.desc()))
    services = result.scalars().all()

    status_breakdown = {status.value: 0 for status in ServiceStatus}
    payment_breakdown = {mode.value: 0 for mode in PaymentMode}

    for service in services:
        if service.status:
            status_breakdown[service.status.value] += 1
        if service.payment_mode:
            payment_breakdown[service.payment_mode.value] += 1

    active_jobs = sum(
        1 for service in services
        if service.status in {ServiceStatus.PENDING, ServiceStatus.IN_PROGRESS}
    )
    doorstep_jobs = sum(1 for service in services if service.service_location == "Doorstep")
    daily_total = sum(
        service.amount for service in services
        if service.check_in_time and service.check_in_time >= today_start
    )
    monthly_total = sum(
        service.amount for service in services
        if service.check_in_time and service.check_in_time >= month_start
    )

    return {
        "summary": {
            "daily_turnover": daily_total,
            "monthly_turnover": monthly_total,
            "total_tasks": len(services),
            "active_tasks": active_jobs,
            "doorstep_tasks": doorstep_jobs,
        },
        "status_breakdown": status_breakdown,
        "payment_breakdown": payment_breakdown,
        "recent_tasks": [serialize_service(service) for service in services[:8]],
    }
