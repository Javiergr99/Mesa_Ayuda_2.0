from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.database import Base, engine
import app.models

from app.api.archivos_bitacora import (
    router as archivos_router,
)
from app.api.auth import router as auth_router
from app.api.bitacoras import (
    router as bitacoras_router,
)
from app.api.catalogos import (
    router as catalogos_router,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mesa de Ayuda API",
    version=settings.APP_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=[
        "Accept",
        "Content-Type",
        "X-Requested-With",
        "X-CSRF-Token",
    ],
)

UNSAFE_METHODS = {
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
}


@app.middleware("http")
async def reject_untrusted_browser_origin(
    request: Request,
    call_next,
):
    origin = request.headers.get("origin")

    if request.method in UNSAFE_METHODS and origin:
        normalized_origin = origin.rstrip("/")
        request_origin = (
            f"{request.url.scheme}://"
            f"{request.url.netloc}"
        ).rstrip("/")

        origin_is_allowed = (
            normalized_origin in settings.cors_origins
            or normalized_origin == request_origin
        )

        if not origin_is_allowed:
            return JSONResponse(
                status_code=403,
                content={
                    "detail": "Origen no permitido",
                },
            )

    return await call_next(request)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/version")
async def version():
    return {
        "version": settings.APP_VERSION,
    }


app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"],
)
app.include_router(
    bitacoras_router,
    prefix="/bitacoras",
    tags=["Bitácoras"],
)
app.include_router(
    archivos_router,
    prefix="/bitacoras",
    tags=["Archivos de Bitácora"],
)
app.include_router(
    catalogos_router,
    prefix="/catalogos",
    tags=["Catálogos"],
)
