from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import Base, engine
import app.models  # importante para registrar modelos
from app.api.auth import router as auth_router
from app.api.bitacoras import router as bitacoras_router
from app.api.archivos_bitacora import router as archivos_router
from app.api.catalogos import router as catalogos_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mesa de Ayuda API (dev)", version=settings.APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/version")
async def version():
    return {"version": settings.APP_VERSION}


app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(bitacoras_router, prefix="/bitacoras", tags=["Bitácoras"])
app.include_router(archivos_router, prefix="/bitacoras", tags=["Archivos de Bitácora"])
app.include_router(catalogos_router, prefix="/catalogos", tags=["Catálogos"])