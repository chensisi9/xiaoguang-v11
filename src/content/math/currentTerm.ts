import type { LessonContent } from "../../types/curriculum";

export const mathCurrentTerm: LessonContent[] = [
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
    lowEnergyTask: { title: "数学低电量启动", steps: ["看这道题：12.5 - 3.8 + 2.35", "说清题目要求：原来、用去、接上分别是什么意思", "只说第一步先算什么，不用完整计算"], outputRequirement: "完整说1句话：这题要求___，我第一步先___。", estimatedMinutes: 5 },
    normalTask: { title: "数学讲清楚小局", steps: ["完整读题：一根绳子原来12.5米，用去3.8米，又接上2.35米，现在长多少米", "写完整算式：12.5 - 3.8 + 2.35", "讲清为什么小数点要对齐", "估算检查一次，并写下1个可能错因"], outputRequirement: "完整表达：题目要求什么 + 算式 + 答案 + 为什么这样算", estimatedMinutes: 12 },
    challengeTask: { title: "小数点侦探", steps: ["做2道同类题：37.6 - 8.75 + 12.4；12.5 - 3.8 + 2.35", "每道题说清“要求什么”再计算", "故意找1个可能错因", "自己编1道小数点陷阱题"], outputRequirement: "2题完整表达 + 1个错因 + 1道自编题", estimatedMinutes: 20 },
    sportsConnection: "用网球比分或训练时间设计小数加减题",
    examConnection: "期末常见错因是小数点没对齐或忘记估算",
    thinkingQuestion: "为什么估算能帮你发现小数点放错了？",
    onePointFeedbackRules: [
      { target: "小数点对齐", commonMistake: "按数字末尾对齐", feedback: "今天只改一个点：小数加减先对齐小数点。", example: "3.6 + 2.45 要把小数点竖着对齐。", retryPrompt: "你再说一遍第一步先对齐哪里。" },
      { target: "只算不讲", commonMistake: "答案对但说不清楚", feedback: "今天只改一个点：说出第一步为什么这样做。", example: "我先对齐小数点，因为相同数位才能相加减。", retryPrompt: "你把第一步的原因说一遍。" }
    ],
    reviewRules: { firstReviewAfterDays: 2, secondReviewAfterDays: 4, masteryCriteria: "连续3次能算对并讲清小数点对齐原因" }
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
    abilityGoals: { reasoning: "能判断三条线段是否能围成三角形", problemSolving: "能从题目条件中找边长关系", expression: "能说清判断理由" },
    commonTaskTypes: ["判断能否围成三角形", "解释三边关系", "画图辅助", "找陷阱"],
    lowEnergyTask: { title: "三角形低电量启动", steps: ["看这组三边：6 cm、9 cm、8 cm", "判断能不能围成三角形", "说一句理由：最短两边相加要大于最长边"], outputRequirement: "完整说：6、9、8能/不能围成三角形，因为___。", estimatedMinutes: 6 },
    normalTask: { title: "三角形侦探小局", steps: ["完整读题：第三条边从3 cm、8 cm、16 cm里选，哪一个能和6 cm、9 cm围成三角形", "分别判断3、8、16三个选项", "说清用的是哪条规则", "记录1个易错点"], outputRequirement: "完整表达：我选___，因为第三边要大于___并且小于___。", estimatedMinutes: 12 },
    challengeTask: { title: "三角形陷阱题", steps: ["做2道判断题：6、9、8；6、9、16", "每题都说清最短两边相加和最长边的关系", "找1个陷阱", "自己编1组不能围成三角形的边长"], outputRequirement: "2题完整判断 + 1个陷阱", estimatedMinutes: 20 },
    sportsConnection: "用网球场上的三角站位理解稳定性",
    onePointFeedbackRules: [
      { target: "三边关系", commonMistake: "只看最长边，不比较两边之和", feedback: "今天只改一个点：先拿最短两边相加，再和最长边比较。", example: "3 + 4 > 6，所以可以围成三角形。", retryPrompt: "你用最短两边相加再判断一次。" }
    ],
    reviewRules: { firstReviewAfterDays: 2, secondReviewAfterDays: 4, masteryCriteria: "能用三边关系讲清判断理由" }
  }
];
