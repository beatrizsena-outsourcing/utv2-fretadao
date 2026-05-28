@echo off
chcp 65001 > nul
title Infleet — Iniciando Dashboard

echo.
echo  ██╗███╗   ██╗███████╗██╗     ███████╗███████╗████████╗
echo  ██║████╗  ██║██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝
echo  ██║██╔██╗ ██║█████╗  ██║     █████╗  █████╗     ██║
echo  ██║██║╚██╗██║██╔══╝  ██║     ██╔══╝  ██╔══╝     ██║
echo  ██║██║ ╚████║██║     ███████╗███████╗███████╗   ██║
echo  ╚═╝╚═╝  ╚═══╝╚═╝     ╚══════╝╚══════╝╚══════╝   ╚═╝
echo.
echo  Utilização de Frota — Iniciador Automático
echo  ============================================
echo.

:: ─────────────────────────────────────────────
:: PASSO 1: Verificar Node.js
:: ─────────────────────────────────────────────
echo [1/4] Verificando Node.js...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  ERRO: Node.js não encontrado!
    echo.
    echo  Por favor, instale o Node.js antes de continuar:
    echo  https://nodejs.org  ^(baixe a versão LTS^)
    echo.
    echo  Após instalar, feche e abra este arquivo novamente.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo  OK — Node.js %NODE_VER% encontrado.
echo.

:: ─────────────────────────────────────────────
:: PASSO 2: Verificar se estamos na pasta certa
:: ─────────────────────────────────────────────
echo [2/4] Verificando pasta do projeto...
if not exist "package.json" (
    echo.
    echo  ERRO: package.json não encontrado!
    echo.
    echo  Certifique-se de que este arquivo .bat está dentro
    echo  da pasta "utv2-frontend" (junto com package.json).
    echo.
    pause
    exit /b 1
)
echo  OK — Pasta correta detectada.
echo.

:: ─────────────────────────────────────────────
:: PASSO 3: Instalar dependências
:: ─────────────────────────────────────────────
echo [3/4] Instalando dependências (aguarde, pode levar 1-2 minutos)...
echo.
if exist "node_modules" (
    echo  Dependências já instaladas. Pulando...
) else (
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo  ERRO ao instalar dependências!
        echo  Verifique sua conexão com a internet e tente novamente.
        echo.
        pause
        exit /b 1
    )
    echo  OK — Dependências instaladas com sucesso.
)
echo.

:: ─────────────────────────────────────────────
:: PASSO 4: Verificar backend e subir frontend
:: ─────────────────────────────────────────────
echo [4/4] Iniciando o dashboard...
echo.

:: Tenta detectar se o backend está rodando
echo  Verificando backend em http://localhost:3000...
curl -s --max-time 3 http://localhost:3000 > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  AVISO: Backend não detectado em localhost:3000.
    echo.
    echo  O dashboard vai abrir, mas o mapa ficará vazio até
    echo  o backend estar rodando.
    echo.
    echo  Para ligar o backend, abra OUTRO terminal e rode:
    echo    cd C:\Users\beatr\OneDrive\Documentos\UTV2\src
    echo    npm start
    echo.
    echo  Pressione qualquer tecla para continuar mesmo assim...
    pause > nul
) else (
    echo  OK — Backend detectado e respondendo!
)
echo.

:: Abre o navegador após 4 segundos
echo  Abrindo o navegador em 4 segundos...
start /b cmd /c "timeout /t 4 > nul && start http://localhost:3001"

:: Sobe o frontend
echo.
echo  ============================================
echo   Dashboard rodando em: http://localhost:3001
echo   Pressione CTRL+C para encerrar
echo  ============================================
echo.
call npm run dev

:: Se chegar aqui, o servidor foi encerrado
echo.
echo  Servidor encerrado. Pressione qualquer tecla para fechar.
pause > nul
