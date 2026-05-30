import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const hasKey = Boolean(process.env.OPENAI_API_KEY);
const openai = hasKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const allowedVoices = new Set(["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer", "verse", "marin", "cedar"]);
const allowedModels = new Set(["gpt-4o-mini-tts", "tts-1", "tts-1-hd"]);
const allowedFormats = new Set(["mp3", "wav", "opus", "aac", "flac", "pcm"]);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ttsConfigured: hasKey, url: `http://localhost:${port}` });
});

app.get("/api/help", (_req, res) => {
  res.json({
    ok: true,
    message: "如果页面只能本地语音，请确认不是 file:// 打开的，而是 http://localhost:3000，并且 .env 已配置 OPENAI_API_KEY。",
    ttsConfigured: hasKey
  });
});

app.post("/api/tts", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: "后端没有配置 OPENAI_API_KEY，请先复制 .env.example 为 .env 并填入 Key。" });
    }

    const text = String(req.body?.text || "").trim();
    if (!text) return res.status(400).json({ error: "缺少要朗读的文字。" });
    if (text.length > 1800) return res.status(400).json({ error: "文字太长，请控制在 1800 字以内。" });

    const voice = allowedVoices.has(req.body?.voice) ? req.body.voice : "cedar";
    const model = allowedModels.has(req.body?.model) ? req.body.model : "gpt-4o-mini-tts";
    const response_format = allowedFormats.has(req.body?.format) ? req.body.format : "mp3";
    const instructions = String(req.body?.instructions || "用温暖、自然、鼓励的语气朗读，像一个陪孩子成长的伙伴。").slice(0, 600);

    const speech = await openai.audio.speech.create({
      model,
      voice,
      input: text,
      response_format,
      instructions: model === "gpt-4o-mini-tts" ? instructions : undefined
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    res.setHeader("Content-Type", response_format === "mp3" ? "audio/mpeg" : `audio/${response_format}`);
    res.setHeader("Cache-Control", "no-store");
    res.send(buffer);
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ error: "生成高级语音失败，请检查 API Key、网络或模型权限。" });
  }
});

app.listen(port, () => {
  console.log(`小光 V11 学习操作系统已启动：http://localhost:${port}`);
  console.log(hasKey ? "高级 TTS：已配置" : "高级 TTS：未配置 OPENAI_API_KEY，将使用浏览器本地语音兜底");
});
