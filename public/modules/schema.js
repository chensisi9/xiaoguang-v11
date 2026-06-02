export const TODAY = new Date().toISOString().slice(0, 10);

export const pagesDef = [
  { id: "home", icon: "☀️", name: "今日", title: "今天先做重要的几件事", hint: "先看状态，再完成数学、英语、语文、口琴和网球。每项只改一个小点。", kind: "home" },
  { id: "companion", icon: "✨", name: "陪伴", title: "和小光说说话", hint: "可以直接跟小光说今天的烦、卡住、开心或不想学。小光会先陪你，再帮你把下一步变小。", kind: "companion" },
  { id: "daily", icon: "✅", name: "每日任务", title: "五项每日刻意练习", hint: "不用做很多。每个项目只记录：今天练什么、只改哪一点、完成到哪一步。", kind: "daily" },
  { id: "feedback", icon: "🏅", name: "老师反馈", title: "老师反馈库", hint: "把老师的话变成下一次能练的动作。", kind: "feedback" },
  { id: "weekly", icon: "📈", name: "周复盘", title: "本周复盘", hint: "每周只看趋势：哪项更稳定，哪项卡住，下周只保留一个小动作。", kind: "weekly" },
  { id: "history", icon: "🗂", name: "历史", title: "历史记录", hint: "保存今天，之后可以回看八宝每天练过什么。", kind: "history" },
  { id: "parent", icon: "💬", name: "留言", title: "爸爸留言", hint: "少一点催促，多一点看见。", kind: "parent" }
];

export const defaultTasks = [
  {
    id: "math",
    icon: "🔢",
    type: "数学",
    title: "数学",
    detail: "做一组核心题，最后只复盘一个错因。",
    target: "今天只改：审题、计算、画图、单位、最后检查，选一个。",
    icap: "A"
  },
  {
    id: "english",
    icon: "🗣️",
    type: "英语",
    title: "英语",
    detail: "先说中文想法，再变成 3 句英文。",
    target: "今天只改：首字母大写、一个拼写、because、完整句，选一个。",
    icap: "A"
  },
  {
    id: "chinese",
    icon: "📖",
    type: "语文",
    title: "语文",
    detail: "先表达一个想法，再留下一句话痕迹。",
    target: "今天只改：一句写具体、我喜欢因为、我不同意因为、朗读节奏，选一个。",
    icap: "A"
  },
  {
    id: "harmonica",
    icon: "🎵",
    type: "口琴",
    title: "口琴",
    detail: "只练最容易乱的 4-8 小节。",
    target: "今天只改：气息、节拍、换孔、一个小节不乱，选一个。",
    icap: "A"
  },
  {
    id: "tennis",
    icon: "🎾",
    type: "网球",
    title: "网球",
    detail: "只练一个动作，不追求整场表现。",
    target: "今天只改：小垫步、击球点、随挥、还原站位，选一个。",
    icap: "A"
  }
];

export const progressKeys = defaultTasks.map((task) => `task_${task.id}`);

export const teacherSubjects = {
  math: {
    icon: "🔢",
    name: "数学",
    focus: ["审题", "计算准确", "画图理解", "错题复盘"],
    samples: ["今天错题不用多，只把一个错因说清楚。"]
  },
  english: {
    icon: "🗣️",
    name: "英语",
    focus: ["发音", "完整句", "朗读流畅", "新词迁移"],
    samples: ["先说完整，再说漂亮。"]
  },
  chinese: {
    icon: "📖",
    name: "语文",
    focus: ["阅读理解", "一句写具体", "段落顺序", "朗读节奏"],
    samples: ["别急着写很多，先把一句话写得能看见。"]
  },
  harmonica: {
    icon: "🎵",
    name: "口琴",
    focus: ["气息稳定", "第 4-8 小节", "换孔干净", "节拍不抢"],
    samples: ["慢一点，但每个音要站稳。"]
  },
  tennis: {
    icon: "🎾",
    name: "网球",
    focus: ["小垫步", "击球点靠前", "随挥完整", "还原站位"],
    samples: ["今天只看击球点，不急着赢球。"]
  }
};

export const dadMessages = [
  "今天不用全满，先把一个动作做准。",
  "我看见你开始了，这已经很重要。",
  "这个卡点不是你不行，是我们找到今天要练的地方了。",
  "你想要提示，还是想自己再想十秒？",
  "今天哪一项最值得给自己点个赞？"
];

export const humanToneLines = {
  warm: ["我在。先不用解释，我们慢慢来。"],
  quiet: ["今天少说。喝水，坐一会儿，再回来。"],
  brave: ["不用怕难，我们只改一个小点。"]
};

export const companionProfile = {
  name: "小光",
  role: "八宝的运动型学习教练、表达翻译官和成长记录员",
  boundaries: ["不检查式追问", "不替八宝完成任务", "不评价孩子够不够努力", "不一上来纠错", "每次只推一个小动作"],
  learningPromise: "先让八宝愿意开始，再把一个动作练准；先看见他的想法，再帮他变标准。"
};

export const baobaoProfile = {
  age: 10,
  grade: "四年级",
  traits: ["高能量", "表达欲强", "自尊高", "喜欢自由", "有竞争感", "运动型", "好奇心强"],
  strengths: ["口语表达", "辩论和观点", "运动训练感", "网球目标感", "对世界有好奇心"],
  sparks: ["网球", "足球", "跑步", "篮球", "橄榄球/Super Bowl", "比赛", "升级", "徽章", "观点表达"],
  resistanceTriggers: ["被检查", "被命令", "被比较", "还没表达完就纠错", "任务太长", "突然提高难度", "父子控制战"],
  coachingIdentities: ["表达翻译官", "训练教练", "成长记录员", "低能量保护者"],
  preferredFlow: "5分钟启动 -> 10分钟主任务 -> 2分钟反馈 -> 结束",
  languageRules: {
    say: ["你这个想法是对的，我帮你变成更标准的表达。", "我们只做三句话，不写作文。", "先完成，再变好。", "今天最低版本也算赢。", "你先说，我来当翻译教练。"],
    avoid: ["这么简单你都不会？", "你看别人都能写。", "赶紧写，别废话。", "你又错了。", "你怎么老这样？"]
  },
  englishPath: ["3句英文输出痕迹", "3句 + because", "I think 观点句", "把运动和英语结合"],
  lowEnergyVersions: ["普通版：写3句", "低能量版：只说3句，大人代写", "最低版：只填一个词也算完成"]
};

export const companionLines = {
  start: [
    "我在。今天不用一下子变厉害，先开始一小步。",
    "我们不追求全满，只把一个动作做准。",
    "先选一项最容易开始的，做完它，今天就有光了。"
  ],
  tired: [
    "今天有点累，那就把任务变小，不把你变硬。",
    "少说一点也可以。我们只做一项最小动作。",
    "先喝水，坐一会儿。等身体回来，大脑才好启动。"
  ],
  done: [
    "我记住了：今天你不是空想，你真的练过了。",
    "完成不是重点，找到下次怎么练才是重点。",
    "这一项已经留下痕迹了，明天会轻一点。"
  ],
  review: [
    "今天最值得留下的，不是做了多少，而是哪一个小点变准了。",
    "如果只带走一句话：少一点，准一点，明天接着来。",
    "小光收好今天的记录。八宝不是任务列表，是一个慢慢长本领的人。"
  ]
};

export function createInitialState() {
  return {
    date: TODAY,
    weather: "",
    tasks: structuredClone(defaultTasks),
    dailyNotes: {},
    weekly: {},
    teacherFeedback: [],
    dadNotes: [],
    companion: {
      moments: [],
      conversation: [],
      lastSpokenAt: "",
      quietMode: false
    },
    done: {}
  };
}
