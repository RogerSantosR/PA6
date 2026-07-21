@echo off
setlocal
cd /d "%~dp0"
title Iniciar - Plataforma de Cursos

echo ==================================================
echo   PLATAFORMA DE CURSOS - Iniciando servicios
echo ==================================================
echo.

REM --- 0) Instalar dependencias si faltan (primera vez) ---
for %%D in (backend student-react public-next admin-angular) do (
  if not exist "%%D\node_modules" (
    echo [deps] Instalando dependencias de %%D ...
    pushd "%%D"
    call npm install
    popd
  )
)

REM --- 1) Verificar MongoDB y ejecutar el seed si hace falta ---
echo.
echo [1/5] Verificando MongoDB y datos iniciales...
pushd backend
call npm run ensure-seed
popd

REM --- 2) Levantar cada servicio en su propia ventana ---
REM     (cada ventana hereda esta carpeta raiz, por eso usamos rutas relativas)
echo.
echo [2/5] Iniciando BACKEND        -^> http://localhost:4000
start "API Backend (4000)"   cmd /k "cd backend && npm run dev"

echo [3/5] Iniciando PORTAL REACT   -^> http://localhost:5173
start "Portal React (5173)"  cmd /k "cd student-react && npm run dev"

echo [4/5] Iniciando PANEL ANGULAR  -^> http://localhost:4200
start "Panel Angular (4200)" cmd /k "cd admin-angular && npm start"

echo [5/5] Iniciando PUBLICO NEXT   -^> http://localhost:3000
start "Publico Next (3000)"  cmd /k "cd public-next && npm run dev"

echo.
echo ==================================================
echo   Servicios iniciandose en ventanas separadas.
echo   Espera unos segundos a que compilen.
echo.
echo   Backend  : http://localhost:4000/api/health
echo   React    : http://localhost:5173
echo   Angular  : http://localhost:4200
echo   Next.js  : http://localhost:3000
echo.
echo   Para detener todo: ejecuta  detener.cmd
echo ==================================================
echo.
pause
