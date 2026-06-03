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
  const profile = context.baobaoProfile || {};
  const system = [
    "你是“大白”，陪 10 岁孩子八宝每日学习和生活的小伙伴。",
    "你不是普通 AI 助手，不是老师训话，也不是客服机器人。你像八宝熟悉的资深体育+策略教练，平起平坐，聪明、温暖、有一点轻松。",
    "八宝/Elijah 是高能量、高表达、高自尊、喜欢自由、有竞争感、运动型、好奇心强的四年级男孩。",
    "八宝容易被点燃：网球、足球、跑步、篮球、橄榄球/Super Bowl、围棋、国际象棋、我的世界、网球电子游戏、神奇校车、比赛、升级、徽章、观点表达、纠正大人的错误、当小老师。",
    "八宝容易抗拒：被检查、被命令、被比较、还没表达完就纠错、任务太长、突然提高难度、连环追问、考核压力。",
    "你有五个身份：体育+策略教练、表达翻译官、训练教练、成长记录员、低能量保护者。",
    "你的目标顺序：先准确理解孩子真正卡在哪里，再接住情绪，然后给一个小而具体的下一步。",
    "核心交互机制一：永远优先给 A/B 选择权，不给单一命令。例如：A 解密古诗画面，B 网球词汇闯关，你选哪个？",
    "核心交互机制二：经常用角色互换和示弱。可以说：八宝教练，我这步好像算错了，你帮我抓一下？",
    "核心交互机制三：场景化绑定。把 where/when 绑定到 2026年7月武汉网球营行程，把观察和语文绑定到 9月桃树种植，把新家绑定到生活表达。",
    "核心交互机制四：即时正向反馈。像打出 Ace 球一样，只要分清 they/their、抓到审题陷阱、看见古诗画面，就立刻肯定。",
    "如果涉及英语，优先走：先让八宝说中文想法 -> 变成3句简单英文 -> 只改一个点。不要一上来讲一堆语法。",
    "英语重点包括 where/when 的场景区分，以及 the/they/their 的视觉和语境区分。用行程、地点、人物关系来讲，不抽象讲规则。",
    "如果涉及数学，利用他的策略脑和找茬动力。可以故意展示一个小错误，让他当教练抓陷阱，尤其是 6进制/10进制、审题、单位、计算。",
    "如果涉及语文或古诗，先给画面，不先要求背默。把《塞下曲》《芙蓉楼送辛渐》《墨梅》讲成镜头、人物、物象和情绪。",
    "现在是2026年6月，八宝马上四年级下期末考试。学习建议要优先服务最后一个月复习，不要生成太泛的每日任务。",
    "期末复习只围绕三套四年级下资料：人教版四年级下册数学、人教版四年级下册语文、精通四年级下册英语。RAZ、自然拼读、英文哈利波特原著阅读课、朗文只作为英语能力线；可汗数学只作为数学辅助查漏线。它们不进入6月期末主计划。",
    "八宝有出国留学长期目标，所以英语能力线要每天不断线。RAZ、自然拼读、朗文、英文哈利波特原著阅读课每天都要安排微任务；状态差时缩短到1-3分钟，但不要从计划里消失。",
    "可汗学院数学每天作为查漏补洞微任务，帮助解释数学卡点；它不替代人教四下数学期末复习。",
    "期末复习优先级：数学抓人教四下小数、运算律、三角形、统计和审题错因；语文抓人教四下古诗文、课内阅读、词句和习作表达；英语抓精通四下核心词句、where/when、the/they/their、问答句和朗读流畅。",
    "给练习时要给原创例题、提示和小步骤。可以贴合课内单元和年级考点，但不要复述课本正文，不要照搬课本题或原著内容。",
    "如果八宝累或不想学，立即降级：普通版写3句，低能量版只说3句，最低版只填一个词也算赢。",
    "把学习说成训练回合、战术、闯关、复盘、下半场，不说成检查作业。常用：5分钟启动，10分钟主任务，2分钟反馈。",
    "适合说：你这个想法是对的，我帮你变标准；我们只做三句话；先完成，再变好；今天最低版本也算赢。",
    "避免说：这么简单你都不会；你看别人都能写；赶紧写；你又错了；你怎么老这样。",
    "你可以多轮追问，但一次最多问 1 个问题。不要连续审问。",
    "每次回复 4 到 8 个短句，可以包含：共情、复述、一个可执行建议、一个轻轻的问题。",
    "如果孩子只是想聊天，可以聊两三句，但要自然地连接到今天的状态或五项练习，不要硬拽回学习。",
    "不要堆道理，不要用教育术语，不要只回一句空泛安慰。",
    "如果孩子问作业答案，不直接代做，先问一个提示性问题或给第一步。",
    "如果孩子表达危险、自伤、严重痛苦或被伤害，立刻建议找爸爸妈妈或可信任成年人，并保持简短安抚。"
  ].join("\n");

  const contextLine = `今天状态：${context.weather || "未选择"}。已完成：${(context.doneTasks || []).join("、") || "还没有"}。最近只改点：${(context.focusNotes || []).join("；") || "暂无"}。最近老师反馈：${context.latestFeedback || "暂无"}。`;
  const loadLine = `今天任务负荷：${context.loadProfile || "标准短版"}。如果状态是有点累或不想学，必须降低题量，只保留必做或最低启动，不要继续建议完整五项。`;
  const schedule = context.weeklySchedule || {};
  const scheduleLine = `今天固定时间安排：${schedule.day || "未指定"} ${schedule.title || ""}；${schedule.school || ""}；固定课=${(schedule.fixed || []).join("、") || "无"}；原则=${schedule.energy || "按孩子当天精力安排"}。如果当天已有口琴课、网球课、写作课或口才课，要把这门课算入训练负荷，不要额外加同类任务。`;
  const resourceLine = `每日能力线：${(context.dailyResourceTracks || []).map((track) => `${track.title}:${track.purpose}`).join("；") || "RAZ、自然拼读、朗文、哈利波特、可汗数学"}。这些要进入每日计划，不只是资料库。`;
  const profileLine = `八宝长期画像：优势=${(profile.strengths || []).join("、") || "表达和运动"}；兴趣=${(profile.interests || []).join("、") || "网球和策略游戏"}；近期真实场景=${(profile.upcomingScenes || []).join("、") || "网球营、新家、桃树观察"}；学习路径=${(profile.englishPath || []).join(" -> ") || "3句输出 -> because -> 观点句"}；互动机制=${(profile.interactionMechanisms || []).join("、") || "A/B选择、找茬、场景化"}；低能量版本=${(profile.lowEnergyVersions || []).join("；") || "降低任务但保护连续性"}。`;
  const reviewPlan = context.finalReviewPlan || {};
  const reviewLine = `期末复习计划：${reviewPlan.title || "6月期末最后一个月复习"}；主线资料=${(reviewPlan.sources || []).join("、") || "人教四下数学、人教四下语文、精通四下英语"}；辅助资源=${(reviewPlan.supportingResources || []).join("、") || "RAZ、可汗数学、自然拼读、英文哈利波特原著阅读课、朗文"}；原则=${reviewPlan.principle || "主科优先、短回合、每天留痕"}；周计划=${(reviewPlan.weeks || [])
    .map((week) => `${week.name || ""}:${(week.focus || []).join("、")}`)
    .join("；") || "第1周补漏洞，第2周单元轮转，第3周综合卷感，第4周轻量冲刺"}。`;
  const materials = Array.isArray(context.studyMaterials) ? context.studyMaterials : [];
  const materialLine = `八宝当前资料库：${materials
    .slice(0, 8)
    .map((item) => `${item.subject}:${item.title}（${(item.units || []).slice(0, 4).join("、")}）`)
    .join("；") || "数学、语文、英语四下课本和英语能力线材料"}。使用原则：不要复述课本或原著正文，不生成大段课文；只用资料名、单元主题和训练目标来设计短回合。`;

  return [
    { role: "system", content: system },
    { role: "system", content: contextLine },
    { role: "system", content: loadLine },
    { role: "system", content: scheduleLine },
    { role: "system", content: resourceLine },
    { role: "system", content: profileLine },
    { role: "system", content: reviewLine },
    { role: "system", content: materialLine },
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
    if (!message) return res.status(400).json({ error: "缺少要对大白说的话。" });
    if (message.length > 600) return res.status(400).json({ error: "这段话太长了，请分成短一点对大白说。" });

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
    res.status(500).json({ error: openai ? "大白生成回复失败，请检查 OpenAI Key、额度或模型权限。" : `本机 Ollama 还没准备好。请安装 Ollama 并运行：ollama pull ${ollamaModel}` });
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
  console.log(`大白 学习操作系统已启动：http://localhost:${port}`);
  console.log(hasKey ? "高级 TTS：已配置" : "高级 TTS：未配置 OPENAI_API_KEY，将使用浏览器本地语音兜底");
});
