import type { LessonContent } from "../../types/curriculum";

export const chineseCurrentTerm: LessonContent[] = [
  {
    id: "chinese-4b-scene-expression",
    subject: "chinese",
    bookName: "人教版语文四年级下册",
    grade: "四年级",
    term: "下册",
    unit: "写景与表达",
    lessonTitle: "海上日出 / 乡下人家能力迁移",
    theme: "自然景色和画面表达",
    sourcePdf: "【人教版】四年级下册语文电子课本.pdf",
    pageRange: "结构化整理：写景课文复习段",
    knowledgePoints: ["画面描写", "关键词句", "作者情感", "比喻和拟人", "仿写一句"],
    keyConcepts: ["先说画面再写句子", "概括抓主要内容", "好句要有具体画面"],
    abilityGoals: { reading: "能朗读一个重点句段", comprehension: "能说清这段主要写了什么画面", expression: "能说出自己喜欢一句话的理由", writing: "能仿写一句具体画面" },
    commonTaskTypes: ["朗读一小段", "概括一句", "找好句", "仿写一句", "说出画面"],
    lowEnergyTask: { title: "语文低电量启动", steps: ["读一句喜欢的句子", "说它写了什么画面", "改写一句"], outputRequirement: "说1句，写1句", estimatedMinutes: 8 },
    normalTask: { title: "语文讲清楚小局", steps: ["读一小段", "说出主要画面", "找一句好句", "仿写一句网球场画面"], outputRequirement: "口头讲清楚 + 写1句仿写", estimatedMinutes: 15 },
    challengeTask: { title: "语文表达挑战", steps: ["读重点段落", "概括主要内容", "说出作者情感", "写3-5句自己的感受"], outputRequirement: "写3-5句", estimatedMinutes: 25 },
    sportsConnection: "把网球场上的风、光、脚步声说成一个画面",
    lifeConnection: "先口头说，再落到一句仿写",
    thinkingQuestion: "这句话为什么有画面感？",
    onePointFeedbackRules: [
      { target: "概括太散", commonMistake: "把所有细节都复述一遍", feedback: "今天只改一个点：概括时抓住谁、做了什么、表达了什么。", example: "这一段主要写了___，表现出___。", retryPrompt: "你再用一句话概括一次。" },
      { target: "仿写不具体", commonMistake: "只写很普通的句子", feedback: "今天只改一个点：加一个具体画面。", example: "风很大 -> 风把树叶吹得像小船一样晃。", retryPrompt: "你给句子加一个画面。" }
    ],
    reviewRules: { firstReviewAfterDays: 2, secondReviewAfterDays: 4, masteryCriteria: "能先说出画面，再写出一句具体句子" }
  }
];
