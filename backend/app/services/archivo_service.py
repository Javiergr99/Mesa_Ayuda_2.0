from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.archivo_bitacora import ArchivoBitacora
from app.services.bitacora_service import obtener_bitacora_usuario
from app.utils.file_handler import ensure_bitacora_dir, build_stored_name


async def guardar_archivos_bitacora(db: Session, bitacora_id: int, user_id: int, files):
    bitacora = obtener_bitacora_usuario(db, bitacora_id, user_id)

    saved = []
    bit_dir = ensure_bitacora_dir(bitacora.id)

    for f in files:
        safe_name, stored_name = build_stored_name(f.filename or "archivo")
        dest_path = bit_dir / stored_name

        content = await f.read()
        with dest_path.open("wb") as out:
            out.write(content)

        archivo = ArchivoBitacora(
            bitacora_id=bitacora.id,
            original_name=safe_name,
            stored_name=stored_name,
            content_type=f.content_type,
            size_bytes=len(content),
        )
        db.add(archivo)
        saved.append(archivo)

    db.commit()
    for archivo in saved:
        db.refresh(archivo)

    return saved


def listar_archivos_bitacora(db: Session, bitacora_id: int, user_id: int):
    obtener_bitacora_usuario(db, bitacora_id, user_id)

    return (
        db.query(ArchivoBitacora)
        .filter(ArchivoBitacora.bitacora_id == bitacora_id)
        .order_by(ArchivoBitacora.created_at.desc())
        .all()
    )


def eliminar_archivo_bitacora(db: Session, bitacora_id: int, archivo_id: int, user_id: int):
    obtener_bitacora_usuario(db, bitacora_id, user_id)

    archivo = (
        db.query(ArchivoBitacora)
        .filter(ArchivoBitacora.id == archivo_id, ArchivoBitacora.bitacora_id == bitacora_id)
        .first()
    )
    if not archivo:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    return archivo