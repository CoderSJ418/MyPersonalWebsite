@echo off
echo ========================================
echo   佘杰的个人网站 - 构建生产版本
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
echo [2/3] 运行代码检查...
call npm run lint
if errorlevel 1 (
    echo 代码检查失败！
    pause
    exit /b 1
)

echo.
echo [3/3] 构建生产版本...
call npm run build
if errorlevel 1 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo   构建成功！
echo   输出目录: dist/
echo ========================================
echo.

echo 是否要预览构建结果？(Y/N)
set /p choice=

if /i "%choice%"=="Y" (
    echo.
    echo 启动预览服务器...
    call npm run preview
)

pause