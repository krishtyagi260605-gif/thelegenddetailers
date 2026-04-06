from datetime import datetime
import enum

from sqlalchemy import Column, DateTime, Enum, Float, Integer, String, Text

from ..database import Base


class PaymentMode(str, enum.Enum):
    CASH = "Cash"
    ONLINE = "Online"


class ServiceStatus(str, enum.Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    DELIVERED = "Delivered"


class VehicleService(Base):
    __tablename__ = "vehicle_services"

    id = Column(Integer, primary_key=True, index=True)
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
