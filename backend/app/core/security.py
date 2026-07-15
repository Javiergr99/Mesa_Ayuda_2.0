from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Annotated
import base64
import hashlib
import hmac
import json

from fastapi import Depends, HTTPException, Request, Response
from passlib.context import CryptContext
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import TokenPayload


class JWTError(Exception):
    pass


def _b64e(value: bytes) -> str:
    return (
        base64.urlsafe_b64encode(value)
        .rstrip(b"=")
        .decode("ascii")
    )


def _b64d(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(
        (value + padding).encode("ascii")
    )


def jwt_encode(payload: dict, secret: str) -> str:
    header = _b64e(
        json.dumps(
            {"alg": "HS256", "typ": "JWT"},
            separators=(",", ":"),
        ).encode("utf-8")
    )
    body = _b64e(
        json.dumps(
            payload,
            separators=(",", ":"),
        ).encode("utf-8")
    )
    signature = _b64e(
        hmac.new(
            secret.encode("utf-8"),
            f"{header}.{body}".encode("ascii"),
            hashlib.sha256,
        ).digest()
    )

    return f"{header}.{body}.{signature}"


def jwt_decode(token: str, secret: str) -> dict:
    try:
        encoded_header, encoded_payload, encoded_signature = (
            token.split(".")
        )
    except ValueError as error:
        raise JWTError("Token malformado") from error

    try:
        header = json.loads(
            _b64d(encoded_header).decode("utf-8")
        )
        payload = json.loads(
            _b64d(encoded_payload).decode("utf-8")
        )
        supplied_signature = _b64d(encoded_signature)
    except Exception as error:
        raise JWTError("Token inválido") from error

    if not isinstance(header, dict) or not isinstance(payload, dict):
        raise JWTError("Token inválido")

    if header.get("alg") != "HS256" or header.get("typ") != "JWT":
        raise JWTError("Algoritmo de token no permitido")

    expected_signature = hmac.new(
        secret.encode("utf-8"),
        f"{encoded_header}.{encoded_payload}".encode("ascii"),
        hashlib.sha256,
    ).digest()

    if not hmac.compare_digest(
        expected_signature,
        supplied_signature,
    ):
        raise JWTError("Firma inválida")

    expiration = payload.get("exp")
    if expiration is None:
        raise JWTError("Token sin expiración")

    try:
        expiration_timestamp = int(expiration)
    except (TypeError, ValueError) as error:
        raise JWTError("Expiración inválida") from error

    current_timestamp = int(
        datetime.now(timezone.utc).timestamp()
    )

    if current_timestamp >= expiration_timestamp:
        raise JWTError("Token expirado")

    return payload


pwd_ctx = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)


def verify_password(
    password: str,
    password_hash: str,
) -> bool:
    return pwd_ctx.verify(password, password_hash)


def create_access_token(sub: str) -> str:
    now = datetime.now(timezone.utc)
    expiration = now + timedelta(
        minutes=settings.ACCESS_TTL_MIN
    )

    return jwt_encode(
        {
            "sub": sub,
            "iat": int(now.timestamp()),
            "exp": int(expiration.timestamp()),
        },
        settings.JWT_SECRET,
    )


def set_auth_cookie(
    response: Response,
    token: str,
) -> None:
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        max_age=settings.ACCESS_TTL_MIN * 60,
        path=settings.COOKIE_PATH,
        domain=settings.cookie_domain,
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.COOKIE_NAME,
        path=settings.COOKIE_PATH,
        domain=settings.cookie_domain,
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
    )


def set_no_store_headers(response: Response) -> None:
    response.headers["Cache-Control"] = (
        "no-store, no-cache, must-revalidate, max-age=0"
    )
    response.headers["Pragma"] = "no-cache"


def token_from_cookie(request: Request) -> str:
    token = request.cookies.get(settings.COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=401,
            detail="No autenticado",
        )

    return token


def get_current_user(
    request: Request,
    db: Annotated[Session, Depends(get_db)],
) -> User:
    try:
        decoded = jwt_decode(
            token_from_cookie(request),
            settings.JWT_SECRET,
        )
        token_payload = TokenPayload(**decoded)
        user_id = int(token_payload.sub)
    except (
        JWTError,
        ValidationError,
        TypeError,
        ValueError,
    ) as error:
        raise HTTPException(
            status_code=401,
            detail="No autenticado",
        ) from error

    user = db.get(User, user_id)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=401,
            detail="No autenticado",
        )

    return user
