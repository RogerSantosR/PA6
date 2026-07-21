@echo off
setlocal enabledelayedexpansion
title Detener - Plataforma de Cursos

echo ==================================================
echo   PLATAFORMA DE CURSOS - Deteniendo servicios
echo ==================================================
echo.

set "PUERTOS=4000 5173 4200 3000"

for %%P in (%PUERTOS%) do (
  set "ENCONTRADO="
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":%%P " ^| findstr LISTENING') do (
    set "ENCONTRADO=1"
    echo   Deteniendo puerto %%P  -^>  PID %%A
    taskkill /F /PID %%A >nul 2>&1
  )
  if not defined ENCONTRADO echo   Puerto %%P: no habia servicio activo.
)

echo.
echo   Servicios detenidos. Puedes cerrar las ventanas que
echo   hayan quedado abiertas.
echo ==================================================
echo.
pause
