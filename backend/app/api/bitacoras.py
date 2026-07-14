from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.bitacora import BitacoraCreate, BitacoraOut, BitacoraUpdate
from app.services.bitacora_service import (
    crear_bitacora,
    listar_bitacoras_usuario,
    obtener_bitacora_usuario,
    actualizar_bitacora_usuario,
    eliminar_bitacora_usuario,
)

router = APIRouter()


@router.post("", response_model=BitacoraOut, status_code=201)
def crear(
    payload: BitacoraCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return crear_bitacora(db, payload, current_user)


@router.get("", response_model=List[BitacoraOut])
def listar(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return listar_bitacoras_usuario(db, current_user.id)


@router.get("/{bitacora_id}", response_model=BitacoraOut)
def obtener(
    bitacora_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return obtener_bitacora_usuario(db, bitacora_id, current_user.id)


@router.patch("/{bitacora_id}", response_model=BitacoraOut)
def actualizar(
    bitacora_id: int,
    payload: BitacoraUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return actualizar_bitacora_usuario(db, bitacora_id, current_user.id, payload)


@router.delete("/{bitacora_id}")
def eliminar(
    bitacora_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    eliminar_bitacora_usuario(db, bitacora_id, current_user.id)
    return {"ok": True}