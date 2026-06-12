export const curriculumLessons = [
  {
    id: "math-4b-decimal-add-sub",
    subject: "math",
    bookName: "人教版数学四年级下册",
    grade: "四年级",
    term: "下册",
    unit: "小数的加法和减法",
    lessonTitle: "小数加减法",
    theme: "计算与检查",
    sourcePdf: "【人教版】四年级下册数学电子课本.pdf",
    pageRange: "结构化整理：小数计算复习段",
    knowledgePoints: ["小数点对齐", "相同数位相加减", "估算检查", "结果化简"],
    keyConcepts: ["先对齐小数点", "用估算判断结果是否合理", "末尾的0可以去掉"],
    abilityGoals: {
      calculation: "能正确完成一位或两位小数加减法",
      reasoning: "能说清楚为什么小数点要对齐",
      expression: "能把第一步讲给大白听"
    },
    commonTaskTypes: ["做1道基础题", "讲清第一步", "检查小数点", "记录1个错因"],
    lowEnergyTask: {
      title: "数学低电量启动",
      steps: ["看1道小数加减题", "只说这题先看哪里", "不用完整计算"],
      outputRequirement: "说1句话",
      estimatedMinutes: 5
    },
    normalTask: {
      title: "数学讲清楚小局",
      steps: ["做1道小数加减题", "讲清为什么小数点对齐", "估算检查一次", "写下1个错因"],
      outputRequirement: "做1题 + 讲清楚第一步",
      estimatedMinutes: 12
    },
    challengeTask: {
      title: "小数点侦探",
      steps: ["做2道同类题", "故意找1个可能错因", "自己编1道小数点陷阱题"],
      outputRequirement: "2题 + 1个错因 + 1道自编题",
      estimatedMinutes: 20
    },
    sportsConnection: "用网球比分或训练时间设计小数加减题",
    examConnection: "期末常见错因是小数点没对齐或忘记估算",
    thinkingQuestion: "为什么估算能帮你发现小数点放错了？",
    onePointFeedbackRules: [
      {
        target: "小数点对齐",
        commonMistake: "按数字末尾对齐",
        feedback: "今天只改一个点：小数加减先对齐小数点。",
        example: "3.6 + 2.45 要把小数点竖着对齐。",
        retryPrompt: "你再说一遍第一步先对齐哪里。"
      },
      {
        target: "只算不讲",
        commonMistake: "答案对但说不清楚",
        feedback: "今天只改一个点：说出第一步为什么这样做。",
        example: "我先对齐小数点，因为相同数位才能相加减。",
        retryPrompt: "你把第一步的原因说一遍。"
      }
    ],
    reviewRules: {
      firstReviewAfterDays: 2,
      secondReviewAfterDays: 4,
      masteryCriteria: "连续3次能算对并讲清小数点对齐原因"
    }
  },
  {
    id: "math-4b-triangle",
    subject: "math",
    bookName: "人教版数学四年级下册",
    grade: "四年级",
    term: "下册",
    unit: "三角形",
    lessonTitle: "三角形的特性",
    theme: "图形与推理",
    sourcePdf: "【人教版】四年级下册数学电子课本.pdf",
    pageRange: "结构化整理：三角形复习段",
    knowledgePoints: ["三角形三边", "稳定性", "三边关系", "按角和边分类"],
    keyConcepts: ["任意两边之和大于第三边", "三角形具有稳定性", "先判断条件再计算"],
    abilityGoals: {
      reasoning: "能判断三条线段是否能围成三角形",
      problemSolving: "能从题目条件中找边长关系",
      expression: "能说清判断理由"
    },
    commonTaskTypes: ["判断能否围成三角形", "解释三边关系", "画图辅助", "找陷阱"],
    lowEnergyTask: {
      title: "三角形低电量启动",
      steps: ["看3条边", "只判断能不能围成三角形", "说一句理由"],
      outputRequirement: "判断 + 1句话",
      estimatedMinutes: 6
    },
    normalTask: {
      title: "三角形侦探小局",
      steps: ["判断1组三边", "说清用的是哪条规则", "画一个小图", "记录1个易错点"],
      outputRequirement: "判断1题 + 讲清规则",
      estimatedMinutes: 12
    },
    challengeTask: {
      title: "三角形陷阱题",
      steps: ["做2道判断题", "找1个陷阱", "自己编1组不能围成三角形的边长"],
      outputRequirement: "2题 + 1个陷阱",
      estimatedMinutes: 20
    },
    sportsConnection: "用网球场上的三角站位理解稳定性",
    onePointFeedbackRules: [
      {
        target: "三边关系",
        commonMistake: "只看最长边，不比较两边之和",
        feedback: "今天只改一个点：先拿最短两边相加，再和最长边比较。",
        example: "3 + 4 > 6，所以可以围成三角形。",
        retryPrompt: "你用最短两边相加再判断一次。"
      }
    ],
    reviewRules: {
      firstReviewAfterDays: 2,
      secondReviewAfterDays: 4,
      masteryCriteria: "能用三边关系讲清判断理由"
    }
  },
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
    abilityGoals: {
      reading: "能朗读一个重点句段",
      comprehension: "能说清这段主要写了什么画面",
      expression: "能说出自己喜欢一句话的理由",
      writing: "能仿写一句具体画面"
    },
    commonTaskTypes: ["朗读一小段", "概括一句", "找好句", "仿写一句", "说出画面"],
    lowEnergyTask: {
      title: "语文低电量启动",
      steps: ["读一句喜欢的句子", "说它写了什么画面", "改写一句"],
      outputRequirement: "说1句，写1句",
      estimatedMinutes: 8
    },
    normalTask: {
      title: "语文讲清楚小局",
      steps: ["读一小段", "说出主要画面", "找一句好句", "仿写一句网球场画面"],
      outputRequirement: "口头讲清楚 + 写1句仿写",
      estimatedMinutes: 15
    },
    challengeTask: {
      title: "语文表达挑战",
      steps: ["读重点段落", "概括主要内容", "说出作者情感", "写3-5句自己的感受"],
      outputRequirement: "写3-5句",
      estimatedMinutes: 25
    },
    sportsConnection: "把网球场上的风、光、脚步声说成一个画面",
    lifeConnection: "先口头说，再落到一句仿写",
    thinkingQuestion: "这句话为什么有画面感？",
    onePointFeedbackRules: [
      {
        target: "概括太散",
        commonMistake: "把所有细节都复述一遍",
        feedback: "今天只改一个点：概括时抓住谁、做了什么、表达了什么。",
        example: "这一段主要写了___，表现出___。",
        retryPrompt: "你再用一句话概括一次。"
      },
      {
        target: "仿写不具体",
        commonMistake: "只写很普通的句子",
        feedback: "今天只改一个点：加一个具体画面。",
        example: "风很大 -> 风把树叶吹得像小船一样晃。",
        retryPrompt: "你给句子加一个画面。"
      }
    ],
    reviewRules: {
      firstReviewAfterDays: 2,
      secondReviewAfterDays: 4,
      masteryCriteria: "能先说出画面，再写出一句具体句子"
    }
  },
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
    keyWords: ["Friday", "usually", "sometimes", "tennis", "after school"],
    phraseChunks: ["play tennis", "after school", "on Friday", "do homework"],
    sentencePatterns: ["I usually ___ on Friday.", "I sometimes ___ after school.", "What do you do after school?"],
    grammarFocus: ["on + weekday", "usually / sometimes 的位置", "一般现在时"],
    abilityGoals: {
      listening: "能听懂别人描述课后活动",
      speaking: "能用 usually / sometimes 说自己的真实生活",
      reading: "能读懂短句中的活动安排",
      writing: "能写3句自己的运动或学习安排"
    },
    commonTaskTypes: ["听一句", "跟读一句", "替换词块", "说真实生活", "写3句"],
    lowEnergyTask: {
      title: "英语低电量启动",
      steps: ["听一句关键句", "跟读一句", "把 tennis 放进去说一句"],
      outputRequirement: "只说1句",
      estimatedMinutes: 5
    },
    normalTask: {
      title: "英语真实生活小局",
      steps: ["读2个例句", "用 usually 说1句", "用 sometimes 说1句", "写3句自己的运动日"],
      outputRequirement: "说2句，写3句",
      estimatedMinutes: 15
    },
    challengeTask: {
      title: "英语表达挑战",
      steps: ["听关键句", "说3句自己的真实生活", "写5句 My Tennis Day", "回答一个 Why 问题"],
      outputRequirement: "说3句，写5句",
      estimatedMinutes: 25
    },
    sportsConnection: "用英语说自己的网球训练日",
    worldConnection: "比较中国学生和英国学生的课后活动",
    thinkingQuestion: "Which is better after school: sports first or homework first? Why?",
    onePointFeedbackRules: [
      {
        target: "on + weekday",
        commonMistake: "in Friday",
        feedback: "今天只改一个点：星期几前面用 on。",
        example: "I usually play tennis on Friday.",
        retryPrompt: "你再把这句话说一遍。"
      },
      {
        target: "usually 的位置",
        commonMistake: "I play usually tennis",
        feedback: "今天只改一个点：usually 通常放在实义动词前面。",
        example: "I usually play tennis.",
        retryPrompt: "你用 usually 再说一句。"
      }
    ],
    reviewRules: {
      firstReviewAfterDays: 2,
      secondReviewAfterDays: 4,
      masteryCriteria: "能用 on Friday 和 usually 说真实活动"
    }
  },
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
    keyWords: ["always", "usually", "sometimes", "practice", "free time"],
    phraseChunks: ["in my free time", "after school", "practice tennis", "read a book"],
    sentencePatterns: ["I usually ___ after school.", "In my free time, I ___.", "I like ___ because ___."],
    grammarFocus: ["频率副词", "because 理由句", "第一人称真实表达"],
    abilityGoals: {
      listening: "能听懂日常活动表达",
      speaking: "能替换词块说自己的生活",
      writing: "能写3-5句自由时间安排",
      thinking: "能用because说明选择"
    },
    commonTaskTypes: ["跟读重点句", "替换3次", "写3句", "回答Why"],
    lowEnergyTask: {
      title: "朗文低电量启动",
      steps: ["跟读一句", "替换一个词", "说自己的真实活动"],
      outputRequirement: "说1句",
      estimatedMinutes: 5
    },
    normalTask: {
      title: "朗文句型小局",
      steps: ["听重点句", "跟读一句", "口头替换3次", "写3句"],
      outputRequirement: "说3句，写3句",
      estimatedMinutes: 15
    },
    challengeTask: {
      title: "朗文表达挑战",
      steps: ["提取1个句型", "替换5次", "写5句真实生活", "回答Why"],
      outputRequirement: "写5句 + 1个理由",
      estimatedMinutes: 25
    },
    sportsConnection: "用朗文句型说网球训练和自由时间",
    onePointFeedbackRules: [
      {
        target: "because 理由句",
        commonMistake: "只有观点没有理由",
        feedback: "今天只改一个点：because 后面补一个清楚理由。",
        example: "I like tennis because it is fast.",
        retryPrompt: "你再用 because 说一次。"
      }
    ],
    reviewRules: {
      firstReviewAfterDays: 2,
      secondReviewAfterDays: 4,
      masteryCriteria: "能用朗文词块说3句真实生活"
    }
  }
];

export function allLessons() {
  return curriculumLessons;
}

export function findLessonById(id) {
  return curriculumLessons.find((lesson) => lesson.id === id) || curriculumLessons[0];
}

export function lessonsBySubject(subject) {
  if (subject === "mixed") return curriculumLessons;
  return curriculumLessons.filter((lesson) => lesson.subject === subject);
}
