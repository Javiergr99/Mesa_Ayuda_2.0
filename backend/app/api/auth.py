from __future__ import annotations

from typing import Annotated
from urllib.parse import parse_qs
import json
import logging

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import RegisterIn, Token
from app.schemas.user import UserOut
from app.services.auth_service import register_user, authenticate_user

router = APIRouter()
logger = logging.getLogger("uvicorn.error")


@router.post("/register", response_model=UserOut, status_code=201)
def register(
    payload: RegisterIn,
    db: Annotated[Session, Depends(get_db)],
):
    return register_user(db, payload)


@router.post("/login", response_model=Token)
async def login(
    request: Request,
    response: Response,
    db: Annotated[Session, Depends(get_db)],
):
    ct = request.headers.get("content-type", "")
    raw = await request.body()
    logger.info("LOGIN CT=%s LEN=%s RAW_PREVIEW=%s", ct, len(raw), raw[:200])

    data: dict = {}

    if "multipart/form-data" in ct:
        try:
            form = await request.form()
            data = dict(form)
        except Exception as e:
            logger.warning("Error parseando multipart: %s", e)

    elif "application/x-www-form-urlencoded" in ct:
        try:
            qs = parse_qs(raw.decode("utf-8", errors="ignore"))
            data = {k: (v[0] if isinstance(v, list) and v else "") for k, v in qs.items()}
        except Exception as e:
            logger.warning("Error parseando urlencoded: %s", e)

    elif "application/json" in ct or (raw and raw.strip().startswith(b"{")):
        try:
            data = json.loads(raw.decode("utf-8", errors="ignore"))
            if not isinstance(data, dict):
                data = {}
        except Exception as e:
            logger.warning("Error parseando JSON: %s", e)

    if not data and raw:
        try:
            maybe = raw.decode("utf-8", errors="ignore").strip()
            if maybe.startswith("{") and maybe.endswith("}"):
                data = json.loads(maybe)
        except Exception:
            pass

    identifier = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""

    if not identifier or not password:
        raise HTTPException(status_code=422, detail="username/email y password son requeridos")

    user = authenticate_user(db, identifier, password)
    token = create_access_token(sub=str(user.id))

    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TTL_MIN * 60,
        path="/",
    )

    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(settings.COOKIE_NAME, path="/")
    return {"ok": True}