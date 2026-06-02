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

- CLT 认知负荷：大脑堵车检查
- ICAP：P/A/C/I 学习动作升级
- 刻意练习：今日只改一错
- 知识地图：表征、图式、心智模型、解释框架
- 综合调研：真问题、共识、争议、误区、1 分钟答案
- 默会知识：手感、场感、气息、味道
- 可取困难：提取、间隔、交错、具身学习
- 知识迁移：拥抱真实场景，桥接共同结构

## 给 Codex 的建议

打开页面里的「Codex」标签，复制提示词给 Codex 继续开发。
