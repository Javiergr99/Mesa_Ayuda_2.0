from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.catalogos import (
    EstadoOut,
    MunicipioOut,
    TipoCasoOut,
    EstatusBitacoraOut,
    TipoRegistroOut,
    PersonaAtendioOut,
)
from app.services.catalogo_service import (
    obtener_estados,
    obtener_municipios,
    obtener_tipos_caso,
    obtener_estatus_bitacora,
    obtener_tipos_registro,
    obtener_personas_atendio,
)

router = APIRouter()


@router.get("/estados", response_model=List[EstadoOut])
def catalogo_estados(
    db: Annotated[Session, Depends(get_db)],
):
    return obtener_estados(db)


@router.get("/municipios", response_model=List[MunicipioOut])
def catalogo_municipios(
    db: Annotated[Session, Depends(get_db)],
    clave_estado: Optional[str] = None,
):
    return obtener_municipios(db, clave_estado)


@router.get("/tipos-caso", response_model=List[TipoCasoOut])
def catalogo_tipos_caso(
    db: Annotated[Session, Depends(get_db)],
):
    return obtener_tipos_caso(db)


@router.get("/estatus-bitacora", response_model=List[EstatusBitacoraOut])
def catalogo_estatus_bitacora(
    db: Annotated[Session, Depends(get_db)],
):
    return obtener_estatus_bitacora(db)


@router.get("/tipos-registro", response_model=List[TipoRegistroOut])
def catalogo_tipos_registro(
    db: Annotated[Session, Depends(get_db)],
):
    return obtener_tipos_registro(db)


@router.get("/personas-atendio", response_model=List[PersonaAtendioOut])
def catalogo_personas_atendio(
    db: Annotated[Session, Depends(get_db)],
):
    return obtener_personas_atendio(db)