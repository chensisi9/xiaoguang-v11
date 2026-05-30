@echo off
cd /d "%~dp0"
title 小光 V4 一键启动
echo ========================================
echo  小光 V4 · 一键启动
echo ========================================
echo.
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [错误] 没检测到 Node.js。请先安装 Node.js LTS: https://nodejs.org/
  pause
  exit /b 1
)
if not exist .env (
  copy .env.example .env >nul
  echo 已自动创建 .env 文件。
)
findstr /C:"OPENAI_API_KEY=sk-" .env >nul 2>nul
if %errorlevel% neq 0 (
  echo 你还没有在 .env 里填 OpenAI API Key。
  echo 请在打开的记事本里把 OPENAI_API_KEY= 后面改成你的 Key，然后保存。
  notepad .env
  pause
)
if not exist node_modules (
  echo 正在安装依赖 npm install ...
  npm install
)
echo 正在启动小光后端...
echo 浏览器地址：http://localhost:3000
start http://localhost:3000
npm start
pause
