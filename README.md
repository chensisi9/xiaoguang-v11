# 小光 V11 · 八宝学习操作系统

这是一个可交给 Codex 继续开发的版本：前端单页应用 + Node/Express 小后端 + OpenAI 高级 TTS 接口。

## 运行

```bash
npm install
cp .env.example .env
npm start
```

浏览器打开：

```text
http://localhost:3000
```

不要直接双击 `public/index.html`，否则高级 TTS 无法连接后端，只能使用浏览器本地语音。

## 不用 OpenAI 信用卡：本机 Ollama

如果没有 OpenAI API 额度，可以用本机模型跑“小光陪伴”：

1. 安装 Ollama：https://ollama.com/download
2. 下载中文能力较好的本机模型：

```bash
ollama pull qwen2.5:7b
```

3. 保持 Ollama 运行，然后启动小光：

```bash
npm start
```

`.env` 默认会使用：

```text
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

说明：Ollama 只适合本地电脑使用。Render 公网页无法访问你电脑里的本机模型；公开部署仍需要云端 AI 服务。没有 OpenAI 时，高级 TTS 也会回退到浏览器本地语音。

## 当前 V11 内核

- 八宝画像：高能量、高表达、高自尊、喜欢自由、有竞争感、运动型、好奇心强
- 小光身份：表达翻译官、训练教练、成长记录员、低能量保护者
- 每日任务：数学、英语、语文、口琴、网球
- 英语路线：3 句输出痕迹 -> 3 句 + because -> I think 观点句 -> 运动素材英文
- 训练节奏：5 分钟启动 -> 10 分钟主任务 -> 2 分钟反馈
- 陪伴边界：不检查式追问、不比较、不一上来纠错、不替孩子完成任务
- 低能量保护：普通版写 3 句，低能量版只说 3 句，最低版只填一个词也算赢

## 给 Codex 的建议

打开页面里的「Codex」标签，复制提示词给 Codex 继续开发。
