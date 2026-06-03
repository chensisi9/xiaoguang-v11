#!/bin/bash
set -e
cd "$(dirname "$0")"
clear
echo "========================================"
echo " 大白 · 一键启动"
echo "========================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "❌ 没检测到 Node.js。请先安装 Node.js LTS："
  echo "   https://nodejs.org/"
  echo ""
  read -p "按回车退出..."
  exit 1
fi

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "✅ 已自动创建 .env 文件。"
fi

if grep -q "你的OpenAI_API_Key" .env || ! grep -q "OPENAI_API_KEY=sk-" .env; then
  echo "⚠️ 你还没有在 .env 里填 OpenAI API Key。"
  echo "   我会先打开 .env，请把 OPENAI_API_KEY= 后面改成你的 Key，然后保存。"
  echo ""
  open -a TextEdit .env || open .env
  echo "保存 .env 后，回到这个窗口按回车继续启动。"
  read -p "按回车继续..."
fi

if [ ! -d "node_modules" ]; then
  echo "📦 正在安装依赖 npm install ..."
  npm install
fi

echo "🚀 正在启动大白后端..."
echo "浏览器地址：http://localhost:3000"
echo "关闭这个窗口，大白后端也会停止。"
(open "http://localhost:3000" >/dev/null 2>&1 || true) &
npm start
