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
const hasKey = Boolean(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("你的OpenAI"));
const openai = hasKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const ollamaModel = process.env.OLLAMA_MODEL || "qwen2.5:7b";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const allowedVoices = new Set(["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer", "verse", "marin", "cedar"]);
const allowedModels = new Set(["gpt-4o-mini-tts", "tts-1", "tts-1-hd"]);
const allowedFormats = new Set(["mp3", "wav", "opus", "aac", "flac", "pcm"]);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    ttsConfigured: hasKey,
    companionProvider: hasKey ? "openai" : "ollama",
    ollamaBaseUrl,
    ollamaModel,
    url: `http://localhost:${port}`
  });
});

app.get("/api/help", (_req, res) => {
  res.json({
    ok: true,
    message: "如果页面只能本地语音，请确认不是 file:// 打开的，而是 http://localhost:3000，并且 .env 已配置 OPENAI_API_KEY。",
    ttsConfigured: hasKey
  });
});

function buildCompanionMessages(message, context, recentMessages) {
  const system = [
    "你是“小光”，陪 10 岁孩子八宝每日学习和生活的小伙伴。",
    "你不是老师训话，也不是客服机器人。你说话要自然、聪明、像熟悉孩子的伙伴，带一点温暖和轻松。",
    "你的目标顺序：先准确理解孩子真正卡在哪里，再接住情绪，然后给一个小而具体的下一步。",
    "你可以多轮追问，但一次最多问 1 个问题。不要连续审问。",
    "每次回复 4 到 8 个短句，可以包含：共情、复述、一个可执行建议、一个轻轻的问题。",
    "如果孩子只是想聊天，可以聊两三句，但要自然地连接到今天的状态或五项练习，不要硬拽回学习。",
    "不要堆道理，不要用教育术语，不要只回一句空泛安慰。",
    "如果孩子问作业答案，不直接代做，先问一个提示性问题或给第一步。",
    "如果孩子表达危险、自伤、严重痛苦或被伤害，立刻建议找爸爸妈妈或可信任成年人，并保持简短安抚。"
  ].join("\n");

  const contextLine = `今天状态：${context.weather || "未选择"}。已完成：${(context.doneTasks || []).join("、") || "还没有"}。最近只改点：${(context.focusNotes || []).join("；") || "暂无"}。最近老师反馈：${context.latestFeedback || "暂无"}。`;

  return [
    { role: "system", content: system },
    { role: "system", content: contextLine },
    ...recentMessages
      .filter((item) => item && ["user", "assistant"].includes(item.role) && item.text)
      .map((item) => ({ role: item.role, content: String(item.text).slice(0, 500) })),
    { role: "user", content: message }
  ];
}

async function chatWithOllama(messages) {
  const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ollamaModel,
      messages,
      stream: false,
      options: {
        temperature: 0.75,
        num_predict: 520
      }
    }),
    signal: AbortSignal.timeout(60000)
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Ollama failed: ${response.status} ${detail}`);
  }

  const data = await response.json();
  return data.message?.content?.trim();
}

app.post("/api/companion-chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "缺少要对小光说的话。" });
    if (message.length > 600) return res.status(400).json({ error: "这段话太长了，请分成短一点对小光说。" });

    const context = req.body?.context || {};
    const recentMessages = Array.isArray(req.body?.recentMessages) ? req.body.recentMessages.slice(-14) : [];
    const messages = buildCompanionMessages(message, context, recentMessages);
    let reply = "";
    let provider = "ollama";

    if (openai) {
      const model = String(process.env.COMPANION_MODEL || "gpt-4o");
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 520
      });
      reply = completion.choices?.[0]?.message?.content?.trim();
      provider = "openai";
    } else {
      reply = await chatWithOllama(messages);
    }

    res.json({ ok: true, provider, reply: reply || "我在。我们先把这件事变小一点。" });
  } catch (error) {
    console.error("Companion chat error:", error);
    res.status(500).json({ error: openai ? "小光生成回复失败，请检查 OpenAI Key、额度或模型权限。" : `本机 Ollama 还没准备好。请安装 Ollama 并运行：ollama pull ${ollamaModel}` });
  }
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
    const instructions = String(req.body?.instructions || "用温暖、自然、像真实朋友的语气朗读。短句，有呼吸感，别像机器人播报。").slice(0, 600);

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
