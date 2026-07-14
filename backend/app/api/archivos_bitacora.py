from typing import Annotated, List

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.archivo_bitacora import ArchivoOut
from app.services.archivo_service import (
    guardar_archivos_bitacora,
    listar_archivos_bitacora,
    eliminar_archivo_bitacora,
)

router = APIRouter()


@router.post("/{bitacora_id}/archivos", response_model=List[ArchivoOut])
async def subir_archivos(
    bitacora_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    files: List[UploadFile] = File(...),
):
    return await guardar_archivos_bitacora(db, bitacora_id, current_user.id, files)


@router.get("/{bitacora_id}/archivos", response_model=List[ArchivoOut])
def listar_archivos(
    bitacora_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return listar_archivos_bitacora(db, bitacora_id, current_user.id)


@router.delete("/{bitacora_id}/archivos/{archivo_id}")
def eliminar_archivo(
    bitacora_id: int,
    archivo_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    archivo = eliminar_archivo_bitacora(db, bitacora_id, archivo_id, current_user.id)
    return {"ok": True, "archivo_id": archivo.id}