import { baobaoProfile, companionLines, companionProfile, dadMessages, dailyResourceTracks, exampleBank, finalReviewPlan, humanToneLines, pagesDef, progressKeys, studyMaterials, teacherSubjects, TODAY, weeklySchedule } from "./modules/schema.js?v=20260612-growth-3";
import { actionPhrases, bodyPhrases, encouragementPhrases, englishPhrases, greetingPhrases, memoryPhrases, seededPhrase } from "./modules/dabaiPhrases.js?v=20260612-growth-3";
import {
  addCompanionMoment,
  addCompanionMessage,
  addDadNote,
  addTeacherFeedback,
  deleteHistoryItem,
  getWeekHistory,
  history,
  progressCount,
  save,
  setDone,
  setQuietMode,
  snapshotToday,
  state
} from "./modules/state.js?v=20260612-growth-3";

const nav = document.getElementById("nav");
const pages = document.getElementById("pages");
const progressNum = document.getElementById("progressNum");
const progressText = document.getElementById("progressText");
const bar = document.getElementById("bar");
const todayTitle = document.getElementById("todayTitle");
let audio = null;
let recognition = null;
let continuousCompanion = false;

const loadProfiles = {
  "很好": {
    name: "完整训练版",
    summary: "今天状态在线，可以做完整五项，但每项仍然只改一个点。",
    required: ["math", "english", "chinese", "harmonica", "tennis"],
    optional: [],
    paused: [],
    template: [
      "数学 25分钟：人教四下 12道计算/简算 + 3道图形/统计/应用题，记录1个错因。",
      "语文 25分钟：人教四下 1个课内点 + 1段阅读 + 1句写具体。",
      "英语 20分钟：精通四下听读 + 4组课本问答 + 3句输出。",
      "英语能力线 10分钟：RAZ/自然拼读/哈利波特三选一。",
      "可汗数学 10分钟：只补一个数学卡点。",
      "口琴 8分钟，网球 15分钟。"
    ],
    targets: {
      math: "完整版：12道小数/简算 + 3道三角形/统计/应用题。记录1个错因。",
      english: "完整版：精通四下听读1段 + 4组课本问答 + 3句输出。",
      chinese: "完整版：人教四下1个课内点 + 1段阅读 + 1句写具体。",
      harmonica: "完整版：8分钟，最乱4-8小节慢速三遍。",
      tennis: "完整版：15分钟，只练小垫步或击球点。"
    }
  },
  "还行": {
    name: "标准短版",
    summary: "今天不堆量，三科保留，口琴和网球缩短。",
    required: ["math", "english", "chinese", "harmonica", "tennis"],
    optional: [],
    paused: [],
    template: [
      "数学 20分钟：人教四下 10道计算/简算 + 2道图形/统计/应用题。",
      "语文 20分钟：人教四下 1个课内点 + 1段阅读。",
      "英语 15分钟：精通四下听读 + 3组课本问答 + 3句输出。",
      "英语能力线 5分钟：只选 RAZ/自然拼读/哈利波特一个。",
      "口琴 5分钟，网球 10分钟。"
    ],
    targets: {
      math: "短版：10道小数/简算 + 2道三角形/统计/应用题。只抓1个错因。",
      english: "短版：精通四下听读1段 + 3组课本问答 + 3句输出。",
      chinese: "短版：人教四下1个课内点 + 1段阅读，只留1句表达。",
      harmonica: "短版：5分钟，只练一个小节不乱。",
      tennis: "短版：10分钟，只练一个动作点。"
    }
  },
  "有点累": {
    name: "三科保底版",
    summary: "今天保护精力，只保留数学、语文、英语。口琴和网球变成可选小动作。",
    required: ["math", "english", "chinese"],
    optional: ["harmonica", "tennis"],
    paused: [],
    template: [
      "数学 12分钟：人教四下 6道计算/简算，只圈关键词和错因。",
      "语文 12分钟：人教四下 1个课内点，只说清楚画面或中心。",
      "英语 10分钟：精通四下听读 + 2组问答，只改1个易混点。",
      "可选：口琴3分钟或网球5分钟，二选一即可。"
    ],
    targets: {
      math: "保底版：6道小数/简算，只抓关键词和1个错因。",
      english: "保底版：精通四下听读1小段 + 2组课本问答。",
      chinese: "保底版：人教四下1个课内点，只说画面/中心，不大段写。",
      harmonica: "可选：3分钟，只吹最熟的一小段。",
      tennis: "可选：5分钟，只做挥拍或小垫步。"
    }
  },
  "不想学": {
    name: "最低启动版",
    summary: "今天目标不是完成全部，是打破不开局。只做一个最小学习动作。",
    required: ["math"],
    optional: ["english", "chinese"],
    paused: ["harmonica", "tennis"],
    template: [
      "必做 5分钟：数学只做3道最基础的人教四下题，圈关键词。",
      "可选 3分钟：英语只说1句精通四下句子，或语文只说1个课内画面。",
      "口琴和网球今天暂停，不补债。"
    ],
    targets: {
      math: "最低版：只做3道基础题，圈关键词，完成就算赢。",
      english: "可选：只说1句精通四下句子。",
      chinese: "可选：只说1个课内画面或1个关键词。",
      harmonica: "今日暂停：不补债。",
      tennis: "今日暂停：不补债。"
    }
  }
};

const wakeTitles = {
  "很好": [
    "战斗教室上线：今天打主动球",
    "舰队小队长日：把会的打稳",
    "零重力训练日：今天抓一个陷阱"
  ],
  "还行": [
    "轨道巡航日：少一点，但要准",
    "小队推进日：三科各赢一小局",
    "稳定航线日：不用猛冲，保持航线"
  ],
  "有点累": [
    "低电量护盾日：只做关键球",
    "轻装进舱日：少做也要留下痕迹",
    "慢速胜利日：今天不拼量"
  ],
  "不想学": [
    "最小引擎启动：先赢 5 分钟",
    "破冰入舱日：只开一个小口",
    "不想学也能赢：完成最小动作"
  ]
};

const badgeCatalog = [
  { id: "mistake-hunter", icon: "🏅", name: "错因猎人", subjects: ["math", "chinese", "english"] },
  { id: "steady-captain", icon: "🏅", name: "坚持船长", subjects: ["math", "english", "chinese", "harmonica", "tennis"] },
  { id: "brave-voice", icon: "🏅", name: "勇敢开口", subjects: ["english", "chinese"] },
  { id: "math-detective", icon: "🏅", name: "数学侦探", subjects: ["math"] },
  { id: "english-explorer", icon: "🏅", name: "英语探险家", subjects: ["english"] }
];

const exploreCountries = [
  ["中国", "🇨🇳"],
  ["日本", "🇯🇵"],
  ["澳洲", "🇦🇺"],
  ["英国", "🇬🇧"],
  ["美国", "🇺🇸"]
];

const moduleLaunchers = [
  ["learning", "📚", "学习小局", "一个小问题"],
  ["english", "🌍", "英语探索", "去远方"],
  ["body", "🎾", "身体舱", "身体上线"],
  ["music", "🎵", "音乐舱", "口琴一段"],
  ["chat", "💬", "聊聊天", "大白在听"]
];

const dabaiPromptLines = [
  "今天不用猛冲。",
  "先拿下一个小目标。",
  "我在这里，不催你。",
  "状态一般也没关系。",
  "今天只赢一小局就够。",
  "先说出来，后面都好改。",
  "你最近数学讲得更清楚了。",
  "英语先开口，不用一开始完美。",
  "网球那种小步调整，学习也能用。",
  "今天我们只改一个点。",
  "如果不想开始，就先做最小版本。",
  "我会记得你留下的小证据。",
  "先完成，再变好。",
  "今天可以慢一点，但不要消失。",
  "你不是任务列表，你是在长本领。",
  "先抓一个陷阱。",
  "把声音说出来，大白帮你接住。",
  "今天的目标不是多，是准。",
  "小队长，先选一个入口。",
  "航线亮一下就很好。",
  "错因不是坏事，是线索。",
  "不用证明自己很厉害，先开局。",
  "今天适合短回合。",
  "大白在线。",
  "我记得你喜欢网球的硬实力。",
  "像打一分球一样，先打这一分。",
  "我们不刷屏，我们留痕迹。",
  "先把想法讲给我听。",
  "如果卡住，就换成一句话。",
  "今天先从最容易的一项进舱。",
  "你可以选学习，也可以先聊天。",
  "我不会催你，但我会陪你开始。",
  "慢一点也算在航线上。",
  "今天不用把所有事情都解决。",
  "一个清楚答案，比十个糊涂答案更值。",
  "开口就是启动。",
  "我发现你越来越会复盘了。",
  "先让大脑热身。",
  "我们把事情变小。",
  "你来当小教练也可以。",
  "大白只看今天这一小步。",
  "先选一个房间。",
  "不用急着赢全部。",
  "今天可以低电量模式。",
  "把小数点对齐，也是一种胜利。",
  "说出三句英语，就是向未来走一步。",
  "阅读一页，也会留下痕迹。",
  "运动动作只改一个点。",
  "今天的你，不需要被比较。",
  "先和我打个招呼也可以。",
  "我在等你重新起航。",
  "今天适合轻装上场。",
  "你的想法先出来，标准答案后面再说。",
  "少一点，准一点。",
  "世界探索从一句英语开始。",
  "我们把今天变成一个小故事。",
  "大白会收好你的成长记录。",
  "你昨天留下的痕迹还在。",
  "先拿下数学，再去挑战英语也可以。",
  "如果想聊，我先听。",
  "如果想动，就去运动舱。",
  "如果想看故事，就去阅读舱。",
  "今天不用像机器人一样学习。",
  "像战斗教室一样，先定一个动作。",
  "错误会告诉我们下一步。",
  "你已经不是从零开始。",
  "先把航线点亮。",
  "我喜欢你认真讲思路的时候。",
  "大白不会给你排行榜。",
  "今天没有惩罚，只有重新起航。",
  "先挑一个你不讨厌的入口。",
  "你可以用声音，不一定要打字。",
  "我会帮你把话变清楚。",
  "今天的胜利可以很小。",
  "小回合，也是真前进。",
  "我们不追求一下子变完美。",
  "你上次说清楚过程，这很重要。",
  "先给自己一个启动信号。",
  "一个动作点就够。",
  "一个新词也算收获。",
  "一个画面也能打开语文。",
  "先读慢一点。",
  "先说完整一点。",
  "先把单位看一眼。",
  "今天的大白心情不错。",
  "你可以选择路线。",
  "成长宇宙不是考试表。",
  "你今天想去哪一舱？",
  "我们赢一小局就收好。",
  "如果累，就做保底版。",
  "如果状态好，就打主动球。",
  "如果不想学，先聊天。",
  "大白还记得你的英国目标。",
  "未来出国这条线，不用每天很重，但要不断。",
  "先把今天过成一个故事。",
  "别急，我在。",
  "你的航线不是直线，也没关系。",
  "今天只需要一个开始。",
  "你来选，大白跟上。",
  "我会把你的进步藏进宇宙里。",
  "准备好了就进舱。",
  "我们从一个小目标开始。"
];

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
}

function safeId(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "-");
}

function daySeed(extra = 0) {
  return TODAY.split("-").reduce((sum, part) => sum + Number(part), 0) + extra;
}

function dateLabel(dateString = TODAY) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function dateDiffDays(fromDate, toDate = TODAY) {
  if (!fromDate) return 999;
  const from = new Date(`${fromDate}T00:00:00`);
  const to = new Date(`${toDate}T00:00:00`);
  return Math.round((to - from) / 86400000);
}

function addDays(dateString, offset) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function pickDaily(list, extra = 0) {
  if (!list?.length) return "";
  return list[daySeed(extra) % list.length];
}

function todayWakeTitle() {
  const key = state.weather || "还行";
  return pickDaily(wakeTitles[key] || wakeTitles["还行"], taskDoneCount());
}

function todayWakeHint() {
  const profile = todayLoadProfile();
  const total = profile.required.length;
  return `${profile.name}。今天只看 ${total} 个必做任务，完成后拿一个小奖励。`;
}

function onlineDayCount() {
  const first = state.dabai?.onlineSince || TODAY;
  return Math.max(1, dateDiffDays(first, TODAY) + 1);
}

function dabaiMood() {
  return pickDaily(["有点兴奋", "安静在线", "想陪你赢一小局", "低声巡航", "准备听你说"], taskDoneCount() + 8);
}

function activePromptLine() {
  return seededPhrase(encouragementPhrases, daySeed(), taskDoneCount() + (state.weather || "").length);
}

function memoryLine() {
  const profile = state.profile || {};
  const interests = profile.interests || ["网球"];
  const goals = profile.goals || ["未来出国"];
  const recent = profile.recent || ["数学状态不错"];
  const options = [
    `我记得你喜欢${interests[0]}。`,
    `你有一个目标：${goals[0]}。`,
    `最近我看到：${recent[0]}。`,
    "你上次把过程讲清楚了。"
  ];
  return pickDaily(options, 13);
}

function renderModuleLaunchers() {
  return `<div class="moduleGrid">${moduleLaunchers
    .map(([id, icon, title, hint]) => `<button class="moduleButton ${state.activeModule === id ? "active" : ""}" data-module="${id}"><span>${icon}</span><b>${title}</b><small>${hint}</small></button>`)
    .join("")}</div>`;
}

function moduleTitle(id) {
  if (id === "universe") return "📜 成长宇宙";
  const found = moduleLaunchers.find(([moduleId]) => moduleId === id);
  return found ? `${found[1]} ${found[2]}` : "🤖 大白";
}

function homeDabaiLines() {
  const seed = daySeed();
  const day = new Date(TODAY).getDay();
  const weeklySportsMemory = day === 1 || day === 4 ? "我记得你和爸爸说过：学习体育双不误。" : "";
  return [
    seededPhrase(greetingPhrases, seed, 1),
    weeklySportsMemory || seededPhrase(memoryPhrases, seed, 7),
    seededPhrase(actionPhrases, seed, 13)
  ];
}

function roomTasks(ids) {
  const requiredIds = requiredTasks().map((task) => task.id);
  const sorted = state.tasks.filter((task) => ids.includes(task.id));
  return sorted.sort((a, b) => requiredIds.indexOf(b.id) - requiredIds.indexOf(a.id));
}

const bodyStatusOptions = [
  ["full", "⚡ 精力满满"],
  ["normal", "🙂 正常"],
  ["tired", "😴 有点累"],
  ["sick", "🤒 不舒服"],
  ["pe", "🏫 今天有体育课"],
  ["tennis", "🎾 今天有网球课"],
  ["rain", "🌧️ 今天不适合户外"]
];

function ensureEnglishExplore() {
  state.englishExplore = state.englishExplore || { totalRounds: state.exploration?.englishTasks || 0, currentCountry: "中国", unlockedCountries: ["中国"], lastTask: "" };
  const total = state.englishExplore.totalRounds || 0;
  const index = Math.min(exploreCountries.length - 1, Math.floor(total / 10));
  state.englishExplore.currentCountry = exploreCountries[index][0];
  state.englishExplore.unlockedCountries = exploreCountries.slice(0, index + 1).map(([name]) => name);
  return state.englishExplore;
}

function englishMode() {
  if (state.weather === "很好") return "high";
  if (state.weather === "有点累" || state.weather === "不想学") return "low";
  return "normal";
}

function englishExploreTask() {
  const mode = englishMode();
  const tasks = {
    low: [
      "只说一句：I feel ___ today.",
      "跟读一句：I can try.",
      "说一个今天看到的东西：I see a ___."
    ],
    normal: [
      "说3句今天发生的事。",
      "用英语介绍一个喜欢的运动。",
      "用英语说今天想去哪个国家。"
    ],
    high: [
      "进行2分钟英语问答。",
      "用英语讲一个小故事。",
      "用英语介绍网球或学校的一件事。"
    ]
  };
  return pickDaily(tasks[mode], 22);
}

function renderEnglishProgress() {
  const english = ensureEnglishExplore();
  return `<div class="exploreMini">
    <b>🌍 英语探索进度 · ${english.totalRounds || 0}/10</b>
    <div class="countryRail">${exploreCountries.map(([name, flag], index) => {
      const active = english.unlockedCountries?.includes(name);
      return `${index ? "<b>↓</b>" : ""}<span class="${active ? "active" : ""}">${name} ${flag}</span>`;
    }).join("")}</div>
    <div class="tiny">每完成 10 个英语回合，解锁下一站。</div>
  </div>`;
}

function bodySuggestion(status = state.dailyState?.bodyStatus || "normal") {
  const label = bodyStatusOptions.find(([id]) => id === status)?.[1]?.replace(/^[^\s]+\s*/, "") || "正常";
  if (status === "pe") return {
    label: "今天有体育课",
    advice: "体育课已经让身体上线了。",
    options: ["放学后户外走10分钟", "睡前拉伸3分钟", "看远处10分钟，让眼睛休息"],
    reminder: "今天不用额外加练，身体恢复也很重要。"
  };
  if (status === "tennis") return {
    label: "今天有网球课",
    advice: "网球课已经算身体主任务。",
    options: ["课后慢走10分钟", "小腿和肩膀轻松拉伸3分钟", "早点喝水休息"],
    reminder: "今天不叠加训练，只收好一个动作感觉。"
  };
  if (status === "sick") return {
    label,
    advice: "今天不安排训练，先观察身体。",
    options: ["喝水休息", "告诉爸爸妈妈哪里不舒服", "如果疼痛或发热，先停下来"],
    reminder: "不舒服时，休息就是正确选择。"
  };
  if (status === "rain") return {
    label,
    advice: "今天换成室内轻活动。",
    options: ["室内拉伸5分钟", "原地协调小游戏", "看远处窗外10分钟"],
    reminder: "不要剧烈跑跳扰民，轻一点就好。"
  };
  if (status === "tired") return {
    label,
    advice: "今天低电量，只让身体轻轻上线。",
    options: ["户外走10分钟", "远眺10分钟", "轻松挥拍20次"],
    reminder: "只选一个就够，不要全做。"
  };
  if (status === "full") return {
    label,
    advice: "今天可以多动一点，但不用练狠。",
    options: ["户外60-90分钟", "网球练习30分钟", "灵敏小游戏10分钟"],
    reminder: "保持舒服，不训练到疼痛。"
  };
  return {
    label,
    advice: "今天适合轻松动一动。",
    options: ["网球挥拍50次", "户外走30分钟", "投篮50次"],
    reminder: "选一个就够。完成后告诉大白你做了什么。"
  };
}

function renderBodySuggestion() {
  const suggestion = bodySuggestion();
  return `<div class="bodyAdvice">
    <h3>🎾 今日身体建议</h3>
    <div class="history"><b>状态：</b>${escapeHtml(suggestion.label)}</div>
    <div class="note green"><b>大白建议：</b><br>${escapeHtml(suggestion.advice)}</div>
    <div class="history"><b>今日可选：</b><br>${suggestion.options.map((item, index) => `${index + 1}. ${escapeHtml(item)}`).join("<br>")}</div>
    <div class="note blue"><b>大白提醒：</b><br>${escapeHtml(suggestion.reminder)}</div>
    <label>完成后告诉大白你做了什么</label>
    <textarea id="bodyActivityInput" placeholder="例如：户外走了20分钟，远眺10分钟。">${escapeHtml(state.bodyLog?.completedActivity || "")}</textarea>
    <button class="primary" data-body-complete>收进身体记录</button>
  </div>`;
}

function renderUniverseSnapshot() {
  const voyage = voyageState();
  return `<section class="card universeSnapshot">
    <div class="sectionTitle"><div><div class="pill">成长宇宙</div><h2>今天的大白记录</h2></div><div class="status">${escapeHtml(todayBadgesText())}</div></div>
    <div class="universeGrid">
      <div class="miniUniverse"><b>⚓ 航线</b><span>${escapeHtml(voyage.dots)}</span><small>${escapeHtml(voyage.nextText)}</small></div>
      <div class="miniUniverse"><b>🏆 成就收藏</b><span>${escapeHtml(todayBadgesText())}</span><small>只是收藏，不兑换。</small></div>
      <div class="miniUniverse"><b>📜 成长故事</b><span>${escapeHtml((state.battleReports || [])[0]?.records?.[0] || "还在写今天的故事")}</span><small>赢下一小局就会出现。</small></div>
    </div>
    ${renderExploreMap()}
  </section>`;
}

function renderModulePanel() {
  const module = state.activeModule || "";
  const required = requiredTasks().filter((task) => ["math", "english", "chinese"].includes(task.id));
  const optional = optionalTasks().filter((task) => ["math", "english", "chinese"].includes(task.id));
  if (module === "learning") {
    return `<section class="card modulePanel">
      <div class="sectionTitle">
        <div><div class="pill">📚 学习小局</div><h2>每天只解决一个小问题</h2></div>
        <div class="status">${taskDoneCount()}/${required.length || 1}</div>
      </div>
      <div class="taskList">${required.map((task) => taskCard(task)).join("")}</div>
      ${optional.length ? `<details class="optionalBlock"><summary>有余力再看可选项</summary><div class="taskList">${optional.map((task) => taskCard(task)).join("")}</div></details>` : ""}
    </section>`;
  }
  if (module === "english") return `<section class="card modulePanel">
    <div class="pill">🌍 英语探索舱</div>
    <h2>${escapeHtml(pickDaily(englishPhrases, 31))}</h2>
    <p>英语不是普通学科，是通往世界的工具。</p>
    ${renderEnglishProgress()}
    <div class="task card">
      <div class="taskTop"><div class="icon">🌍</div><div class="pill">英语回合</div></div>
      <h2>今天只开口一点</h2>
      <p class="oneSentence">${escapeHtml(englishExploreTask())}</p>
      <details class="taskDetails">
        <summary>开始英语探索</summary>
        <label>🎙️ 说给大白听</label>
        <textarea id="englishExploreInput" placeholder="可以说一句英文，也可以先写下来。">${escapeHtml(state.englishExplore?.lastTask || "")}</textarea>
        <div class="note blue"><b>大白只改一个点</b><br>先敢开口。反馈只看一个发音、一个词或一句表达。</div>
        <button class="primary" data-english-complete>完成英语回合</button>
      </details>
    </div>
  </section>`;
  if (module === "body") return `<section class="card modulePanel">
    <div class="pill">🎾 身体舱</div>
    <h2>${escapeHtml(pickDaily(bodyPhrases, 41))}</h2>
    <p>学习体育双不误。身体成长不是选修项。</p>
    <h3>今天身体状态怎么样？</h3>
    <div class="choiceGrid bodyStatusGrid">${bodyStatusOptions.map(([id, label]) => `<button class="choice ${state.dailyState?.bodyStatus === id ? "active" : ""}" data-body-status="${id}"><b>${escapeHtml(label)}</b></button>`).join("")}</div>
    ${state.dailyState?.bodyStatus ? renderBodySuggestion() : `<div class="note blue">先选一个状态，大白再给今天的身体建议。</div>`}
  </section>`;
  if (module === "music") return `<section class="card modulePanel"><div class="pill">🎵 音乐舱</div><h2>口琴只练一小段</h2><div class="taskList">${roomTasks(["harmonica"]).map((task) => taskCard(task)).join("")}</div></section>`;
  if (module === "universe") return `<section class="card modulePanel"><div class="pill">📜 成长宇宙</div><h2>这里收好八宝的成长痕迹</h2>${renderUniverseSnapshot()}${renderBattleReports()}<details class="optionalBlock"><summary>身体活动记录</summary>${(state.growthUniverse?.bodyLogs || []).slice(0, 7).map((log) => `<div class="history"><b>${escapeHtml(log.date)}</b><br>${escapeHtml(log.status || "")} · ${escapeHtml(log.completedActivity || log.suggestion || "")}</div>`).join("") || `<div class="history">还没有身体记录。</div>`}</details></section>`;
  if (module === "chat") return `<section class="card modulePanel"><div class="pill">💬 聊天</div><h2>和大白说说</h2><div class="chatBox" id="chatBox">${renderConversation()}</div><label>直接跟大白说</label><textarea id="companionInput" placeholder="可以说：我今天不想学，或者我想先聊一下。"></textarea><div class="row"><button class="primary" id="voiceCompanion">🎙 开始说话</button><button class="secondary" id="sendCompanion">发送文字</button></div></section>`;
  return "";
}

function ensureBadges() {
  state.badges = state.badges || { earned: [], today: [] };
  state.badges.earned = state.badges.earned || [];
  state.badges.today = (state.badges.today || []).filter((badge) => badge.date === TODAY);
  return state.badges;
}

function badgeLabel(badge) {
  return badge ? `${badge.icon} ${badge.name}` : "";
}

function awardBadge(task) {
  const badges = ensureBadges();
  const candidates = badgeCatalog.filter((badge) => badge.subjects.includes(task.id));
  if (!candidates.length || Math.random() > 0.42) return null;
  const badge = candidates[Math.floor(Math.random() * candidates.length)];
  const earned = { ...badge, date: TODAY, taskId: task.id, createdAt: new Date().toISOString() };
  if (!badges.earned.some((item) => item.id === badge.id)) badges.earned.push(earned);
  if (!badges.today.some((item) => item.id === badge.id)) badges.today.push(earned);
  return earned;
}

function todayBadgesText() {
  const today = ensureBadges().today;
  return today.length ? today.map(badgeLabel).join("  ") : "还在巡航";
}

function explorationState() {
  state.exploration = state.exploration || { englishTasks: 0 };
  const count = state.exploration.englishTasks || 0;
  const index = Math.min(exploreCountries.length - 1, Math.floor(count / 10));
  const next = exploreCountries[Math.min(exploreCountries.length - 1, index + 1)];
  return { count, index, next };
}

function renderExploreMap() {
  const explore = explorationState();
  const stepCount = explore.count % 10;
  const stepText = explore.index >= exploreCountries.length - 1 ? "航线已到远方" : `${stepCount}/10`;
  return `<div class="exploreMini">
    <div class="tiny">🌎 探索进度 · 英语 ${stepText}</div>
    <div class="countryRail">${exploreCountries.map(([name, flag], index) => `<span class="${index <= explore.index ? "active" : ""}">${name} ${flag}</span>`).join("<b>↓</b>")}</div>
    <div class="tiny">每完成 10 个英语回合，解锁下一站。</div>
  </div>`;
}

function completionRewardText() {
  const total = requiredTasks().length;
  if (!total || taskDoneCount() < total) return "";
  return "收工奖励：今天的必做项已经清掉。大白记录：八宝不是靠鸡血推进，是靠一小步一小步赢。";
}

function voyageState() {
  const voyage = state.voyage || { count: 0, lastKeptDate: "" };
  const done = taskDoneCount();
  const keptToday = voyage.lastKeptDate === TODAY;
  const waiting = !keptToday && voyage.count > 0 && dateDiffDays(voyage.lastKeptDate) > 1;
  const countText = waiting || !voyage.count ? "大白等你重新起航" : `第 ${voyage.count} 天`;
  const nextText = done >= 2 ? "今日稳定完成" : done >= 1 ? "航线保持成功" : "今日完成后：航线 +1";
  const days = Array.isArray(voyage.days) ? voyage.days : [];
  const dots = Array.from({ length: 7 }, (_, index) => (days.includes(addDays(TODAY, index - 6)) ? "🟢" : "⚪")).join("");
  return { countText, nextText, keptToday, waiting, dots };
}

function keepVoyageIfNeeded() {
  state.voyage = state.voyage || { count: 0, lastKeptDate: "", days: [] };
  state.voyage.days = state.voyage.days || [];
  if (!state.voyage.days.includes(TODAY)) state.voyage.days.push(TODAY);
  state.voyage.days = state.voyage.days.slice(-60);
  if (state.voyage.lastKeptDate === TODAY) return;
  state.voyage.count = dateDiffDays(state.voyage.lastKeptDate) === 1 ? (state.voyage.count || 0) + 1 : 1;
  state.voyage.lastKeptDate = TODAY;
}

function taskByDoneKey(key) {
  const id = String(key || "").replace(/^task_/, "");
  return state.tasks.find((task) => task.id === id);
}

function taskSpecificDiary(task) {
  const note = state.dailyNotes?.[task.id] || {};
  if (note.explain?.trim()) return `他把“${note.explain.trim().slice(0, 26)}”这一步讲清楚了`;
  if (note.focus?.trim()) return `他留下了一个小重点：${note.focus.trim().slice(0, 22)}`;
  if (note.answer?.trim()) return "他先把答案说了出来";
  return "他完成了一个小回合";
}

function diaryMoodClause() {
  if (state.weather === "不想学") return "虽然今天启动很小，";
  if (state.weather === "有点累") return "虽然今天不用猛冲，";
  return "今天节奏稳稳的，";
}

function makeGrowthDiaryLine(task) {
  return `${dateLabel()}，八宝今天完成了${task.title}。${diaryMoodClause()}${taskSpecificDiary(task)}，航线保持成功。`;
}

function makeBattleRecord(task) {
  if (task.id === "math") return ["今天抓到了一个小数陷阱。", "比多做10道题更有价值。"];
  if (task.id === "english") return ["今天开口说了英语。", "声音先出来，后面就好改。"];
  if (task.id === "chinese") return ["今天把画面说出来了。", "一句话变清楚，也算赢下一小局。"];
  return ["今天留下了一个动作点。", "明天可以接着这个点走。"];
}

function updateBattleReport(task, badge = null) {
  state.battleReports = state.battleReports || [];
  let report = state.battleReports.find((item) => item.date === TODAY);
  if (!report) {
    report = { date: TODAY, status: "稳定航线", completed: [], badges: [], records: [] };
    state.battleReports.unshift(report);
  }
  if (!report.completed.includes(task.id)) report.completed.push(task.id);
  if (badge && !report.badges.includes(badgeLabel(badge))) report.badges.push(badgeLabel(badge));
  const recordLines = makeBattleRecord(task);
  recordLines.forEach((line) => {
    if (!report.records.includes(line)) report.records.push(line);
  });
  state.battleReports = state.battleReports.slice(0, 365);
}

function addGrowthDiary(task) {
  state.growthDiary = state.growthDiary || [];
  let day = state.growthDiary.find((item) => item.date === TODAY);
  if (!day) {
    day = { date: TODAY, entries: [] };
    state.growthDiary.unshift(day);
  }
  const entry = {
    id: task.id,
    taskId: task.id,
    createdAt: new Date().toISOString(),
    text: makeGrowthDiaryLine(task)
  };
  const index = day.entries.findIndex((item) => item.taskId === task.id);
  if (index >= 0) day.entries[index] = entry;
  else day.entries.push(entry);
  state.growthDiary = state.growthDiary.slice(0, 365);
}

function recentDiaryDays(limit = 7) {
  return (state.growthDiary || []).slice(0, limit);
}

function latestReportBeforeToday() {
  return (state.battleReports || []).find((report) => report.date !== TODAY);
}

function dabaiBuddyLines() {
  const energy = { "很好": "⚡ 电量85%", "还行": "🔋 电量70%", "有点累": "🛡 电量45%", "不想学": "🌙 小引擎待机" }[state.weather || "还行"];
  const last = latestReportBeforeToday();
  const observations = last?.completed?.includes("math")
    ? ["昨天数学留下了清楚的痕迹。", "大白记得你抓过一个小陷阱。", "你最近不是靠猛冲，是靠稳。"]
    : ["今天先赢一个小回合就够。", "大白在这里，不催你。", "先开口，后面都好改。"];
  const suggestions = {
    "很好": ["先拿下数学，再去挑战英语。", "今天可以当一次小队长。"],
    "还行": ["先做最短的一项，让航线亮起来。", "先拿一个小局，再看下一步。"],
    "有点累": ["先做小版本，大白陪你慢一点。", "只改一个点就很好。"],
    "不想学": ["先赢5分钟，不用解释太多。", "只开一个小口，大白就算你起航。"]
  }[state.weather || "还行"];
  return {
    status: energy,
    observation: pickDaily(observations, 3),
    suggestion: pickDaily(suggestions, 5)
  };
}

function renderDabaiBuddy() {
  const lines = dabaiBuddyLines();
  return `<aside class="dabaiBuddy">
    <h3>🤖 大白</h3>
    <p><b>今天状态：</b><br>${escapeHtml(lines.status)}</p>
    <p><b>今天观察：</b><br>${escapeHtml(lines.observation)}</p>
    <p><b>今天建议：</b><br>${escapeHtml(lines.suggestion)}</p>
  </aside>`;
}

function renderOnePointBubble() {
  const bubble = state.feedbackBubble;
  if (!bubble) return "";
  return `<div class="onePointBubble">
    <b>👀 大白只看一个点</b>
    <p>👍 ${escapeHtml(bubble.good)}</p>
    <p>🎯 今天只改一个点：<br>${escapeHtml(bubble.focus)}</p>
  </div>`;
}

const icapSteps = [
  ["P", "P 看过"],
  ["A", "A 练过"],
  ["C", "C 讲清楚"],
  ["I", "I 得到反馈"]
];

function ensureDailyNote(id) {
  state.dailyNotes = state.dailyNotes || {};
  state.dailyNotes[id] = state.dailyNotes[id] || {};
  return state.dailyNotes[id];
}

function icapRank(value) {
  return Math.max(0, icapSteps.findIndex(([key]) => key === value) + 1);
}

function markIcap(taskId, stage) {
  const note = ensureDailyNote(taskId);
  note.icapStages = note.icapStages || {};
  const rank = icapRank(stage);
  icapSteps.slice(0, rank).forEach(([key]) => (note.icapStages[key] = true));
  const task = state.tasks.find((item) => item.id === taskId);
  if (task) task.icap = stage;
  if (stage === "I") {
    const feedback = buildOnePointFeedbackParts(task, note);
    note.feedback = feedback.text;
    state.feedbackBubble = {
      taskId,
      taskTitle: task?.title || "今天这一项",
      good: feedback.good,
      focus: feedback.focus,
      createdAt: new Date().toISOString()
    };
  }
  save();
}

function stageDone(task, stage) {
  const note = state.dailyNotes?.[task.id] || {};
  return Boolean(note.icapStages?.[stage]) || icapRank(task.icap) >= icapRank(stage);
}

function buildOnePointFeedbackParts(task, note = {}) {
  const answer = String(note.answer || "").trim();
  const explain = String(note.explain || "").trim();
  const subject = task?.id || "";
  const combined = `${answer} ${explain}`;
  const hasNumber = /[0-9０-９一二三四五六七八九十]/.test(combined);
  const hasEnglish = /[a-z]/i.test(combined);
  const mentionsBecause = /\bbecause\b|因为|所以/.test(combined);
  const mentionsWhereWhen = /where|when|哪里|地点|时间|什么时候/i.test(combined);
  if (!answer && !explain) {
    return {
      good: "你已经来到这个回合了。",
      focus: "先说一句“我是这样想的”。",
      text: "八宝，先说出一点点，大白才能帮你改一个点。最低版本：只说一句“我是这样想的”。"
    };
  }
  const hasExplain = explain.length >= 8;
  const good = hasExplain ? "你已经把过程说出来了。" : "你先把输出留下来了。";
  let focus = "";
  if (subject === "math") {
    focus = !hasNumber ? "补上一个关键数字或单位。" : hasExplain ? "最后答案可以再读慢一点。" : "补一句第一步为什么这样列式。";
    return { good, focus, text: `八宝，${good}大白只提醒一个点：${focus}` };
  }
  if (subject === "english") {
    focus = !hasEnglish
      ? "先补一句最短英文，不追求长，主语 + 动作就可以"
      : mentionsWhereWhen
        ? "where 管地点，when 管时间，先只选一个。"
        : mentionsBecause
          ? "because 后面只接一个清楚理由。"
          : "只查一个点：句首大写或句末标点。";
    return { good, focus, text: `八宝，${good}大白只提醒一个点：${focus}` };
  }
  if (subject === "chinese") {
    focus = /画面|颜色|动作|心情|作者|人物/.test(combined) ? "保留这个画面，再补一个动作或感受。" : "先说清楚画面里有什么。";
    return { good, focus, text: `八宝，${good}大白只提醒一个点：${focus}` };
  }
  focus = hasExplain ? "把动作点缩成一个词，明天直接复用。" : "补一句刚才哪个动作最顺。";
  return { good, focus, text: `八宝，${good}大白只提醒一个点：${focus}` };
}

function buildTaskFeedback(task, note = {}) {
  return buildOnePointFeedbackParts(task, note).text;
}

function initNav() {
  nav.innerHTML = pagesDef.map((p, i) => `<button class="${i === 0 ? "active" : ""}" data-page="${p.id}">${p.icon} ${p.name}</button>`).join("");
  nav.querySelectorAll("button").forEach((button) => (button.onclick = () => showPage(button.dataset.page)));
}

function showPage(id) {
  document.querySelectorAll(".nav button").forEach((button) => button.classList.toggle("active", button.dataset.page === id));
  document.querySelectorAll(".page").forEach((page) => page.classList.toggle("active", page.id === id));
}

function renderPages(activeId = document.querySelector(".page.active")?.id || "home") {
  pages.innerHTML = pagesDef.map((page) => `<section id="${page.id}" class="page ${page.id === activeId ? "active" : ""}">${renderPage(page)}</section>`).join("");
  bindAll();
  showPage(activeId);
}

function renderPage(page) {
  if (page.kind === "home") return renderers.home();
  return `<div class="card"><h2>${page.icon} ${page.title}</h2><p>${page.hint}</p></div>${renderers[page.kind]?.() || ""}`;
}

function taskDoneCount() {
  return requiredTasks().filter((task) => state.done?.[`task_${task.id}`]).length;
}

function todayLoadProfile() {
  const base = loadProfiles[state.weather] || loadProfiles["还行"];
  const schedule = todaySchedule();
  const required = schedule.requiredOverride || base.required;
  const optional = uniqueList([...base.optional, ...(schedule.optionalExtra || [])]).filter((id) => !required.includes(id));
  const paused = uniqueList([...base.paused, ...(schedule.pausedExtra || [])]).filter((id) => !required.includes(id) && !optional.includes(id));
  const adjusted = Boolean(schedule.requiredOverride || schedule.optionalExtra?.length || schedule.pausedExtra?.length);
  return {
    ...base,
    baseKey: state.weather || "还行",
    name: adjusted ? `${schedule.title} · 固定课调整` : `${base.name} · ${schedule.title}`,
    summary: adjusted ? `按${schedule.day}固定安排调整任务。${schedule.energy}` : `${base.summary} ${schedule.energy}`,
    required,
    optional,
    paused,
    targets: {
      ...base.targets,
      ...(schedule.targetAdjust || {})
    },
    template: scheduleTemplate(base, schedule),
    schedule
  };
}

function resourceIntensityKey() {
  const key = todayLoadProfile().baseKey;
  if (key === "很好") return "full";
  if (key === "还行") return "standard";
  if (key === "有点累") return "support";
  return "minimum";
}

function resourcePlanCard(compact = false) {
  const mode = resourceIntensityKey();
  const englishTracks = dailyResourceTracks.filter((track) => track.subject === "英语");
  const mathTracks = dailyResourceTracks.filter((track) => track.subject === "数学");
  const renderTrack = (track) => {
    const value = state.dailyNotes?.resources?.[track.id]?.output || "";
    const id = `resource-${safeId(track.id)}-output`;
    return `<div class="history resourceTrack"><b>${escapeHtml(track.title)}</b><br><span class="tiny">${escapeHtml(track.purpose)}</span><br>${escapeHtml(track[mode])}${compact ? "" : `<label for="${id}">今日输出</label><div class="fieldWithVoice"><textarea id="${id}" data-resource-track="${track.id}" placeholder="可以直接说：读了哪一页？说了哪一句？卡在哪个词？">${escapeHtml(value)}</textarea><button type="button" class="voiceMini" data-voice-target="${id}" title="语音输入">🎙 说</button></div>`}</div>`;
  };
  return `<div class="card">
    <div class="taskTop"><div class="pill">留学能力线 · 每日</div><div class="tiny">${mode === "full" ? "完整" : mode === "standard" ? "标准" : mode === "support" ? "保底" : "最低"}</div></div>
    <h2>英语优先，每天不断线</h2>
    <p>RAZ、自然拼读、朗文、哈利波特每天都进计划；状态差就变成微任务，不取消。</p>
    ${compact ? englishTracks.slice(0, 2).map(renderTrack).join("") : englishTracks.map(renderTrack).join("")}
    <div class="note blue">数学辅助：${escapeHtml(mathTracks[0][mode])}</div>
    ${compact ? "" : mathTracks.map(renderTrack).join("")}
  </div>`;
}

function todaySchedule() {
  return weeklySchedule[new Date(TODAY).getDay()] || weeklySchedule[1];
}

function uniqueList(items) {
  return [...new Set(items)];
}

function scheduleTemplate(base, schedule) {
  const lines = [
    `${schedule.day}：${schedule.title}。${schedule.school}`,
    ...schedule.fixed.map((item) => `固定安排：${item}`),
    `今日原则：${schedule.energy}`
  ];
  const required = schedule.requiredOverride || base.required;
  required.forEach((id) => {
    const label = {
      math: "数学",
      english: "英语",
      chinese: "语文",
      harmonica: "口琴",
      tennis: "网球"
    }[id];
    if (label) lines.push(`${label}：${(schedule.targetAdjust || base.targets)[id] || base.targets[id]}`);
  });
  if (schedule.optionalExtra?.length) lines.push(`可选：${schedule.optionalExtra.map((id) => taskNameById(id)).join("、")}，有余力再做。`);
  if (schedule.pausedExtra?.length) lines.push(`暂停：${schedule.pausedExtra.map((id) => taskNameById(id)).join("、")}，今天不补债。`);
  return lines;
}

function taskNameById(id) {
  return {
    math: "数学",
    english: "英语",
    chinese: "语文",
    harmonica: "口琴",
    tennis: "网球"
  }[id] || id;
}

function taskLoadStatus(task) {
  const profile = todayLoadProfile();
  if (profile.required.includes(task.id)) return "必做";
  if (profile.optional.includes(task.id)) return "可选";
  return "暂停";
}

function taskLoadTarget(task) {
  return todayLoadProfile().targets?.[task.id] || task.target;
}

function exampleCountForTask(task) {
  const profile = todayLoadProfile().name;
  if (!exampleBank[task.id]) return 0;
  if (profile === "完整训练版") return 3;
  if (profile === "标准短版") return 2;
  return 1;
}

function taskExamples(task) {
  const examples = exampleBank[task.id] || [];
  const count = exampleCountForTask(task);
  if (!count) return [];
  const seed = new Date(TODAY).getDate() + task.id.length;
  return Array.from({ length: Math.min(count, examples.length) }, (_, index) => examples[(seed + index) % examples.length]);
}

function requiredTasks() {
  const profile = todayLoadProfile();
  return state.tasks.filter((task) => profile.required.includes(task.id));
}

function optionalTasks() {
  const profile = todayLoadProfile();
  return state.tasks.filter((task) => profile.optional.includes(task.id));
}

function pausedTasks() {
  const profile = todayLoadProfile();
  return state.tasks.filter((task) => profile.paused.includes(task.id));
}

function pickLine(group) {
  const lines = companionLines[group] || companionLines.start;
  const seed = new Date().getDate() + taskDoneCount();
  return lines[seed % lines.length];
}

function companionTodayLine() {
  if (state.companion?.quietMode) return companionLines.tired[0];
  if (taskDoneCount() > 0) return companionLines.done[taskDoneCount() % companionLines.done.length];
  if (state.weather === "有点累" || state.weather === "不想学") return pickLine("tired");
  return pickLine("start");
}

function taskCompanionHint(task) {
  const note = state.dailyNotes?.[task.id]?.focus;
  if (note) return `大白记得：${task.title} 今天只改“${escapeHtml(note)}”。`;
  const status = taskLoadStatus(task);
  if (status === "暂停") return "今天这项暂停，不补债。先保护启动感。";
  return `大白陪你把 ${task.title} 变小：今天是${todayLoadProfile().name}，这项是${status}。`;
}

function bedtimeSummary() {
  const doneTasks = state.tasks.filter((task) => state.done?.[`task_${task.id}`]).map((task) => task.title);
  const feedback = state.teacherFeedback[0];
  const parts = [
    `八宝，今天大白记住了：你完成了 ${taskDoneCount()} 项每日练习。`,
    doneTasks.length ? `已经完成的是：${doneTasks.join("、")}。` : "就算还没完成，也可以先从一个最小动作开始。",
    feedback ? `老师反馈里，最近一次重点是${teacherSubjects[feedback.subject]?.name || "练习"}的${feedback.focus}。` : "",
    state.weekly?.next ? `下周的小重点是：${state.weekly.next}。` : "",
    pickLine("review")
  ];
  return parts.filter(Boolean).join("");
}

function companionContext() {
  const doneTasks = state.tasks.filter((task) => state.done?.[`task_${task.id}`]).map((task) => task.title);
  const focusNotes = state.tasks
    .map((task) => {
      const focus = state.dailyNotes?.[task.id]?.focus;
      return focus ? `${task.title}:${focus}` : "";
    })
    .filter(Boolean);
  const latestFeedback = state.teacherFeedback[0];
  return {
    weather: state.weather,
    loadProfile: todayLoadProfile().name,
    weeklySchedule: todaySchedule(),
    dailyResourceTracks,
    doneTasks,
    focusNotes,
    latestFeedback: latestFeedback ? `${teacherSubjects[latestFeedback.subject]?.name || "练习"} ${latestFeedback.focus}，下次${latestFeedback.nextAction || "继续练"}` : "",
    baobaoProfile,
    finalReviewPlan,
    studyMaterials: studyMaterials.map((item) => ({
      subject: item.subject,
      title: item.title,
      role: item.role,
      coachingUse: item.coachingUse,
      units: item.units
    }))
  };
}

function currentReviewWeek() {
  const today = new Date(TODAY);
  const month = today.getMonth() + 1;
  const day = today.getDate();
  if (month !== 6) return finalReviewPlan.weeks[0];
  if (day <= 7) return finalReviewPlan.weeks[0];
  if (day <= 14) return finalReviewPlan.weeks[1];
  if (day <= 21) return finalReviewPlan.weeks[2];
  return finalReviewPlan.weeks[3];
}

function reviewPlanCard(compact = false) {
  const week = currentReviewWeek();
  return `<div class="card reviewCard">
    <div class="taskTop"><div class="pill">期末复习</div><div class="tiny">${escapeHtml(week.range)}</div></div>
    <h2>${escapeHtml(week.name)}</h2>
    <p>${escapeHtml(finalReviewPlan.principle)}</p>
    <div class="note green">当前复习资料：${finalReviewPlan.sources.map(escapeHtml).join("、")}</div>
    <div class="note blue">辅助资源：${finalReviewPlan.supportingResources.map(escapeHtml).join("、")}。只做查漏和轻量输入，不抢期末主线。</div>
    <div class="reviewList">${week.focus.map((item) => `<div class="history">${escapeHtml(item)}</div>`).join("")}</div>
    ${compact ? "" : `<div class="note blue">${escapeHtml(week.daily)}</div>`}
  </div>`;
}

function renderConversation() {
  const conversation = state.companion?.conversation || [];
  if (!conversation.length) {
    return `<div class="chatEmpty">你可以对大白说：我今天不想学、数学有点烦、网球打得不错，或者只是说“陪我一下”。</div>`;
  }
  return conversation
    .map((item) => `<div class="bubble ${item.role === "user" ? "userBubble" : "lightBubble"}"><b>${item.role === "user" ? "八宝" : "大白"}</b><br>${escapeHtml(item.text)}</div>`)
    .join("");
}

function choiceButtons(field, options) {
  return options
    .map(([value, hint]) => `<button class="choice ${state[field] === value ? "active" : ""}" data-choice-field="${field}" data-choice="${escapeHtml(value)}"><b>${value}</b><span class="small">${hint}</span></button>`)
    .join("");
}

function noteField(task, key, label, placeholder) {
  const value = state.dailyNotes?.[task.id]?.[key] || "";
  const id = `daily-${safeId(task.id)}-${safeId(key)}`;
  const hint = key === "answer" ? `<div class="coachHint">先说出来，大白再帮你改一个点</div>` : "";
  return `<label for="${id}">${escapeHtml(label)}</label>${hint}<textarea id="${id}" data-daily-task="${task.id}" data-daily-key="${key}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>`;
}

function taskCard(task, compact = false) {
  const done = state.done?.[`task_${task.id}`];
  const status = taskLoadStatus(task);
  const paused = status === "暂停";
  const examples = paused ? [] : taskExamples(task);
  const note = state.dailyNotes?.[task.id] || {};
  return `<div class="card task ${done ? "done" : ""}">
    <div class="taskTop"><div class="icon">${task.icon}</div><div class="pill">${task.type} · ${status}</div></div>
    <h2>${task.title}</h2>
    <p class="oneSentence">${escapeHtml(taskLoadTarget(task))}</p>
    <details class="taskDetails">
      <summary>打开这一小局</summary>
      <div class="coachGrid">
        <div class="coachInput">
          <div class="laneTitle">左边 · 今天练什么</div>
          <p>${task.detail}</p>
          <div class="note green">${taskCompanionHint(task)}</div>
          ${examples.length ? `<div class="exampleBox">
            <h3>今天直接做</h3>
            ${examples.map((example, index) => `<div class="history">
              <b>${index + 1}. ${escapeHtml(example.point)}</b><br>
              ${escapeHtml(example.prompt)}
              <details><summary>提示 / 答案</summary><div class="tiny">${escapeHtml(example.hint)}<br><b>参考：</b>${escapeHtml(example.answer)}</div></details>
            </div>`).join("")}
          </div>` : ""}
        </div>
        <div class="coachOutput">
          <div class="laneTitle">右边 · 八宝输出和反馈</div>
          <button type="button" class="secondary roomVoice" data-voice-target="daily-${safeId(task.id)}-answer">🎙️ 说给大白听</button>
          ${paused || compact ? "" : `${noteField(task, "answer", "八宝的答案 / 输出", "可以直接说：答案、英文句子、语文句子，或者口头练习内容")}
          ${noteField(task, "explain", "我自己讲清楚", "可以直接说：我怎么想的？哪里容易错？下一次只改哪一点？")}
          <div class="miniGrid">
            <div>${noteField(task, "today", "今天实际练了什么", "例如：6道计算题 / 朗读第3段 / 第4-8小节")}</div>
            <div>${noteField(task, "focus", "今天只改一个点", "例如：圈关键词 / 换孔慢半拍 / 击球点靠前")}</div>
          </div>
          ${note.feedback ? `<div class="note green"><b>大白互动反馈</b><br>${escapeHtml(note.feedback)}</div>` : `<div class="note blue"><b>大白互动反馈</b><br>说出或写下答案，再点“I 得到反馈”。大白只改一个精确点，不会一口气检查全部。</div>`}` }
        </div>
      </div>
      ${paused ? "" : `<div class="ladder" data-task="${task.id}">
        ${icapSteps.map(([key, label]) => `<button class="${stageDone(task, key) ? "active" : ""}" data-icap="${key}">${label}</button>`).join("")}
      </div>
      <button class="primary ${done ? "done" : ""}" data-done="task_${task.id}">${done ? "已完成" : status === "可选" ? "完成可选项" : "完成这一项"}</button>`}
    </details>
  </div>`;
}

function loadPlanCard() {
  const profile = todayLoadProfile();
  return `<div class="card">
    <h2>今日负荷：${escapeHtml(profile.name)}</h2>
    <div class="quote">${escapeHtml(profile.summary)}</div>
    <div class="history"><b>必做：</b>${requiredTasks().map((task) => `${task.icon} ${task.title}`).join("、") || "无"}</div>
    ${optionalTasks().length ? `<div class="history"><b>可选：</b>${optionalTasks().map((task) => `${task.icon} ${task.title}`).join("、")}</div>` : ""}
    ${pausedTasks().length ? `<div class="history"><b>暂停：</b>${pausedTasks().map((task) => `${task.icon} ${task.title}`).join("、")}。今天不补债。</div>` : ""}
  </div>`;
}

function scheduleCard() {
  const schedule = todaySchedule();
  return `<div class="card">
    <div class="taskTop"><div class="pill">一周时间表</div><div class="tiny">${escapeHtml(schedule.day)}</div></div>
    <h2>${escapeHtml(schedule.title)}</h2>
    <p>${escapeHtml(schedule.school)}</p>
    ${schedule.fixed.map((item) => `<div class="history">${escapeHtml(item)}</div>`).join("")}
    <div class="note blue">${escapeHtml(schedule.energy)}</div>
  </div>`;
}

function teacherSubjectOptions(selected = "tennis") {
  return Object.entries(teacherSubjects).map(([key, item]) => `<option value="${key}" ${selected === key ? "selected" : ""}>${item.icon} ${item.name}</option>`).join("");
}

function renderFeedbackList() {
  if (!state.teacherFeedback.length) return `<div class="history">还没有反馈。可以先记一句老师今天说过的重点。</div>`;
  return state.teacherFeedback
    .map((item) => {
      const subject = teacherSubjects[item.subject] || teacherSubjects.tennis;
      return `<div class="history"><b>${subject.icon} ${subject.name}</b> · ${escapeHtml(item.focus)}<br>${escapeHtml(item.words || "未填写老师原话")}<br><span class="tiny">下次只练：${escapeHtml(item.nextAction || "未填写")} · ${new Date(item.createdAt).toLocaleString("zh-CN")}</span></div>`;
    })
    .join("");
}

function renderHistoryList() {
  if (!history.length) return `<div class="history">还没有历史。点“保存今天”，今天的任务和反馈就会留下来。</div>`;
  return history
    .map((item) => `<div class="history"><b>${item.date}</b> · 完成 ${item.progress}/${progressKeys.length}<br>天气：${escapeHtml(item.weather || "未记录")}<br>老师反馈：${item.teacherFeedback?.length || 0} 条<br><button class="secondary" data-delete-history="${item.id}">删除</button></div>`)
    .join("");
}

function weeklySummary() {
  const week = getWeekHistory();
  const feedbackCount = week.reduce((count, item) => count + (item.teacherFeedback?.length || 0), 0);
  const avg = week.length ? Math.round(week.reduce((count, item) => count + item.progress, 0) / week.length) : 0;
  return { days: week.length, feedbackCount, avg };
}

function renderBattleReports() {
  const reports = (state.battleReports || []).slice(0, 30);
  const body = reports.length
    ? reports
        .map((report) => {
          const completed = (report.completed || []).map((id) => `${taskNameById(id)}√`).join("  ") || "正在起航";
          const badges = (report.badges || []).join("  ") || "今天的小回合";
          const records = (report.records || []).map((line) => `<div class="diaryLine">${escapeHtml(line)}</div>`).join("");
          return `<div class="history battleReport"><b>${escapeHtml(report.date)}</b><br>状态：${escapeHtml(report.status || "稳定航线")}<br>完成：${escapeHtml(completed)}<br>获得：${escapeHtml(badges)}<br><br><b>大白记录：</b>${records}</div>`;
        })
        .join("")
    : `<div class="history">今天完成任意一项后，大白会写一份很短的战报。</div>`;
  return `<details class="optionalBlock diaryBlock">
    <summary>📜 大白战报</summary>
    <div class="tiny diaryHint">最近 30 天，只收藏赢下的小局。</div>
    ${body}
  </details>`;
}

function handleDoneClick(key) {
  const next = !state.done[key];
  const wasDone = Boolean(state.done[key]);
  setDone(key, next);
  const task = taskByDoneKey(key);
  if (next && task) {
    if (requiredTasks().some((item) => item.id === task.id)) keepVoyageIfNeeded();
    if (task.id === "english" && !wasDone) {
      state.exploration = state.exploration || { englishTasks: 0 };
      state.exploration.englishTasks = (state.exploration.englishTasks || 0) + 1;
    }
    const badge = awardBadge(task);
    addGrowthDiary(task);
    updateBattleReport(task, badge);
    save();
  }
}

function field(group, key, placeholder) {
  const value = state[group]?.[key] || "";
  return `<label>${placeholder}</label><textarea data-group="${group}" data-key="${key}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>`;
}

function materialCards(subject = "") {
  return studyMaterials
    .filter((item) => !subject || item.subject === subject)
    .map((item) => `<div class="history"><b>${escapeHtml(item.subject)} · ${escapeHtml(item.title)}</b><br>${escapeHtml(item.role)} · ${item.pages} 页<br><span class="tiny">${escapeHtml(item.coachingUse)}</span><br><span class="tiny">重点：${item.units.map(escapeHtml).join("、")}</span></div>`)
    .join("");
}

const renderers = {
  home() {
    const lines = homeDabaiLines();
    if (!state.activeModule) {
      return `<div class="baseHome">
        <section class="card baseCard">
          <div class="dabaiAvatar">🤖</div>
          <div class="pill">大白在等你</div>
          <h2>大白</h2>
          <p class="dabaiLine">${escapeHtml(lines[0])}</p>
          <p class="oneSentence">${escapeHtml(lines[1])}</p>
          <h3 class="moduleQuestion">选一个房间</h3>
          ${renderModuleLaunchers()}
          <button class="universeLink" data-module="universe">📜 看看我的成长宇宙</button>
        </section>
      </div>`;
    }
    return `<div class="roomShell">
      <section class="roomTop card">
        <button class="secondary backHome" data-room-home>← 回到大白</button>
        <div>
          <div class="pill">${escapeHtml(moduleTitle(state.activeModule))}</div>
          <h2>${escapeHtml(lines[2])}</h2>
          <p>${escapeHtml(lines[1])}</p>
        </div>
      </section>
      ${renderModulePanel()}
      ${renderOnePointBubble()}
    </div>`;
  },
  daily() {
    const required = requiredTasks();
    const optional = optionalTasks();
    const paused = pausedTasks();
    return `${reviewPlanCard()}${scheduleCard()}${loadPlanCard()}${resourcePlanCard()}<div class="card"><h2>今天照这个节奏</h2>${todayLoadProfile().template.map((item) => `<div class="history">${escapeHtml(item)}</div>`).join("")}</div>
      <div class="taskList">${required.map((task) => taskCard(task)).join("")}</div>
      ${optional.length ? `<div class="card"><h2>可选小动作</h2><p>做完必做还有余力，再选这里。没做也没关系。</p></div><div class="taskList">${optional.map((task) => taskCard(task)).join("")}</div>` : ""}
      ${paused.length ? `<div class="card"><h2>今日暂停</h2>${paused.map((task) => `<div class="history"><b>${task.icon} ${task.title}</b><br>${escapeHtml(taskLoadTarget(task))}</div>`).join("")}</div>` : ""}`;
  },
  materials() {
    const mainMaterials = studyMaterials.filter((item) => ["pep-math-4b", "pep-chinese-4b", "jing-tong-english-4b"].includes(item.id));
    const mathSupport = studyMaterials.filter((item) => item.id === "khan-math");
    const englishAbility = studyMaterials.filter((item) => ["raz-reading", "phonics", "harry-potter-original"].includes(item.id));
    const longmanMaterials = studyMaterials.filter((item) => item.title.startsWith("朗文课本"));
    return `<div class="grid2">
      <div class="card">
        <h2>期末主线资料</h2>
        <div class="note green">6月期末复习只按这三套四年级下资料走：人教四下数学、人教四下语文、精通四下英语。</div>
        ${mainMaterials.map((item) => `<div class="history"><b>${escapeHtml(item.subject)} · ${escapeHtml(item.title)}</b><br>${escapeHtml(item.role)} · ${item.pages} 页<br><span class="tiny">${escapeHtml(item.coachingUse)}</span><br><span class="tiny">复习范围：${item.units.map(escapeHtml).join("、")}</span></div>`).join("")}
      </div>
      <div class="card">
        <h2>数学辅助线</h2>
        <div class="note blue">可汗数学只用来解释卡点和补洞。6月做题仍然回到人教四下。</div>
        ${mathSupport.map((item) => `<div class="history"><b>${escapeHtml(item.subject)} · ${escapeHtml(item.title)}</b><br>${escapeHtml(item.role)}<br><span class="tiny">${escapeHtml(item.coachingUse)}</span><br><span class="tiny">可用场景：${item.units.map(escapeHtml).join("、")}</span></div>`).join("")}
      </div>
      <div class="card">
        <h2>英语能力线</h2>
        <div class="note blue">RAZ、自然拼读、哈利波特原著阅读课用于听读、拼读和兴趣阅读。期末期间每天最多选一个，5-10分钟即可。</div>
        ${englishAbility.map((item) => `<div class="history"><b>${escapeHtml(item.title)}</b><br>${escapeHtml(item.role)}<br><span class="tiny">${escapeHtml(item.coachingUse)}</span><br><span class="tiny">训练点：${item.units.map(escapeHtml).join("、")}</span></div>`).join("")}
      </div>
      <div class="card">
        <h2>朗文长期补充</h2>
        <div class="note blue">朗文 1A-6B 只作为长期听说和句型复现补充，不进入6月期末主计划。</div>
        ${longmanMaterials.map((item) => `<div class="history"><b>${escapeHtml(item.title)}</b> · ${item.pages} 页<br><span class="tiny">${escapeHtml(item.coachingUse)}</span></div>`).join("")}
      </div>
    </div>`;
  },
  companion() {
    return `<div class="grid2">
      <div class="card">
        <h2>大白在听</h2>
        <div class="chatBox" id="chatBox">${renderConversation()}</div>
        <label>直接跟大白说</label>
        <textarea id="companionInput" placeholder="例如：我今天不想做数学，感觉很烦。"></textarea>
        <div class="status" id="companionStatus">点“开始说话”，说完后大白会自动回答。</div>
        <div class="row">
          <button class="primary" id="voiceCompanion">🎙 开始说话</button>
          <button class="secondary" id="continuousCompanion">${continuousCompanion ? "连续对话：开" : "连续对话：关"}</button>
          <button class="secondary" id="sendCompanion">发送文字</button>
        </div>
      </div>
      <div class="card">
        <h2>大白会记得</h2>
        <div class="note blue">${companionProfile.learningPromise}</div>
        <div class="history">今天状态：${escapeHtml(state.weather || "还没选")}<br>完成：${taskDoneCount()}/${state.tasks.length} 项<br>最近记忆：${escapeHtml(state.companion?.moments?.[0]?.text || "还没有")}</div>
        <button class="primary secondary" id="bedtimeSummaryCompanion">说睡前小结</button>
      </div>
    </div>`;
  },
  feedback() {
    const selected = state.feedbackSubject || "tennis";
    const subject = teacherSubjects[selected] || teacherSubjects.tennis;
    return `<div class="grid2">
      <div class="card">
        <h2>${subject.icon} 新增反馈</h2>
        <label>项目</label><select id="feedbackSubject">${teacherSubjectOptions(selected)}</select>
        <label>老师原话</label><textarea id="teacherWords" placeholder="${escapeHtml(subject.samples[0])}"></textarea>
        <label>今天主要在改什么</label><select id="teacherFocus">${subject.focus.map((focus) => `<option>${escapeHtml(focus)}</option>`).join("")}</select>
        <label>下一次只练一个动作</label><textarea id="nextAction" placeholder="例如：下次只练第 4-8 小节慢速三遍"></textarea>
        <button class="primary" id="addFeedback">保存反馈</button>
      </div>
      <div class="card"><h2>反馈记录</h2>${renderFeedbackList()}</div>
    </div>`;
  },
  weekly() {
    const summary = weeklySummary();
    return `<div class="grid2">
      <div class="card">
        <h2>这一周怎么样</h2>
        <div class="quote">已保存 ${summary.days} 天，平均完成 ${summary.avg}/${progressKeys.length} 项，老师反馈 ${summary.feedbackCount} 条。</div>
        ${field("weekly", "stable", "本周最稳定的一项：")}
        ${field("weekly", "stuck", "本周最容易卡住的一项：")}
        ${field("weekly", "next", "下周只保留一个重点动作：")}
        <button class="primary" data-done="weekly">保存周复盘</button>
      </div>
      <div class="card">
        <h2>复盘提醒</h2>
        <div class="note green">不用评价孩子够不够努力。大白只看：哪一项更稳定了，哪个错误反复出现，下一周少做一点但做准一点。</div>
        <button class="primary secondary" id="bedtimeSummary">大白说睡前小结</button>
        <button class="primary secondary" id="snapshotFromWeekly">保存今天</button>
      </div>
    </div>`;
  },
  history() {
    return `<div class="grid2">
      <div class="card"><h2>保存今天</h2><p>保存后，今天的五项练习、状态和老师反馈会进入历史。</p><button class="primary" id="saveSnapshot">保存今天</button><button class="primary secondary" id="exportHistory">导出历史</button></div>
      <div class="card"><h2>历史</h2>${renderHistoryList()}</div>
    </div>`;
  },
  parent() {
    return `<div class="grid2">
      <div class="card"><h2>爸爸留言</h2><label>选一句今天能说的话</label><select id="dadMessage">${dadMessages.map((message) => `<option>${escapeHtml(message)}</option>`).join("")}</select><button class="primary" id="saveDadNote">保存留言</button></div>
      <div class="card"><h2>大白底层陪伴</h2><div class="note blue">${companionProfile.learningPromise}</div><div class="history"><b>八宝适合：</b>${baobaoProfile.coachingIdentities.join(" / ")}<br><b>容易被点燃：</b>${baobaoProfile.sparks.slice(0, 7).join("、")}<br><b>核心机制：</b>${baobaoProfile.interactionMechanisms.join("、")}<br><b>真实场景：</b>${baobaoProfile.upcomingScenes.join("、")}<br><b>避免：</b>${baobaoProfile.resistanceTriggers.slice(0, 5).join("、")}</div><div class="choiceGrid">${Object.entries(humanToneLines).map(([tone, lines]) => `<button class="choice" data-tone="${tone}"><b>${tone}</b><span class="small">${escapeHtml(lines[0])}</span></button>`).join("")}</div><div class="history">${state.companion?.moments?.map((moment) => `${escapeHtml(moment.text)}<br><span class="tiny">${new Date(moment.createdAt).toLocaleString("zh-CN")}</span>`).join("<hr>") || "大白还没有今日记忆。"}</div></div>
    </div>`;
  }
};

function bindAll() {
  document.querySelectorAll("[data-choice-field]").forEach((button) => {
    button.onclick = () => {
      state[button.dataset.choiceField] = button.dataset.choice;
      save();
      renderPages("home");
    };
  });
  document.querySelectorAll("[data-jump]").forEach((button) => (button.onclick = () => showPage(button.dataset.jump)));
  document.querySelectorAll("[data-room-home]").forEach((button) => {
    button.onclick = () => {
      state.activeModule = "";
      save();
      renderPages("home");
    };
  });
  document.querySelectorAll("[data-module]").forEach((button) => {
    button.onclick = () => {
      state.activeModule = state.activeModule === button.dataset.module ? "" : button.dataset.module;
      state.dailyState = state.dailyState || {};
      state.dailyState.selectedRoom = state.activeModule;
      save();
      renderPages("home");
    };
  });
  document.querySelectorAll("[data-body-status]").forEach((button) => {
    button.onclick = () => {
      state.dailyState = state.dailyState || {};
      state.dailyState.bodyStatus = button.dataset.bodyStatus;
      state.dailyState.hasPEClass = button.dataset.bodyStatus === "pe";
      state.dailyState.hasTennisClass = button.dataset.bodyStatus === "tennis";
      state.dailyState.outdoorAvailable = button.dataset.bodyStatus !== "rain";
      state.dailyState.energy = button.dataset.bodyStatus;
      save();
      renderPages("home");
    };
  });
  document.querySelector("[data-body-complete]")?.addEventListener("click", () => {
    const suggestion = bodySuggestion();
    const completedActivity = document.getElementById("bodyActivityInput")?.value.trim() || suggestion.options[0];
    state.bodyLog = {
      date: TODAY,
      status: suggestion.label,
      suggestion: suggestion.advice,
      completedActivity,
      durationMinutes: Number((completedActivity.match(/\d+/) || [0])[0]),
      note: suggestion.reminder
    };
    state.growthUniverse = state.growthUniverse || {};
    state.growthUniverse.bodyLogs = [state.bodyLog, ...(state.growthUniverse.bodyLogs || []).filter((log) => log.date !== TODAY)].slice(0, 30);
    state.dailyState.completedRooms = [...new Set([...(state.dailyState.completedRooms || []), "body"])];
    save();
    renderPages("home");
    speak("收到。身体记录已经收进成长宇宙。");
  });
  document.querySelector("[data-english-complete]")?.addEventListener("click", () => {
    const value = document.getElementById("englishExploreInput")?.value.trim() || englishExploreTask();
    const english = ensureEnglishExplore();
    english.totalRounds = (english.totalRounds || 0) + 1;
    english.lastTask = value;
    state.exploration = state.exploration || { englishTasks: 0 };
    state.exploration.englishTasks = english.totalRounds;
    ensureEnglishExplore();
    state.growthUniverse = state.growthUniverse || {};
    state.growthUniverse.englishProgress = [{ date: TODAY, task: value, totalRounds: english.totalRounds, country: english.currentCountry }, ...(state.growthUniverse.englishProgress || [])].slice(0, 30);
    state.dailyState = state.dailyState || {};
    state.dailyState.completedRooms = [...new Set([...(state.dailyState.completedRooms || []), "english"])];
    save();
    renderPages("home");
    speak("你已经敢开口了。大白今天只改一个点：把关键词读慢一点。");
  });
  document.querySelectorAll("[data-done]").forEach((button) => {
    button.onclick = () => {
      handleDoneClick(button.dataset.done);
      renderPages(document.querySelector(".page.active")?.id || "home");
    };
  });
  document.querySelectorAll("[data-daily-task]").forEach((input) => {
    input.oninput = () => {
      const note = ensureDailyNote(input.dataset.dailyTask);
      note[input.dataset.dailyKey] = input.value;
      if (input.dataset.dailyKey === "answer" && input.value.trim()) {
        note.icapStages = note.icapStages || {};
        note.icapStages.P = true;
        note.icapStages.A = true;
        const task = state.tasks.find((item) => item.id === input.dataset.dailyTask);
        if (task && icapRank(task.icap) < icapRank("A")) task.icap = "A";
      }
      if (input.dataset.dailyKey === "explain" && input.value.trim()) {
        note.icapStages = note.icapStages || {};
        note.icapStages.P = true;
        note.icapStages.A = true;
        note.icapStages.C = true;
        const task = state.tasks.find((item) => item.id === input.dataset.dailyTask);
        if (task && icapRank(task.icap) < icapRank("C")) task.icap = "C";
      }
      save();
    };
  });
  document.querySelectorAll("[data-resource-track]").forEach((input) => {
    input.oninput = () => {
      state.dailyNotes = state.dailyNotes || {};
      state.dailyNotes.resources = state.dailyNotes.resources || {};
      state.dailyNotes.resources[input.dataset.resourceTrack] = state.dailyNotes.resources[input.dataset.resourceTrack] || {};
      state.dailyNotes.resources[input.dataset.resourceTrack].output = input.value;
      save();
    };
  });
  document.querySelectorAll("[data-voice-target]").forEach((button) => {
    button.onclick = () => startVoiceToField(button.dataset.voiceTarget, button);
  });
  document.querySelectorAll("textarea[data-group]").forEach((input) => {
    input.oninput = () => {
      state[input.dataset.group] = state[input.dataset.group] || {};
      state[input.dataset.group][input.dataset.key] = input.value;
      save();
    };
  });
  document.querySelectorAll("[data-task] [data-icap]").forEach((button) => {
    button.onclick = () => {
      markIcap(button.parentElement.dataset.task, button.dataset.icap);
      renderPages(document.querySelector(".page.active")?.id || "home");
    };
  });
  document.getElementById("quietBtn")?.addEventListener("click", () => {
    const next = !state.companion?.quietMode;
    setQuietMode(next);
    speak(next ? "我在。今天先少说。我们只选一个最小动作，做完就算开始了。" : "好，我回来陪你。我们还是慢慢来。");
    renderPages("home");
  });
  document.getElementById("saveCompanionMoment")?.addEventListener("click", () => {
    addCompanionMoment(document.getElementById("companionMoment").value, "home");
    renderPages("home");
  });
  document.getElementById("sendCompanion")?.addEventListener("click", () => sendCompanionMessage());
  document.getElementById("voiceCompanion")?.addEventListener("click", startCompanionVoiceInput);
  document.getElementById("continuousCompanion")?.addEventListener("click", () => {
    continuousCompanion = !continuousCompanion;
    renderPages("companion");
    if (continuousCompanion) setTimeout(startCompanionVoiceInput, 250);
  });
  document.getElementById("bedtimeSummaryCompanion")?.addEventListener("click", () => speak(bedtimeSummary()));
  document.getElementById("feedbackSubject")?.addEventListener("change", (event) => {
    state.feedbackSubject = event.target.value;
    save();
    renderPages("feedback");
  });
  document.getElementById("addFeedback")?.addEventListener("click", () => {
    addTeacherFeedback({
      subject: document.getElementById("feedbackSubject").value,
      words: document.getElementById("teacherWords").value.trim(),
      focus: document.getElementById("teacherFocus").value,
      nextAction: document.getElementById("nextAction").value.trim()
    });
    renderPages("feedback");
  });
  document.getElementById("saveSnapshot")?.addEventListener("click", () => {
    snapshotToday();
    renderPages("history");
  });
  document.getElementById("snapshotFromWeekly")?.addEventListener("click", () => {
    snapshotToday();
    renderPages("weekly");
  });
  document.getElementById("bedtimeSummary")?.addEventListener("click", () => speak(bedtimeSummary()));
  document.querySelectorAll("[data-delete-history]").forEach((button) => {
    button.onclick = () => {
      deleteHistoryItem(button.dataset.deleteHistory);
      renderPages("history");
    };
  });
  document.getElementById("exportHistory")?.addEventListener("click", () => downloadJson(`dabai-history-${TODAY}.json`, history));
  document.getElementById("saveDadNote")?.addEventListener("click", () => {
    addDadNote(document.getElementById("dadMessage").value);
    renderPages("parent");
  });
  document.querySelectorAll("[data-tone]").forEach((button) => {
    button.onclick = () => speak(humanToneLines[button.dataset.tone][0]);
  });
}

async function sendCompanionMessage(messageOverride = "") {
  const input = document.getElementById("companionInput");
  const message = String(messageOverride || input?.value || "").trim();
  if (!message) return;
  if (input) input.value = "";
  addCompanionMessage("user", message);
  renderPages(state.activeModule === "chat" ? "home" : "companion");
  try {
    const response = await fetch("/api/companion-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        context: companionContext(),
        recentMessages: state.companion?.conversation || []
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "chat failed");
    addCompanionMessage("assistant", data.reply);
    addCompanionMoment(data.reply, "companion");
    renderPages(state.activeModule === "chat" ? "home" : "companion");
    speak(data.reply, { afterEnd: continuousCompanion ? () => setTimeout(startCompanionVoiceInput, 700) : null });
  } catch {
    const fallback = "我在。我们先不急着解决全部，先把这件事变小一点。";
    addCompanionMessage("assistant", fallback);
    renderPages(state.activeModule === "chat" ? "home" : "companion");
    speak(fallback, { afterEnd: continuousCompanion ? () => setTimeout(startCompanionVoiceInput, 700) : null });
  }
}

function startCompanionVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const input = document.getElementById("companionInput");
  const status = document.getElementById("companionStatus");
  if (!SpeechRecognition || !input) {
    alert("这个浏览器暂时不支持语音识别，可以换 Chrome/Safari，或者先用文字。");
    return;
  }
  if (recognition) recognition.stop();
  recognition = new SpeechRecognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  if (status) status.textContent = "大白在听，说完停一下就会自动回答。";
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    if (status) status.textContent = `听到了：${transcript}`;
    sendCompanionMessage(transcript);
  };
  recognition.onerror = () => {
    if (status) status.textContent = "刚才没听清，可以再点一次开始说话。";
  };
  recognition.onend = () => {
    if (status && !input.value) status.textContent = "点“开始说话”，说完后大白会自动回答。";
  };
  recognition.start();
}

function startVoiceToField(targetId, button) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const input = document.getElementById(targetId);
  if (!SpeechRecognition || !input) {
    alert("这个浏览器暂时不支持语音识别，可以换 Chrome/Safari，或者先用文字。");
    return;
  }
  if (recognition) recognition.stop();
  recognition = new SpeechRecognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  const originalText = button?.textContent || "🎙 说";
  if (button) {
    button.textContent = "听...";
    button.classList.add("active");
  }
  input.focus();
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    input.value = `${input.value.trim()}${input.value.trim() ? "\n" : ""}${transcript}`;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  recognition.onerror = () => {
    if (button) button.textContent = "再说";
  };
  recognition.onend = () => {
    if (button) {
      button.textContent = originalText;
      button.classList.remove("active");
    }
  };
  recognition.start();
}

function renderProgress() {
  const count = taskDoneCount();
  const total = requiredTasks().length || 1;
  const percent = Math.min(100, Math.round((count / total) * 100));
  const voyage = voyageState();
  progressNum.textContent = `${onlineDayCount()}天`;
  bar.style.width = `${percent}%`;
  progressText.textContent = `${voyage.countText} · ${voyage.nextText}`;
}

function pageText() {
  const active = document.querySelector(".page.active");
  return active ? active.innerText.replace(/\s+/g, " ").slice(0, 800) : document.body.innerText.slice(0, 800);
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    document.getElementById("ttsStatus").textContent = data.ttsConfigured ? "高级语音已连接" : "本地语音可用";
  } catch {
    document.getElementById("ttsStatus").textContent = "请从 http://localhost:3000 打开";
  }
}

async function speak(text, options = {}) {
  text = String(text || "").trim();
  if (!text) return;
  try {
    if (audio) audio.pause();
    const voice = document.getElementById("voiceSel")?.value || "marin";
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice,
        model: "gpt-4o-mini-tts",
        instructions: "像一个熟悉八宝的温暖伙伴在身边说话。语速自然，有轻微停顿和呼吸感，不要播音腔，不要机器人客服感。"
      })
    });
    if (!response.ok) throw new Error("tts failed");
    const blob = await response.blob();
    audio = new Audio(URL.createObjectURL(blob));
    audio.onended = () => options.afterEnd?.();
    await audio.play();
  } catch {
    fallbackSpeak(text, options);
  }
}

function fallbackSpeak(text, options = {}) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
  utterance.pitch = 1.04;
  utterance.onend = () => options.afterEnd?.();
  speechSynthesis.speak(utterance);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function title() {
  const date = new Date();
  todayTitle.textContent = `${date.getMonth() + 1}月${date.getDate()}日 · 大白在线`;
  const motto = document.getElementById("motto");
  if (motto) motto.textContent = activePromptLine();
}

document.getElementById("readPage").onclick = () => speak(pageText());
document.getElementById("readMotto").onclick = () => speak(document.getElementById("motto").textContent);
document.getElementById("stopVoice").onclick = () => {
  if (audio) audio.pause();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
};
document.getElementById("exportBtn").onclick = () => downloadJson(`dabai-${TODAY}.json`, state);
window.addEventListener("dabai:state-saved", () => {
  renderProgress();
  title();
});

initNav();
renderPages("home");
renderProgress();
title();
checkHealth();
