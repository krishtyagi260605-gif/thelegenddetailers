import base64
import hashlib
import hmac
import json
import os
import time

from fastapi import Header, HTTPException


ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSCODE = os.getenv("ADMIN_PASSCODE", "legend5911")
ADMIN_TOKEN_SECRET = os.getenv("ADMIN_TOKEN_SECRET", "change-me-in-production")
ADMIN_TOKEN_TTL_SECONDS = int(os.getenv("ADMIN_TOKEN_TTL_SECONDS", str(60 * 60 * 12)))


def _sign(payload: str) -> str:
    digest = hmac.new(
        ADMIN_TOKEN_SECRET.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return digest


def create_admin_token(username: str) -> str:
    payload = json.dumps(
        {
            "sub": username,
            "exp": int(time.time()) + ADMIN_TOKEN_TTL_SECONDS,
        },
        separators=(",", ":"),
    )
    encoded = base64.urlsafe_b64encode(payload.encode("utf-8")).decode("utf-8")
    signature = _sign(encoded)
    return f"{encoded}.{signature}"


def verify_admin_token(token: str) -> dict:
    try:
        encoded, signature = token.split(".", 1)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Invalid admin token format") from exc

    expected = _sign(encoded)
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=401, detail="Invalid admin token signature")

    try:
        payload = json.loads(base64.urlsafe_b64decode(encoded.encode("utf-8")).decode("utf-8"))
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid admin token payload") from exc

    if payload.get("exp", 0) < int(time.time()):
        raise HTTPException(status_code=401, detail="Admin token expired")

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
