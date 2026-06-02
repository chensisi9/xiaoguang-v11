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
    detail: "开口说 3 句，或朗读一小段。",
    target: "今天只改：发音、完整句、停顿、语调、一个新词，选一个。",
    icap: "A"
  },
  {
    id: "chinese",
    icon: "📖",
    type: "语文",
    title: "语文",
    detail: "阅读、作文或古诗，只做一个小练习。",
    target: "今天只改：一句写具体、一个好词、段落顺序、朗读节奏，选一个。",
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
  role: "陪八宝每日练习的伙伴",
  boundaries: ["不无限聊天", "不替八宝完成任务", "不评价孩子够不够努力", "每次只推一个小动作"],
  learningPromise: "先让八宝愿意开始，再把一个动作练准。"
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
