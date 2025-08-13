@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM Ir para a raiz do projeto (pasta deste .bat)
cd /d "%~dp0"
set "ROOT=%CD%"

echo ==============================================
echo  Portfólio • Setup e Execução (Windows .bat)
echo  Raiz: %ROOT%
echo ==============================================

goto :menu

:menu
  echo.
  echo Escolha uma opção:
  echo   [1] Setup rápido (instalar dependências e iniciar)
  echo   [2] Apenas rodar (não instala dependências)
  echo   [3] Importar currículo (PDF -> backend\\profile.json)
  echo   [0] Sair
  set /p "CHOICE=Digite 1, 2, 3 ou 0 e pressione ENTER: "
  if "%CHOICE%"=="1" goto setup_rapido
  if "%CHOICE%"=="2" goto apenas_rodar
  if "%CHOICE%"=="3" goto import_resume
  if "%CHOICE%"=="0" goto fim
  echo Opção inválida. Tente novamente.
  goto :menu

:setup_rapido
  call :verificar_ferramentas || goto :fim
  echo.
  echo [1/3] Backend: criando/atualizando venv...
  if not exist "%ROOT%\backend\.venv\Scripts\python.exe" (
    python -m venv "%ROOT%\backend\.venv"
    if errorlevel 1 (
      echo [ERRO] Falha ao criar o ambiente virtual em backend\.venv
      goto :fim
    )
  )

  echo.
  echo [2/3] Backend: instalando dependências (pip)...
  "%ROOT%\backend\.venv\Scripts\python.exe" -m pip install --upgrade pip >nul
  "%ROOT%\backend\.venv\Scripts\python.exe" -m pip install -r "%ROOT%\backend\requirements.txt"
  if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependências do backend.
    goto :fim
  )

  echo.
  echo [3/3] Frontend: instalando dependências (npm)...
  pushd "%ROOT%\frontend" >nul
  if exist package-lock.json (
    npm ci
  ) else (
    npm install
  )
  if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependências do frontend.
    popd >nul
    goto :fim
  )
  popd >nul

  goto :apenas_rodar

:apenas_rodar
  echo.
  echo Iniciando servidores em janelas separadas (PowerShell)...
  REM Backend (Flask) em PowerShell com venv
  start "portfolio-backend" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location '%ROOT%\backend'; & '.\\.venv\\Scripts\\Activate.ps1'; python app.py"

  REM Frontend (Vite) em PowerShell com navegador automático (--open)
  start "portfolio-frontend" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location '%ROOT%\frontend'; npm run dev -- --host --open"

  echo.
  echo Pronto! O navegador deverá abrir automaticamente em http://127.0.0.1:5173
  echo O frontend usa proxy para o backend em http://127.0.0.1:8000 (rota /api)
  echo Dica: edite backend\profile.json para atualizar seu conteúdo sem rebuild.
  goto :fim

:import_resume
  call :verificar_ferramentas || goto :fim
  echo.
  echo Importando dados do PDF para backend\profile.json ...
  if not exist "%ROOT%\backend\.venv\Scripts\python.exe" (
    python -m venv "%ROOT%\backend\.venv"
    if errorlevel 1 (
      echo [ERRO] Falha ao criar o ambiente virtual em backend\.venv
      goto :fim
    )
  )
  "%ROOT%\backend\.venv\Scripts\python.exe" -m pip install --upgrade pip >nul
  "%ROOT%\backend\.venv\Scripts\python.exe" -m pip install -r "%ROOT%\backend\requirements.txt" >nul
  pushd "%ROOT%\backend" >nul
  "%ROOT%\backend\.venv\Scripts\python.exe" import_resume.py
  if errorlevel 1 (
    echo [ERRO] Não foi possível importar o currículo. Verifique se o PDF existe na raiz do projeto.
    popd >nul
    goto :fim
  )
  popd >nul
  echo Concluído! Abra backend\profile.json para revisar os dados extraídos.
  goto :menu

:verificar_ferramentas
  where python >nul 2>nul
  if errorlevel 1 (
    echo [ERRO] Python não encontrado no PATH. Instale Python 3.10+ e tente novamente.
    exit /b 1
  )
  where node >nul 2>nul
  if errorlevel 1 (
    echo [ERRO] Node.js não encontrado no PATH. Instale Node 18+ e tente novamente.
    exit /b 1
  )
  where npm >nul 2>nul
  if errorlevel 1 (
    echo [ERRO] npm não encontrado no PATH. Verifique sua instalação do Node.js.
    exit /b 1
  )
  exit /b 0

:fim
endlocal