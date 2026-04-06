from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..database import get_db
from ..models.legends import (
    AppUser,
    Customer,
    PaymentMode,
    ServiceStatus,
    UserRole,
    Vehicle,
    VehicleService,
)
from ..security import (
    authenticate_admin,
    create_ops_token,
    require_admin,
    require_ops_user,
    verify_password,
)

router = APIRouter()


class AdminLogin(BaseModel):
    username: str
    passcode: str


class OpsLogin(BaseModel):
    username: str
    password: str


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


class CustomerPayload(BaseModel):
    id: Optional[int] = None
    fullName: str = Field(..., min_length=2)
    phone: Optional[str] = None
    altPhone: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None


class VehiclePayload(BaseModel):
    id: Optional[int] = None
    plateNumber: str = Field(..., min_length=5)
    brand: Optional[str] = None
    model: str = Field(..., min_length=2)
    color: Optional[str] = None
    fuelType: Optional[str] = None
    notes: Optional[str] = None


class OpsJobCreate(BaseModel):
    customer: CustomerPayload
    vehicle: VehiclePayload
    serviceType: str
    amount: float = Field(..., gt=0)
    paymentMode: str
    serviceLocation: str = "In-Shop"
    assignedTo: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class OpsJobUpdate(BaseModel):
    status: Optional[str] = None
    serviceType: Optional[str] = None
    amount: Optional[float] = Field(default=None, gt=0)
    paymentMode: Optional[str] = None
    serviceLocation: Optional[str] = None
    assignedTo: Optional[str] = None
    notes: Optional[str] = None


def normalize_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned or None


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


def serialize_user(user: AppUser) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role.value if user.role else UserRole.EMPLOYEE.value,
    }


def serialize_customer(customer: Customer) -> dict:
    return {
        "id": customer.id,
        "full_name": customer.full_name,
        "phone": customer.phone,
        "alt_phone": customer.alt_phone,
        "address": customer.address,
        "notes": customer.notes,
        "created_at": customer.created_at.isoformat() if customer.created_at else None,
        "updated_at": customer.updated_at.isoformat() if customer.updated_at else None,
    }


def serialize_vehicle(vehicle: Vehicle) -> dict:
    return {
        "id": vehicle.id,
        "customer_id": vehicle.customer_id,
        "plate_number": vehicle.plate_number,
        "brand": vehicle.brand,
        "model": vehicle.model,
        "color": vehicle.color,
        "fuel_type": vehicle.fuel_type,
        "notes": vehicle.notes,
        "created_at": vehicle.created_at.isoformat() if vehicle.created_at else None,
        "updated_at": vehicle.updated_at.isoformat() if vehicle.updated_at else None,
    }


def serialize_service(service: VehicleService) -> dict:
    return {
        "id": service.id,
        "customer_id": service.customer_id,
        "vehicle_id": service.vehicle_id,
        "created_by_user_id": service.created_by_user_id,
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


async def get_app_user_or_401(user_id: int, db: AsyncSession) -> AppUser:
    result = await db.execute(select(AppUser).where(AppUser.id == user_id, AppUser.is_active.is_(True)))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="User session is no longer valid")
    return user


async def resolve_customer(payload: CustomerPayload, db: AsyncSession) -> Customer:
    customer = None

    if payload.id:
        result = await db.execute(select(Customer).where(Customer.id == payload.id))
        customer = result.scalar_one_or_none()

    if customer is None and payload.phone:
        result = await db.execute(select(Customer).where(Customer.phone == payload.phone.strip()))
        customer = result.scalar_one_or_none()

    if customer is None:
        customer = Customer(full_name=payload.fullName.strip())
        db.add(customer)
        await db.flush()

    customer.full_name = payload.fullName.strip()
    customer.phone = normalize_text(payload.phone)
    customer.alt_phone = normalize_text(payload.altPhone)
    customer.address = normalize_text(payload.address)
    customer.notes = normalize_text(payload.notes)
    customer.updated_at = datetime.utcnow()
    return customer


async def resolve_vehicle(payload: VehiclePayload, customer: Customer, db: AsyncSession) -> Vehicle:
    plate_number = payload.plateNumber.strip().upper()
    vehicle = None

    if payload.id:
        result = await db.execute(select(Vehicle).where(Vehicle.id == payload.id))
        vehicle = result.scalar_one_or_none()

    if vehicle is None:
        result = await db.execute(select(Vehicle).where(Vehicle.plate_number == plate_number))
        vehicle = result.scalar_one_or_none()

    if vehicle is None:
        vehicle = Vehicle(plate_number=plate_number, model=payload.model.strip())
        db.add(vehicle)
        await db.flush()

    vehicle.customer_id = customer.id
    vehicle.plate_number = plate_number
    vehicle.brand = normalize_text(payload.brand)
    vehicle.model = payload.model.strip()
    vehicle.color = normalize_text(payload.color)
    vehicle.fuel_type = normalize_text(payload.fuelType)
    vehicle.notes = normalize_text(payload.notes)
    vehicle.updated_at = datetime.utcnow()
    return vehicle


async def get_repeat_lookup(
    db: AsyncSession,
    phone: Optional[str] = None,
    plate: Optional[str] = None,
    query: Optional[str] = None,
) -> dict:
    customer: Optional[Customer] = None
    vehicle: Optional[Vehicle] = None
    recent_jobs: list[VehicleService] = []
    vehicles: list[Vehicle] = []

    if phone:
        result = await db.execute(select(Customer).where(Customer.phone == phone.strip()))
        customer = result.scalar_one_or_none()

    if plate:
        result = await db.execute(select(Vehicle).where(Vehicle.plate_number == plate.strip().upper()))
        vehicle = result.scalar_one_or_none()
        if vehicle and vehicle.customer_id:
            result = await db.execute(select(Customer).where(Customer.id == vehicle.customer_id))
            customer = result.scalar_one_or_none()

    if customer is None and query:
        like_query = f"%{query.strip()}%"
        result = await db.execute(
            select(Customer).where(
                or_(
                    Customer.full_name.ilike(like_query),
                    Customer.phone.ilike(like_query),
                )
            )
        )
        customer = result.scalars().first()

    if vehicle is None and query:
        like_query = f"%{query.strip()}%"
        result = await db.execute(
            select(Vehicle).where(
                or_(
                    Vehicle.plate_number.ilike(like_query),
                    Vehicle.model.ilike(like_query),
                )
            )
        )
        vehicle = result.scalars().first()
        if customer is None and vehicle and vehicle.customer_id:
            result = await db.execute(select(Customer).where(Customer.id == vehicle.customer_id))
            customer = result.scalar_one_or_none()

    if customer:
        result = await db.execute(
            select(Vehicle).where(Vehicle.customer_id == customer.id).order_by(Vehicle.updated_at.desc())
        )
        vehicles = result.scalars().all()

        result = await db.execute(
            select(VehicleService)
            .where(
                or_(
                    VehicleService.customer_id == customer.id,
                    VehicleService.customer_phone == customer.phone,
                )
            )
            .order_by(VehicleService.check_in_time.desc())
        )
        recent_jobs = result.scalars().all()

    if not recent_jobs and vehicle:
        result = await db.execute(
            select(VehicleService)
            .where(
                or_(
                    VehicleService.vehicle_id == vehicle.id,
                    VehicleService.plate_number == vehicle.plate_number,
                )
            )
            .order_by(VehicleService.check_in_time.desc())
        )
        recent_jobs = result.scalars().all()

    legacy_suggestion = None
    if customer is None and vehicle is None and (phone or plate or query):
        lookup = phone or plate or query or ""
        like_query = f"%{lookup.strip()}%"
        result = await db.execute(
            select(VehicleService)
            .where(
                or_(
                    VehicleService.customer_name.ilike(like_query),
                    VehicleService.customer_phone.ilike(like_query),
                    VehicleService.plate_number.ilike(like_query),
                    VehicleService.car_model.ilike(like_query),
                )
            )
            .order_by(VehicleService.check_in_time.desc())
        )
        legacy = result.scalars().first()
        if legacy:
            legacy_suggestion = {
                "customer": {
                    "full_name": legacy.customer_name,
                    "phone": legacy.customer_phone,
                },
                "vehicle": {
                    "plate_number": legacy.plate_number,
                    "brand": legacy.vehicle_brand,
                    "model": legacy.car_model,
                },
                "job": serialize_service(legacy),
            }

    return {
        "customer": serialize_customer(customer) if customer else None,
        "vehicle": serialize_vehicle(vehicle) if vehicle else None,
        "vehicles": [serialize_vehicle(item) for item in vehicles],
        "recent_jobs": [serialize_service(item) for item in recent_jobs[:8]],
        "legacy_suggestion": legacy_suggestion,
    }


@router.post("/admin/login")
async def admin_login(payload: AdminLogin):
    token = authenticate_admin(payload.username, payload.passcode)
    return {"token": token, "username": payload.username.strip()}


@router.get("/admin/session")
async def admin_session(_admin: dict = Depends(require_admin)):
    return {"status": "ok"}


@router.post("/ops/auth/login")
async def ops_login(payload: OpsLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AppUser).where(AppUser.username == payload.username.strip()))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user.updated_at = datetime.utcnow()
    await db.commit()
    return {
        "token": create_ops_token(user),
        "user": serialize_user(user),
    }


@router.get("/ops/auth/session")
async def ops_session(session_payload: dict = Depends(require_ops_user), db: AsyncSession = Depends(get_db)):
    user = await get_app_user_or_401(int(session_payload["user_id"]), db)
    return {"status": "ok", "user": serialize_user(user)}


@router.get("/ops/lookups/repeat")
async def ops_repeat_lookup(
    phone: Optional[str] = Query(default=None),
    plate: Optional[str] = Query(default=None),
    q: Optional[str] = Query(default=None),
    _session_payload: dict = Depends(require_ops_user),
    db: AsyncSession = Depends(get_db),
):
    if not any([phone, plate, q]):
        raise HTTPException(status_code=400, detail="Provide phone, plate, or q for repeat lookup")
    return await get_repeat_lookup(db=db, phone=phone, plate=plate, query=q)


@router.post("/ops/jobs")
async def ops_create_job(
    payload: OpsJobCreate,
    session_payload: dict = Depends(require_ops_user),
    db: AsyncSession = Depends(get_db),
):
    user = await get_app_user_or_401(int(session_payload["user_id"]), db)

    customer = await resolve_customer(payload.customer, db)
    vehicle = await resolve_vehicle(payload.vehicle, customer, db)

    service = VehicleService(
        customer_id=customer.id,
        vehicle_id=vehicle.id,
        created_by_user_id=user.id,
        customer_name=customer.full_name,
        customer_phone=customer.phone,
        vehicle_brand=vehicle.brand,
        plate_number=vehicle.plate_number,
        car_model=vehicle.model,
        service_type=payload.serviceType.strip(),
        amount=payload.amount,
        payment_mode=normalize_payment_mode(payload.paymentMode),
        status=normalize_service_status(payload.status) if payload.status else ServiceStatus.PENDING,
        notes=normalize_text(payload.notes),
        service_location=payload.serviceLocation.strip(),
        assigned_to=normalize_text(payload.assignedTo),
    )

    db.add(service)
    await db.commit()
    await db.refresh(service)
    return {
        "job": serialize_service(service),
        "customer": serialize_customer(customer),
        "vehicle": serialize_vehicle(vehicle),
    }


@router.get("/ops/jobs")
async def ops_get_jobs(
    q: Optional[str] = Query(default=None, min_length=2),
    status: Optional[str] = Query(default=None),
    limit: int = Query(default=60, ge=1, le=200),
    _session_payload: dict = Depends(require_ops_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(VehicleService).order_by(VehicleService.check_in_time.desc()).limit(limit)

    if q:
        like_query = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                VehicleService.customer_name.ilike(like_query),
                VehicleService.customer_phone.ilike(like_query),
                VehicleService.plate_number.ilike(like_query),
                VehicleService.car_model.ilike(like_query),
                VehicleService.service_type.ilike(like_query),
            )
        )

    if status:
        stmt = stmt.where(VehicleService.status == normalize_service_status(status))

    result = await db.execute(stmt)
    return [serialize_service(item) for item in result.scalars().all()]


@router.patch("/ops/jobs/{service_id}")
async def ops_update_job(
    service_id: int,
    payload: OpsJobUpdate,
    _session_payload: dict = Depends(require_ops_user),
    db: AsyncSession = Depends(get_db),
):
    service = await get_service_or_404(service_id, db)

    if payload.status is not None:
        service.status = normalize_service_status(payload.status)
        if service.status in {ServiceStatus.COMPLETED, ServiceStatus.DELIVERED}:
            service.completion_time = datetime.utcnow()
    if payload.serviceType is not None:
        service.service_type = payload.serviceType.strip()
    if payload.amount is not None:
        service.amount = payload.amount
    if payload.paymentMode is not None:
        service.payment_mode = normalize_payment_mode(payload.paymentMode)
    if payload.serviceLocation is not None:
        service.service_location = payload.serviceLocation.strip()
    if payload.assignedTo is not None:
        service.assigned_to = normalize_text(payload.assignedTo)
    if payload.notes is not None:
        service.notes = normalize_text(payload.notes)

    await db.commit()
    await db.refresh(service)
    return serialize_service(service)


@router.get("/ops/dashboard")
async def ops_dashboard(
    _session_payload: dict = Depends(require_ops_user),
    db: AsyncSession = Depends(get_db),
):
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    month_start = datetime(now.year, now.month, 1)

    jobs_result = await db.execute(select(VehicleService).order_by(VehicleService.check_in_time.desc()))
    jobs = jobs_result.scalars().all()

    customers_result = await db.execute(select(Customer))
    customers = customers_result.scalars().all()

    vehicles_result = await db.execute(select(Vehicle))
    vehicles = vehicles_result.scalars().all()

    active_jobs = [job for job in jobs if job.status in {ServiceStatus.PENDING, ServiceStatus.IN_PROGRESS}]
    repeat_customers = [customer for customer in customers if customer.phone]
    repeat_count = len({item.phone for item in repeat_customers if item.phone})
    daily_total = sum(job.amount for job in jobs if job.check_in_time and job.check_in_time >= today_start)
    monthly_total = sum(job.amount for job in jobs if job.check_in_time and job.check_in_time >= month_start)

    return {
        "summary": {
            "daily_turnover": daily_total,
            "monthly_turnover": monthly_total,
            "total_jobs": len(jobs),
            "active_jobs": len(active_jobs),
            "total_customers": len(customers),
            "total_vehicles": len(vehicles),
            "repeat_customers": repeat_count,
        },
        "recent_jobs": [serialize_service(job) for job in jobs[:10]],
        "active_board": [serialize_service(job) for job in active_jobs[:24]],
    }


@router.post("/services")
async def create_service(
    service: ServiceCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(require_admin),
):
    try:
        db_service = VehicleService(
            customer_name=service.customerName.strip(),
            customer_phone=normalize_text(service.customerPhone),
            vehicle_brand=normalize_text(service.vehicleBrand),
            plate_number=service.plateNumber.upper(),
            car_model=service.carModel,
            service_type=service.serviceType,
            amount=service.amount,
            payment_mode=normalize_payment_mode(service.paymentMode),
            notes=normalize_text(service.notes),
            service_location=service.serviceLocation,
            assigned_to=normalize_text(service.assignedTo),
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
        stmt = stmt.where(VehicleService.status == normalize_service_status(status))

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
