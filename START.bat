@echo off
echo ========================================
echo   佘杰的个人网站 - 快速启动
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败！
        pause
        exit /b 1
    )
) else (
    echo 依赖已安装
)

echo.
echo [2/3] 启动开发服务器...
echo.
echo ========================================
echo   服务器将在 http://localhost:5173 启动
echo   按 Ctrl+C 停止服务器
echo ========================================
echo.

call npm run dev

pause