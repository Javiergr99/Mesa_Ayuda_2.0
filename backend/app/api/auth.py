from typing import Annotated

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.core.security import (
    clear_auth_cookie,
    create_access_token,
    get_current_user,
    set_auth_cookie,
    set_no_store_headers,
)
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginIn,
    LoginResponse,
    RegisterIn,
)
from app.schemas.user import UserOut
from app.services.auth_service import (
    authenticate_user,
    register_user,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=UserOut,
    status_code=201,
)
def register(
    payload: RegisterIn,
    db: Annotated[Session, Depends(get_db)],
):
    return register_user(db, payload)


@router.post(
    "/login",
    response_model=LoginResponse,
)
def login(
    payload: LoginIn,
    response: Response,
    db: Annotated[Session, Depends(get_db)],
):
    user = authenticate_user(
        db,
        payload.identifier,
        payload.password,
    )

    token = create_access_token(
        sub=str(user.id),
    )

    set_auth_cookie(response, token)
    set_no_store_headers(response)

    return {
        "ok": True,
        "user": user,
    }


@router.get(
    "/me",
    response_model=UserOut,
)
def me(
    response: Response,
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
):
    set_no_store_headers(response)
    return current_user


@router.post("/logout")
def logout(response: Response):
    clear_auth_cookie(response)
    set_no_store_headers(response)

    return {"ok": True}
