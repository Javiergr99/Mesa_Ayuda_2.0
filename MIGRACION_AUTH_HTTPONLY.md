# Migración a autenticación con cookie HttpOnly

## Objetivo

Eliminar el JWT de `localStorage` y del encabezado `Authorization`.
El backend entrega el JWT exclusivamente mediante una cookie `HttpOnly`.

## Archivos reemplazados

### Backend

- `backend/app/api/auth.py`
- `backend/app/core/config.py`
- `backend/app/core/security.py`
- `backend/app/main.py`
- `backend/app/schemas/auth.py`
- `backend/app/services/auth_service.py`

### Frontend

- `frontend/src/api/http.ts`
- `frontend/src/services/auth.service.ts`

### Nuevo archivo de referencia

- `backend/.env.auth.example`

## Configuración local recomendada

El frontend y el backend deben usar el mismo hostname.

Ejemplo consistente:

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8000`

Evita mezclar `localhost` con `127.0.0.1`, porque el navegador puede
tratarlos como sitios diferentes para el envío de cookies.

Copia las variables de `backend/.env.auth.example` al `.env` real del
backend sin reemplazar otras variables existentes.

Genera un secreto:

```powershell
py -c "import secrets; print(secrets.token_urlsafe(64))"
```

En desarrollo local con HTTP:

```env
ENVIRONMENT=development
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

En producción con HTTPS:

```env
ENVIRONMENT=production
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
```

Cuando frontend y backend estén en sitios realmente distintos:

```env
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

## Limpiar el token legado

Después de instalar la migración, abre la consola del navegador y ejecuta
una sola vez:

```javascript
localStorage.removeItem("token");
sessionStorage.removeItem("token");
location.reload();
```

El nuevo código ya no vuelve a utilizar Web Storage.

## Flujo final

1. `POST /auth/login` valida las credenciales.
2. El backend crea el JWT.
3. El backend establece la cookie `HttpOnly`.
4. El frontend no recibe ni guarda el JWT.
5. Axios envía la cookie mediante `withCredentials: true`.
6. `GET /auth/me` valida la cookie.
7. `POST /auth/logout` elimina la cookie.

## Validación

Backend:

```powershell
cd C:\xampp\htdocs\Proyectos\Mesa_Ayuda_2.0\backend
py -m compileall app
```

Frontend:

```powershell
cd C:\xampp\htdocs\Proyectos\Mesa_Ayuda_2.0\frontend
npx tsc --noEmit
npm run build
npx react-doctor@latest --verbose --no-telemetry
npx -y react-doctor@latest .
```

## Prueba con curl.exe

Login:

```powershell
curl.exe -i `
  -c auth-cookies.txt `
  -H "Content-Type: application/json" `
  -d "{\"username\":\"TU_USUARIO\",\"password\":\"TU_PASSWORD\"}" `
  http://127.0.0.1:8000/auth/login
```

Sesión:

```powershell
curl.exe -i `
  -b auth-cookies.txt `
  http://127.0.0.1:8000/auth/me
```

Logout:

```powershell
curl.exe -i `
  -b auth-cookies.txt `
  -c auth-cookies.txt `
  -X POST `
  http://127.0.0.1:8000/auth/logout
```

Después del logout, `/auth/me` debe responder `401`.
