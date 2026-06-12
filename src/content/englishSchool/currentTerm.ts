import type { LessonContent } from "../../types/curriculum";

export const englishSchoolCurrentTerm: LessonContent[] = [
  {
    id: "english-school-4b-weekday",
    subject: "englishSchool",
    bookName: "精通四下英语",
    grade: "四年级",
    term: "下册",
    unit: "Unit 4",
    lessonTitle: "School Life and Activities",
    theme: "daily routines and hobbies",
    sourcePdf: "精通四下英语电子课本 彩色正式版.pdf",
    pageRange: "结构化整理：活动表达复习段",
    knowledgePoints: ["weekday", "activity words", "真实生活问答"],
    keyConcepts: ["用真实生活替换句型", "先说短句再扩展"],
    keyWords: ["Friday", "usually", "sometimes", "tennis", "after school"],
    phraseChunks: ["play tennis", "after school", "on Friday", "do homework"],
    sentencePatterns: ["I usually ___ on Friday.", "I sometimes ___ after school.", "What do you do after school?"],
    grammarFocus: ["on + weekday", "usually / sometimes 的位置", "一般现在时"],
    abilityGoals: { listening: "能听懂别人描述课后活动", speaking: "能用 usually / sometimes 说自己的真实生活", reading: "能读懂短句中的活动安排", writing: "能写3句自己的运动或学习安排" },
    commonTaskTypes: ["听一句", "跟读一句", "替换词块", "说真实生活", "写3句"],
    lowEnergyTask: { title: "英语低电量启动", steps: ["听一句关键句", "跟读一句", "把 tennis 放进去说一句"], outputRequirement: "只说1句", estimatedMinutes: 5 },
    normalTask: { title: "英语真实生活小局", steps: ["读2个例句", "用 usually 说1句", "用 sometimes 说1句", "写3句自己的运动日"], outputRequirement: "说2句，写3句", estimatedMinutes: 15 },
    challengeTask: { title: "英语表达挑战", steps: ["听关键句", "说3句自己的真实生活", "写5句 My Tennis Day", "回答一个 Why 问题"], outputRequirement: "说3句，写5句", estimatedMinutes: 25 },
    sportsConnection: "用英语说自己的网球训练日",
    worldConnection: "比较中国学生和英国学生的课后活动",
    thinkingQuestion: "Which is better after school: sports first or homework first? Why?",
    onePointFeedbackRules: [
      { target: "on + weekday", commonMistake: "in Friday", feedback: "今天只改一个点：星期几前面用 on。", example: "I usually play tennis on Friday.", retryPrompt: "你再把这句话说一遍。" },
      { target: "usually 的位置", commonMistake: "I play usually tennis", feedback: "今天只改一个点：usually 通常放在实义动词前面。", example: "I usually play tennis.", retryPrompt: "你用 usually 再说一句。" }
    ],
    reviewRules: { firstReviewAfterDays: 2, secondReviewAfterDays: 4, masteryCriteria: "能用 on Friday 和 usually 说真实活动" }
  }
];
