from datetime import datetime
import enum

from sqlalchemy import Boolean, Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text

from ..database import Base


class PaymentMode(str, enum.Enum):
    CASH = "Cash"
    ONLINE = "Online"


class ServiceStatus(str, enum.Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    DELIVERED = "Delivered"


class UserRole(str, enum.Enum):
    OWNER = "owner"
    EMPLOYEE = "employee"


class AppUser(Base):
    __tablename__ = "app_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, index=True, nullable=True)
    alt_phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True, index=True)
    plate_number = Column(String, unique=True, index=True, nullable=False)
    brand = Column(String, nullable=True)
    model = Column(String, nullable=False)
    color = Column(String, nullable=True)
    fuel_type = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class VehicleService(Base):
    __tablename__ = "vehicle_services"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True, index=True)
    created_by_user_id = Column(Integer, ForeignKey("app_users.id"), nullable=True, index=True)
    customer_name = Column(String, default="Client")
    customer_phone = Column(String, nullable=True)
    vehicle_brand = Column(String, nullable=True)
    plate_number = Column(String, index=True)
    car_model = Column(String)
    service_type = Column(String)
    amount = Column(Float)
    payment_mode = Column(Enum(PaymentMode), default=PaymentMode.CASH)
    status = Column(Enum(ServiceStatus), default=ServiceStatus.PENDING)
    check_in_time = Column(DateTime, default=datetime.utcnow)
    completion_time = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    service_location = Column(String, default="In-Shop")
    assigned_to = Column(String, nullable=True)
