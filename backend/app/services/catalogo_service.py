from sqlalchemy.orm import Session

from app.models.catalogos import (
    CatEstado,
    CatMunicipioOld,
    CatTipoCaso,
    CatEstatusBitacora,
    CatTipoRegistro,
    CatPersonaAtendio,
)


def obtener_estados(db: Session):
    return db.query(CatEstado).order_by(CatEstado.clave_estado).all()


def obtener_municipios(db: Session, clave_estado: str | None = None):
    query = db.query(CatMunicipioOld)
    if clave_estado:
        query = query.filter(CatMunicipioOld.clave_estado == clave_estado)
    return query.order_by(CatMunicipioOld.nombre).all()


def obtener_tipos_caso(db: Session):
    return (
        db.query(CatTipoCaso)
        .filter(CatTipoCaso.activo.is_(True))
        .order_by(CatTipoCaso.nombre)
        .all()
    )


def obtener_estatus_bitacora(db: Session):
    return (
        db.query(CatEstatusBitacora)
        .filter(CatEstatusBitacora.activo.is_(True))
        .order_by(CatEstatusBitacora.orden, CatEstatusBitacora.nombre)
        .all()
    )


def obtener_tipos_registro(db: Session):
    return (
        db.query(CatTipoRegistro)
        .filter(CatTipoRegistro.activo.is_(True))
        .order_by(CatTipoRegistro.clave)
        .all()
    )


def obtener_personas_atendio(db: Session):
    return (
        db.query(CatPersonaAtendio)
        .filter(CatPersonaAtendio.activo.is_(True))
        .order_by(CatPersonaAtendio.nombre_completo)
        .all()
    )