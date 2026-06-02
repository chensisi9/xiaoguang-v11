export const TODAY = new Date().toISOString().slice(0, 10);

export const pagesDef = [
  { id: "home", icon: "☀️", name: "今日", title: "四年级下期末复习日", hint: "现在是6月期末冲刺。先完成数学、英语、语文三科四年级下复习，再保留口琴和网球的短训练。", kind: "home" },
  { id: "companion", icon: "✨", name: "陪伴", title: "和小光说说话", hint: "可以直接跟小光说今天的烦、卡住、开心或不想学。小光会先陪你，再帮你把下一步变小。", kind: "companion" },
  { id: "daily", icon: "✅", name: "每日任务", title: "四年级下期末每日复习", hint: "数学、语文、英语只围绕四年级下册当前资料复习。口琴和网球保持短练，不抢主科精力。", kind: "daily" },
  { id: "materials", icon: "📚", name: "资料", title: "八宝正在学的资料库", hint: "小光不背课本正文，但会把这些资料当成课程背景，生成更贴近八宝当下学习的训练回合。", kind: "materials" },
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
    title: "数学期末复习",
    detail: "资料主线：人教版四年级下册数学。6月重点复习四则运算、运算律、小数、三角形和统计。",
    target: "今日建议：人教四下 10道小数/简算 + 2道三角形/统计/应用题。只记录1个错因。",
    icap: "A"
  },
  {
    id: "english",
    icon: "🗣️",
    type: "英语",
    title: "英语期末复习",
    detail: "资料主线：精通四年级下册英语。6月重点复习课本核心词句、问答句和易混词。",
    target: "今日建议：精通四下听读1段 + 3组课本问答 + 3句输出。只改1个易混点。",
    icap: "A"
  },
  {
    id: "chinese",
    icon: "📖",
    type: "语文",
    title: "语文期末复习",
    detail: "资料主线：人教版四年级下册语文。6月重点复习古诗文、课内阅读、词句和习作素材。",
    target: "今日建议：人教四下 1首古诗/文言 + 1段课内阅读 + 3个词句。只改1个表达点。",
    icap: "A"
  },
  {
    id: "harmonica",
    icon: "🎵",
    type: "口琴",
    title: "口琴",
    detail: "只练最容易乱的 4-8 小节；尤克里里也可以记一个和弦手感。",
    target: "今天只改：气息、节拍、换孔、一个小节不乱、一个和弦手感，选一个。",
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

export const finalReviewPlan = {
  title: "6月期末最后一个月复习",
  period: "2026年6月",
  sources: ["人教版四年级下册数学", "人教版四年级下册语文", "精通四年级下册英语"],
  supportingResources: ["RAZ 分级阅读", "可汗学院数学", "自然拼读课", "英文哈利波特原著阅读课", "朗文课本 1A-6B"],
  principle: "只围绕四年级下册期末复习。数学抓错因，语文抓课内和表达，英语抓精通四下能说出口的核心句。",
  weeks: [
    {
      name: "第1周：补漏洞",
      range: "6月1日-6月7日",
      focus: ["数学：人教四下小数意义、性质、加减法、四则运算错因", "语文：人教四下古诗文和课内重点词句", "英语：精通四下 where/when、the/they/their、核心问答句"],
      daily: "每天每科只做一小组，错题必须说出错因。"
    },
    {
      name: "第2周：单元轮转",
      range: "6月8日-6月14日",
      focus: ["数学：人教四下运算律、三角形、观察物体、图形运动", "语文：人教四下课内阅读、概括、修辞和句式", "英语：精通四下单元词句复现和课本问答"],
      daily: "每天一个主单元，结束时让八宝当教练抓一处陷阱。"
    },
    {
      name: "第3周：综合卷感",
      range: "6月15日-6月21日",
      focus: ["数学：人教四下综合小卷，审题和时间感", "语文：人教四下阅读题思路和习作素材", "英语：精通四下听读、看图说话、三句输出"],
      daily: "练卷感但不堆量，重点看重复错因。"
    },
    {
      name: "第4周：轻量冲刺",
      range: "6月22日-6月30日",
      focus: ["数学：人教四下错题本和高频陷阱", "语文：人教四下古诗文、词句、作文开头结尾", "英语：精通四下核心词句、易混点、朗读流畅"],
      daily: "少做新难题，多做熟练度和信心。"
    }
  ],
  dailyTemplate: [
    "数学 20分钟：人教四下 10道计算/简算 + 2道图形/统计/应用题，记录1个错因。",
    "语文 20分钟：人教四下 1个课内点 + 1段阅读 + 1句写具体，避免大段抄写。",
    "英语 15分钟：精通四下 听读 + 3组课本问答 + 3句输出，只改一个易混点。",
    "英语能力线 5-10分钟：RAZ/自然拼读/哈利波特三选一，只做轻量输入。",
    "数学辅助线 5-10分钟：可汗数学只用来查漏，不替代人教四下复习。",
    "口琴 5分钟：只练最乱的4-8小节。",
    "网球 10分钟：只练一个动作点。"
  ],
  subjectTracks: {
    math: ["四则运算", "运算律", "小数意义和性质", "小数加减法", "三角形", "观察物体", "图形运动", "平均数与复式条形统计图"],
    chinese: ["古诗文画面", "课内词句", "阅读概括", "中心句", "修辞句式", "习作素材", "一句写具体"],
    english: ["精通四下核心词句", "where/when", "the/they/their", "课本问答句", "朗读流畅", "3句输出"]
  }
};

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

export const studyMaterials = [
  {
    id: "pep-math-4b",
    subject: "数学",
    title: "人教版四年级下册数学",
    fileName: "【人教版】四年级下册数学电子课本.pdf",
    pages: 123,
    role: "当前校内数学主线",
    coachingUse: "用策略脑和找茬机制处理审题陷阱、运算律、小数、三角形和统计。",
    units: ["四则运算", "观察物体（二）", "运算律", "小数的意义和性质", "三角形", "小数加减法", "图形运动（二）", "平均数与复式条形统计图"]
  },
  {
    id: "pep-chinese-4b",
    subject: "语文",
    title: "人教版四年级下册语文",
    fileName: "【人教版】四年级下册语文电子课本.pdf",
    pages: 151,
    role: "当前校内语文主线",
    coachingUse: "古诗先画面化，阅读先表达观点，写作先留一句痕迹。",
    units: ["短诗三首", "绿", "白桦", "猫", "母鸡", "白鹅", "海上日出", "记金华的双龙洞", "囊萤夜读", "铁杵成针"]
  },
  {
    id: "jing-tong-english-4b",
    subject: "英语",
    title: "精通四下英语",
    fileName: "精通四下英语电子课本 彩色正式版.pdf",
    pages: 98,
    role: "当前校内英语主线",
    coachingUse: "做低门槛输出、场景对话和 where/when、the/they/their 的破冰训练。",
    units: ["校内四下英语", "三句表达", "场景问答", "基础词句复现"]
  },
  {
    id: "khan-math",
    subject: "数学",
    title: "可汗学院数学",
    fileName: "在线课程",
    pages: "按进度",
    role: "数学辅助查漏材料",
    coachingUse: "只作为人教四下复习的补洞工具，用视频和练习解释卡点，不替代校内期末主线。",
    units: ["计算理解", "小数", "几何", "应用题", "错因补洞"]
  },
  {
    id: "raz-reading",
    subject: "英语",
    title: "RAZ 分级阅读",
    fileName: "在线/纸质分级阅读",
    pages: "按级别",
    role: "英语长期阅读输入",
    coachingUse: "服务听读流畅、词汇复现和阅读信心；期末期间只做5-10分钟轻量输入。",
    units: ["分级阅读", "听读", "词汇复现", "一句复述"]
  },
  {
    id: "phonics",
    subject: "英语",
    title: "自然拼读课",
    fileName: "课程",
    pages: "按课次",
    role: "英语发音和解码基础",
    coachingUse: "帮助八宝把看词、读音和拼写连起来；期末期间只修一个音或一个拼读规则。",
    units: ["字母音", "音素意识", "拼读规则", "看词能读"]
  },
  {
    id: "harry-potter-original",
    subject: "英语",
    title: "英文哈利波特原著阅读课",
    fileName: "课程/原著阅读",
    pages: "按章节",
    role: "高兴趣英文原著阅读",
    coachingUse: "作为兴趣和高阶阅读动力，不拿来考试化；优先做情节复述、人物观点和少量关键词。",
    units: ["原著阅读", "情节复述", "人物观点", "高频词块"]
  },
  ...["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"].map((level) => ({
    id: `longman-${level.toLowerCase()}`,
    subject: "英语",
    title: `朗文课本 ${level}`,
    fileName: `朗文课本${level}.pdf`,
    pages: { "1A": 58, "1B": 58, "2A": 54, "2B": 54, "3A": 55, "3B": 57, "4A": 80, "4B": 75, "5A": 81, "5B": 79, "6A": 78, "6B": 77 }[level],
    role: "英语分级补充材料",
    coachingUse: "作为长期螺旋复习素材，优先服务听说、句型复现和生活化表达。",
    units: ["分级阅读", "生活场景", "句型复现", "听说输入"]
  }))
];

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
  role: "八宝的体育+策略学习教练、表达翻译官和成长记录员",
  boundaries: ["不检查式追问", "不替八宝完成任务", "不评价孩子够不够努力", "不一上来纠错", "每次只推一个小动作"],
  learningPromise: "先让八宝愿意开始，再把一个动作练准；先看见他的想法，再帮他变标准。"
};

export const baobaoProfile = {
  age: 10,
  grade: "四年级",
  traits: ["高能量", "表达欲强", "自尊高", "喜欢自由", "有竞争感", "运动型", "好奇心强"],
  strengths: ["口语表达", "辩论和观点", "运动训练感", "网球目标感", "对世界有好奇心"],
  interests: ["网球", "围棋", "国际象棋", "口琴", "尤克里里", "我的世界", "网球电子游戏", "神奇校车"],
  sparks: ["网球", "足球", "跑步", "篮球", "橄榄球/Super Bowl", "比赛", "升级", "徽章", "观点表达", "纠正大人的错误", "当小老师"],
  upcomingScenes: ["2026年7月底搬入新家", "2026年7月武汉网球营", "9月桃树种植和生物观察"],
  academicFocus: {
    english: ["where/when 场景区分", "the/they/their", "3句英文输出", "运动和行程英语"],
    math: ["逻辑强", "6进制与10进制", "审题陷阱", "怕连环追问"],
    chinese: ["四年级古诗", "塞下曲", "芙蓉楼送辛渐", "墨梅", "白描", "托物言志", "具象画面理解"]
  },
  studyMaterials,
  resistanceTriggers: ["被检查", "被命令", "被比较", "还没表达完就纠错", "任务太长", "突然提高难度", "连环追问", "考核压力", "父子控制战"],
  coachingIdentities: ["体育+策略教练", "表达翻译官", "训练教练", "成长记录员", "低能量保护者"],
  interactionMechanisms: ["A/B角选择权", "八宝教练找茬", "场景化绑定", "即时正向反馈", "任务闯关"],
  preferredFlow: "5分钟启动 -> 10分钟主任务 -> 2分钟反馈 -> 结束",
  languageRules: {
    say: ["你这个想法是对的，我帮你变成更标准的表达。", "我们只做三句话，不写作文。", "先完成，再变好。", "今天最低版本也算赢。", "你先说，我来当翻译教练。"],
    avoid: ["这么简单你都不会？", "你看别人都能写。", "赶紧写，别废话。", "你又错了。", "你怎么老这样？"]
  },
  englishPath: ["where/when 场景破冰", "the/they/their 视觉区分", "3句英文输出痕迹", "3句 + because", "I think 观点句", "把运动和英语结合"],
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
