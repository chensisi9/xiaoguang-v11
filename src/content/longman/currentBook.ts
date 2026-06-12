import type { LessonContent } from "../../types/curriculum";

export const longmanCurrentBook: LessonContent[] = [
  {
    id: "longman-routines-frequency",
    subject: "longman",
    bookName: "朗文新思维英语",
    grade: "桥梁级",
    term: "当前册",
    unit: "Daily Routines",
    lessonTitle: "Frequency and Free Time",
    theme: "daily routines and free time",
    sourcePdf: "朗文课本 1A-6B",
    pageRange: "结构化整理：日常活动表达",
    knowledgePoints: ["frequency adverbs", "free time activities", "短句替换"],
    keyConcepts: ["词块优先于孤立单词", "用真实生活做替换"],
    keyWords: ["always", "usually", "sometimes", "practice", "free time"],
    phraseChunks: ["in my free time", "after school", "practice tennis", "read a book"],
    sentencePatterns: ["I usually ___ after school.", "In my free time, I ___.", "I like ___ because ___."],
    grammarFocus: ["频率副词", "because 理由句", "第一人称真实表达"],
    abilityGoals: { listening: "能听懂日常活动表达", speaking: "能替换词块说自己的生活", writing: "能写3-5句自由时间安排", thinking: "能用because说明选择" },
    commonTaskTypes: ["跟读重点句", "替换3次", "写3句", "回答Why"],
    lowEnergyTask: { title: "朗文低电量启动", steps: ["跟读一句", "替换一个词", "说自己的真实活动"], outputRequirement: "说1句", estimatedMinutes: 5 },
    normalTask: { title: "朗文句型小局", steps: ["听重点句", "跟读一句", "口头替换3次", "写3句"], outputRequirement: "说3句，写3句", estimatedMinutes: 15 },
    challengeTask: { title: "朗文表达挑战", steps: ["提取1个句型", "替换5次", "写5句真实生活", "回答Why"], outputRequirement: "写5句 + 1个理由", estimatedMinutes: 25 },
    sportsConnection: "用朗文句型说网球训练和自由时间",
    onePointFeedbackRules: [
      { target: "because 理由句", commonMistake: "只有观点没有理由", feedback: "今天只改一个点：because 后面补一个清楚理由。", example: "I like tennis because it is fast.", retryPrompt: "你再用 because 说一次。" }
    ],
    reviewRules: { firstReviewAfterDays: 2, secondReviewAfterDays: 4, masteryCriteria: "能用朗文词块说3句真实生活" }
  }
];
