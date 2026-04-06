import os

from dotenv import load_dotenv
from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./magic_engine.db")
SQL_ECHO = os.getenv("SQL_ECHO", "false").lower() == "true"

engine = create_async_engine(DATABASE_URL, echo=SQL_ECHO)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


async def ensure_schema() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

        def _migrate(sync_conn) -> None:
            inspector = inspect(sync_conn)
            if "vehicle_services" not in inspector.get_table_names():
                return

            existing_columns = {
                column["name"] for column in inspector.get_columns("vehicle_services")
            }
            needed_columns = {
                "customer_name": ("VARCHAR", "'Client'"),
                "customer_phone": ("VARCHAR", None),
                "vehicle_brand": ("VARCHAR", None),
                "service_location": ("VARCHAR", "'In-Shop'"),
                "assigned_to": ("VARCHAR", None),
            }

            for column_name, (column_type, default_value) in needed_columns.items():
                if column_name in existing_columns:
                    continue

                default_clause = f" DEFAULT {default_value}" if default_value else ""
                sync_conn.execute(
                    text(
                        f"ALTER TABLE vehicle_services "
                        f"ADD COLUMN {column_name} {column_type}{default_clause}"
                    )
                )

            if "customer_name" not in existing_columns:
                sync_conn.execute(
                    text(
                        "UPDATE vehicle_services "
                        "SET customer_name = COALESCE(notes, 'Client') "
                        "WHERE customer_name IS NULL OR customer_name = ''"
                    )
                )

            if "service_location" not in existing_columns:
                sync_conn.execute(
                    text(
                        "UPDATE vehicle_services "
                        "SET service_location = 'In-Shop' "
                        "WHERE service_location IS NULL OR service_location = ''"
                    )
                )

        await conn.run_sync(_migrate)


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
