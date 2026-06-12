export const englishProfile = {
  level: "听读强、口语积极、拼写写作补洞期",
  phonicsGaps: ["short vowels", "long vowels", "magic e", "blends", "digraphs", "vowel teams", "r-controlled vowels", "suffixes", "syllable division"],
  currentRazLevel: "待爸爸填写",
  currentLongmanUnit: "朗文新思维当前单元",
  currentHpChapter: "Harry Potter当前章节",
  weeklyThinkingSkill: "Why",
  strengths: ["listening", "speaking"],
  weaknesses: ["spelling", "writing", "recitation"]
};

export const phonics = {
  id: "phonics",
  icon: "🔤",
  title: "自然拼读补洞",
  cadence: "每次10分钟",
  purpose: ["看词能读", "听音能拼", "提升拼写", "降低背单词痛苦"],
  units: [
    ["short vowels", "读 cat, pen, sit, hop, cup；听音写1个词。"],
    ["long vowels", "比较 cap/cape, bit/bite；圈长元音。"],
    ["magic e", "看 magic e 怎么改变前面的元音。"],
    ["blends", "读 bl, cl, br, st, tr 开头的词。"],
    ["digraphs", "读 sh, ch, th, wh；听音选1组。"],
    ["vowel teams", "读 ai, ee, oa, ay；每组1个词。"],
    ["r-controlled vowels", "读 ar, er, ir, or, ur；听音分类。"],
    ["suffixes", "看 -s, -ed, -ing 怎么接在词尾。"],
    ["syllable division", "把 longer words 拆成两拍读。"]
  ]
};

export const longman = {
  id: "longman",
  icon: "📘",
  title: "朗文新思维英语",
  cadence: "每周2次",
  purpose: ["系统教材主线", "语法", "句型", "听说读写平衡", "课堂表达"],
  flow: ["听课文", "跟读重点句", "提取1个句型", "口头替换3次", "写3-5句", "大白只改一个点"]
};

export const raz = {
  id: "raz",
  icon: "📖",
  title: "RAZ分级阅读",
  cadence: "每周3-4篇",
  purpose: ["阅读量", "非虚构知识", "阅读理解", "summary能力"],
  flow: ["听一遍", "读一遍", "圈3个关键词", "说一句summary", "写3句输出"]
};

export const harryPotter = {
  id: "harryPotter",
  icon: "🪄",
  title: "Harry Potter原著项目",
  cadence: "每周1次",
  purpose: ["兴趣", "长文本", "人物分析", "思辨表达"],
  flow: ["剧情回顾", "听英文片段", "精读1页", "讨论人物", "写5句"]
};

export const thinkingSkills = [
  { id: "why", title: "Why", sentence: "I think it happened because ___." },
  { id: "compare", title: "Compare", sentence: "A is ___, but B is ___." },
  { id: "example", title: "Example", sentence: "For example, ___." },
  { id: "choice", title: "Choice", sentence: "I choose ___ because ___." },
  { id: "opposite", title: "Opposite", sentence: "The opposite idea is ___." },
  { id: "summary", title: "Summary", sentence: "This is about ___." }
];

export const speakingTemplates = [
  "I think ___ because ___.",
  "For example, ___.",
  "That’s why I think ___.",
  "I heard ___.",
  "I choose ___ because ___."
];

export const writingTemplates = {
  threeSentences: ["I think ___.", "One reason is ___.", "For example, ___."],
  fiveSentences: ["I think ___.", "One reason is ___.", "For example, ___.", "This shows ___.", "So I believe ___."],
  growthPath: "从3句到5句，再到一小段。"
};

export const phraseChunks = {
  dailyPattern: "每日1个句型",
  weeklyPattern: "每周1个4句小段",
  principle: "不背孤立单词，只背能直接使用的句型和词块。",
  chunks: ["I think ___ because ___.", "I heard ___.", "The main idea is ___.", "For example, ___.", "This shows ___."]
};

export const englishResources = {
  phonics,
  longman,
  raz,
  harryPotter,
  listening: {
    id: "listening",
    icon: "🎧",
    title: "听力输入",
    materials: ["RAZ音频", "Harry Potter有声片段", "英文动画", "TED-Ed", "National Geographic Kids", "运动英语视频"],
    task: "听懂大意，说出1个关键词，再说一句 I heard ___."
  },
  speaking: { id: "speaking", icon: "🎙️", title: "口语表达", templates: speakingTemplates },
  writing: { id: "writing", icon: "✍️", title: "写作小局", templates: writingTemplates },
  thinking: { id: "thinking", icon: "🧠", title: "思维训练", skills: thinkingSkills },
  chunks: { id: "chunks", icon: "🧩", title: "词块背诵", ...phraseChunks }
};

export const weeklyEnglishPlan = {
  monday: "Longman",
  tuesday: "Phonics + RAZ",
  wednesday: "Sports English",
  thursday: "Longman + Writing",
  friday: "Listening + Speaking",
  saturday: "Harry Potter Project",
  sunday: "Review"
};

const dayModules = [
  { key: "sunday", title: "Review", module: "review" },
  { key: "monday", title: "Longman", module: "longman" },
  { key: "tuesday", title: "Phonics + RAZ", module: "phonics" },
  { key: "wednesday", title: "Sports English", module: "sports" },
  { key: "thursday", title: "Longman + Writing", module: "writing" },
  { key: "friday", title: "Listening + Speaking", module: "listening" },
  { key: "saturday", title: "Harry Potter Project", module: "harryPotter" }
];

function dayIndex(date) {
  const [year, month, day] = String(date).slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function getWeeklyThinkingSkill(date) {
  return thinkingSkills[Math.floor(dayIndex(date) % thinkingSkills.length)];
}

export function getDailyEnglishTask({ date, energyMode = "normal" } = {}) {
  const day = dayModules[dayIndex(date || new Date().toISOString().slice(0, 10))] || dayModules[1];
  const thinking = getWeeklyThinkingSkill(date || new Date().toISOString().slice(0, 10));
  const low = {
    date,
    energyMode,
    recommendedModule: "listening",
    taskTitle: "低电量英语：听5分钟，说1句",
    subtitle: "英语不断线，不靠硬撑。",
    steps: ["听5分钟：RAZ音频/运动英语/英文动画任选一段", "说1句：I heard ___.", "背1个词块：I think ___ because ___."],
    outputRequirement: "说出1个关键词 + 1句 I heard ___.",
    outputPlaceholder: "可以直接说：I heard tennis. / I heard a new word.",
    onePointFeedback: "今天只改一个点：把关键词读慢一点。",
    thinkingSkill: thinking
  };
  const normal = {
    date,
    energyMode,
    recommendedModule: day.module === "harryPotter" ? "raz" : day.module,
    taskTitle: `${day.title}：一个英语小回合`,
    subtitle: "自然拼读10分钟 + RAZ/朗文15分钟 + 说写5分钟。",
    steps: day.module === "longman"
      ? longman.flow
      : day.module === "writing"
        ? ["朗文句型复用", "口头替换3次", "写3-5句", "大白只改一个点"]
        : day.module === "sports"
          ? ["看一段运动英语", "抓3个网球词", "说 I think ___ because ___."]
          : day.module === "listening"
            ? ["听5-8分钟：RAZ音频/原著片段/运动英语任选一段", "说1个关键词", "说一句 I heard ___.", "再补一句 I think ___ because ___."]
            : day.module === "review"
              ? ["回看本周1个英语输出", "重说1句更清楚的英文", "选1个下周继续练的词块"]
              : ["自然拼读10分钟", "RAZ或朗文15分钟", "说1句summary", "写3句输出"],
    outputRequirement: "留下1句口头英语 + 3句书面输出。",
    outputPlaceholder: "可以直接说：I think tennis is fun because ___. / This story is about ___.",
    onePointFeedback: "今天只改一个点：because 后面只接一个清楚理由。",
    thinkingSkill: thinking
  };
  const high = {
    date,
    energyMode,
    recommendedModule: day.module === "harryPotter" ? "harryPotter" : "raz",
    taskTitle: day.module === "harryPotter" ? "Harry Potter项目：人物选择" : "RAZ + 口语讨论 + 五句写作",
    subtitle: "状态好，做一次有想法的英语输出。",
    steps: day.module === "harryPotter" ? harryPotter.flow : ["听读RAZ或原著片段", "圈3个关键词", "口语讨论1分钟", "写5句观点"],
    outputRequirement: "用 I think ___ because ___ 讲清一个观点，写5句。",
    outputPlaceholder: "可以直接说：I think Harry is brave because ___. For example, ___.",
    onePointFeedback: "今天只改一个点：观点句先短，再补例子。",
    thinkingSkill: thinking
  };
  if (energyMode === "low") return low;
  if (energyMode === "high") return high;
  return normal;
}

export const dailyEnglishTask = getDailyEnglishTask({ date: new Date().toISOString().slice(0, 10), energyMode: "normal" });

export function getEnglishLearningMap() {
  return [phonics, longman, raz, harryPotter, englishResources.listening, englishResources.speaking, englishResources.writing, englishResources.thinking, englishResources.chunks];
}

export function getEnglishOnePointFeedback(output = "", task = {}) {
  const text = String(output || "").trim();
  if (!text) {
    return {
      good: "你已经打开英语舱。",
      focus: "先留下一句 I heard ___.",
      suggestion: "I heard tennis.",
      text: "今天只改一个点：先说一句 I heard ___. 你可以这样说：I heard tennis."
    };
  }
  const hasEnglish = /[a-z]/i.test(text);
  const hasBecause = /\bbecause\b/i.test(text);
  const hasHeard = /\bI heard\b/i.test(text);
  if (!hasEnglish) {
    return {
      good: "你先把意思说出来了。",
      focus: "补一句最短英文。",
      suggestion: "I heard a word.",
      text: "今天只改一个点：补一句最短英文。你可以这样说：I heard a word."
    };
  }
  if (task.recommendedModule === "listening" && !hasHeard) {
    return {
      good: "你已经抓到听力内容了。",
      focus: "用 I heard 开头。",
      suggestion: "I heard a tennis word.",
      text: "今天只改一个点：听力输出用 I heard 开头。你可以这样说：I heard a tennis word."
    };
  }
  if (/think/i.test(text) && !hasBecause) {
    return {
      good: "你已经有观点了。",
      focus: "补一个 because 理由。",
      suggestion: "I think it is interesting because it is new.",
      text: "今天只改一个点：观点后面加 because。你可以这样说：I think it is interesting because it is new."
    };
  }
  return {
    good: "你已经把英语声音放出来了。",
    focus: "最后一个关键词读慢一点。",
    suggestion: "把最重要的词单独读一遍。",
    text: "今天只改一个点：最后一个关键词读慢一点。你可以这样说：I heard tennis."
  };
}
