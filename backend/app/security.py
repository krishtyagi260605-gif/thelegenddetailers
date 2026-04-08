import base64
from datetime import datetime
import hashlib
import hmac
import json
import os
import secrets
import time

from fastapi import Header, HTTPException
from sqlalchemy import select

from .database import AsyncSessionLocal
from .models.legends import AppUser, UserRole


ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSCODE = os.getenv("ADMIN_PASSCODE", "legend5911")
ADMIN_TOKEN_SECRET = os.getenv("ADMIN_TOKEN_SECRET", "change-me-in-production")
ADMIN_TOKEN_TTL_SECONDS = int(os.getenv("ADMIN_TOKEN_TTL_SECONDS", str(60 * 60 * 12)))

OPS_OWNER_USERNAME = os.getenv("OPS_OWNER_USERNAME", ADMIN_USERNAME)
OPS_OWNER_NAME = os.getenv("OPS_OWNER_NAME", "Owner")
OPS_OWNER_PASSWORD = os.getenv("OPS_OWNER_PASSWORD", ADMIN_PASSCODE)
OPS_EMPLOYEE_USERNAME = os.getenv("OPS_EMPLOYEE_USERNAME", "employee")
OPS_EMPLOYEE_NAME = os.getenv("OPS_EMPLOYEE_NAME", "Employee")
OPS_EMPLOYEE_PASSWORD = os.getenv("OPS_EMPLOYEE_PASSWORD", "legendemployee")
OPS_EMPLOYEE_2_USERNAME = os.getenv("OPS_EMPLOYEE_2_USERNAME", "tld_begowal")
OPS_EMPLOYEE_2_NAME = os.getenv("OPS_EMPLOYEE_2_NAME", "TLD Begowal")
OPS_EMPLOYEE_2_PASSWORD = os.getenv("OPS_EMPLOYEE_2_PASSWORD", "TLDBegowal@2026")
OPS_EMPLOYEE_3_USERNAME = os.getenv("OPS_EMPLOYEE_3_USERNAME", "tld_phagwara_lpu")
OPS_EMPLOYEE_3_NAME = os.getenv("OPS_EMPLOYEE_3_NAME", "TLD Phagwara LPU")
OPS_EMPLOYEE_3_PASSWORD = os.getenv("OPS_EMPLOYEE_3_PASSWORD", "TLDPhagwaraLPU@2026")

PASSWORD_ITERATIONS = 240_000


def _sign(payload: str) -> str:
    digest = hmac.new(
        ADMIN_TOKEN_SECRET.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return digest


def _encode_payload(data: dict) -> str:
    payload = json.dumps(data, separators=(",", ":"))
    encoded = base64.urlsafe_b64encode(payload.encode("utf-8")).decode("utf-8")
    signature = _sign(encoded)
    return f"{encoded}.{signature}"


def _decode_payload(token: str) -> dict:
    try:
        encoded, signature = token.split(".", 1)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Invalid token format") from exc

    expected = _sign(encoded)
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=401, detail="Invalid token signature")

    try:
        payload = json.loads(base64.urlsafe_b64decode(encoded.encode("utf-8")).decode("utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid token payload") from exc

    if payload.get("exp", 0) < int(time.time()):
        raise HTTPException(status_code=401, detail="Token expired")

    return payload


def hash_password(password: str, salt: str | None = None) -> str:
    raw_salt = base64.urlsafe_b64decode(salt.encode("utf-8")) if salt else secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        raw_salt,
        PASSWORD_ITERATIONS,
    )
    salt_part = base64.urlsafe_b64encode(raw_salt).decode("utf-8")
    hash_part = base64.urlsafe_b64encode(digest).decode("utf-8")
    return f"{salt_part}${hash_part}"


def verify_password(password: str, encoded_hash: str) -> bool:
    try:
        salt_part, stored_hash = encoded_hash.split("$", 1)
    except ValueError:
        return False

    comparison = hash_password(password, salt=salt_part)
    _, generated_hash = comparison.split("$", 1)
    return hmac.compare_digest(stored_hash, generated_hash)


def create_admin_token(username: str) -> str:
    return _encode_payload(
        {
            "sub": username,
            "scope": "admin",
            "exp": int(time.time()) + ADMIN_TOKEN_TTL_SECONDS,
        }
    )


def verify_admin_token(token: str) -> dict:
    payload = _decode_payload(token)
    if payload.get("scope") != "admin":
        raise HTTPException(status_code=401, detail="Invalid admin token scope")
    return payload


def create_ops_token(user: AppUser) -> str:
    return _encode_payload(
        {
            "sub": user.username,
            "user_id": user.id,
            "role": user.role.value,
            "scope": "ops",
            "exp": int(time.time()) + ADMIN_TOKEN_TTL_SECONDS,
        }
    )


def verify_ops_token(token: str) -> dict:
    payload = _decode_payload(token)
    if payload.get("scope") != "ops":
        raise HTTPException(status_code=401, detail="Invalid app token scope")
    return payload


def authenticate_admin(username: str, passcode: str) -> str:
    if username.strip() != ADMIN_USERNAME or not hmac.compare_digest(passcode, ADMIN_PASSCODE):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    return create_admin_token(username)


async def require_admin(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing admin bearer token")
    token = authorization.replace("Bearer ", "", 1).strip()
    return verify_admin_token(token)


async def require_ops_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing app bearer token")
    token = authorization.replace("Bearer ", "", 1).strip()
    return verify_ops_token(token)


async def ensure_default_ops_users() -> None:
    defaults = [
        {
            "username": OPS_OWNER_USERNAME.strip(),
            "full_name": OPS_OWNER_NAME.strip(),
            "password": OPS_OWNER_PASSWORD,
            "role": UserRole.OWNER,
        },
        {
            "username": OPS_EMPLOYEE_USERNAME.strip(),
            "full_name": OPS_EMPLOYEE_NAME.strip(),
            "password": OPS_EMPLOYEE_PASSWORD,
            "role": UserRole.EMPLOYEE,
        },
        {
            "username": OPS_EMPLOYEE_2_USERNAME.strip(),
            "full_name": OPS_EMPLOYEE_2_NAME.strip(),
            "password": OPS_EMPLOYEE_2_PASSWORD,
            "role": UserRole.EMPLOYEE,
        },
        {
            "username": OPS_EMPLOYEE_3_USERNAME.strip(),
            "full_name": OPS_EMPLOYEE_3_NAME.strip(),
            "password": OPS_EMPLOYEE_3_PASSWORD,
            "role": UserRole.EMPLOYEE,
        },
    ]

    async with AsyncSessionLocal() as session:
        for item in defaults:
            if not item["username"] or not item["password"]:
                continue

            existing = await session.execute(
                select(AppUser).where(AppUser.username == item["username"])
            )
            user = existing.scalar_one_or_none()

            if user is None:
                session.add(
                    AppUser(
                        username=item["username"],
                        full_name=item["full_name"],
                        password_hash=hash_password(item["password"]),
                        role=item["role"],
                        is_active=True,
                    )
                )
                continue

            changed = False
            if not user.full_name:
                user.full_name = item["full_name"]
                changed = True
            if not user.password_hash:
                user.password_hash = hash_password(item["password"])
                changed = True
            if not user.role:
                user.role = item["role"]
                changed = True
            if changed:
                user.updated_at = datetime.utcnow()

        await session.commit()
