from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Annotated
import base64
import hashlib
import hmac
import json

from fastapi import Depends, HTTPException, Request
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import TokenPayload


class JWTError(Exception):
    pass


def _b64e(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode("ascii")


def _b64d(s: str) -> bytes:
    return base64.urlsafe_b64decode((s + "=" * (-len(s) % 4)).encode("ascii"))


def jwt_encode(payload: dict, secret: str) -> str:
    header = _b64e(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    body = _b64e(json.dumps(payload).encode())
    sig = _b64e(
        hmac.new(secret.encode(), f"{header}.{body}".encode(), hashlib.sha256).digest()
    )
    return f"{header}.{body}.{sig}"


def jwt_decode(token: str, secret: str) -> dict:
    try:
        h, p, s = token.split(".")
    except ValueError as e:
        raise JWTError("Token malformado") from e

    expected = hmac.new(secret.encode(), f"{h}.{p}".encode(), hashlib.sha256).digest()
    if not hmac.compare_digest(expected, _b64d(s)):
        raise JWTError("Firma inválida")

    data = json.loads(_b64d(p))

    if "exp" in data:
        now_ts = int(datetime.now(timezone.utc).timestamp())
        if now_ts >= int(data["exp"]):
            raise JWTError("Expirado")

    return data


pwd_ctx = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_ctx.verify(password, password_hash)


def create_access_token(sub: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TTL_MIN)
    return jwt_encode({"sub": sub, "exp": int(exp.timestamp())}, settings.JWT_SECRET)


def token_from(request: Request) -> str:
    cookie_token = request.cookies.get(settings.COOKIE_NAME)
    if cookie_token:
        return cookie_token

    auth = request.headers.get("Authorization")
    if auth and auth.lower().startswith("bearer "):
        return auth.split(" ", 1)[1]

    raise HTTPException(status_code=401, detail="No autenticado")


def get_current_user(
    request: Request,
    db: Annotated[Session, Depends(get_db)],
) -> User:
    try:
        data = TokenPayload(**jwt_decode(token_from(request), settings.JWT_SECRET))
    except Exception:
        raise HTTPException(status_code=401, detail="No autenticado")

    user = db.get(User, int(data.sub))
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="No autenticado")

    return user