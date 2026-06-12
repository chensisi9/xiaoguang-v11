import { allLessons, findLessonById, lessonsBySubject } from "./curriculumData.js?v=20260612-curriculum-1";

const subjectLabels = {
  chinese: "语文",
  math: "数学",
  englishSchool: "课内英语",
  longman: "朗文",
  reading: "阅读",
  other: "其他",
  mixed: "混合小局"
};

function dateSeed(date, extra = 0) {
  return String(date || "").split("-").reduce((sum, part) => sum + Number(part || 0), extra);
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function overlapScore(a = {}, b = {}) {
  const fields = ["theme", "knowledgePoints", "keyConcepts", "keyWords", "phraseChunks", "sentencePatterns", "grammarFocus", "commonTaskTypes"];
  const left = fields.flatMap((field) => Array.isArray(a[field]) ? a[field] : [a[field]]).filter(Boolean).join(" ").toLowerCase();
  const rightItems = fields.flatMap((field) => Array.isArray(b[field]) ? b[field] : [b[field]]).filter(Boolean);
  return rightItems.reduce((score, item) => left.includes(String(item).toLowerCase()) ? score + 2 : score, 0);
}

export function findRelatedLessons({ subject, lessonId, targetSubjects = [] } = {}) {
  const source = lessonId ? findLessonById(lessonId) : lessonsBySubject(subject)[0];
  const targets = allLessons().filter((lesson) => lesson.id !== source.id && (!targetSubjects.length || targetSubjects.includes(lesson.subject)));
  return targets
    .map((lesson) => ({ lesson, score: overlapScore(source, lesson) + (source.theme === lesson.theme ? 3 : 0) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.lesson);
}

function pickLesson({ date, subject, selectedLessonIds = [] }) {
  const explicit = selectedLessonIds.map(findLessonById).filter(Boolean);
  if (explicit.length) return explicit[0];
  if (subject === "mixed") {
    const lessons = allLessons();
    return lessons[dateSeed(date) % lessons.length];
  }
  const lessons = lessonsBySubject(subject);
  return lessons[dateSeed(date) % Math.max(1, lessons.length)] || allLessons()[0];
}

function taskTemplate(lesson, energyMode) {
  if (energyMode === "low") return lesson.lowEnergyTask;
  if (energyMode === "high") return lesson.challengeTask;
  return lesson.normalTask;
}

function interestLine(lesson, interestTag) {
  if (interestTag === "tennis" && lesson.sportsConnection) return lesson.sportsConnection;
  if (interestTag === "sports" && lesson.sportsConnection) return lesson.sportsConnection;
  if (interestTag === "world" && lesson.worldConnection) return lesson.worldConnection;
  if (lesson.lifeConnection) return lesson.lifeConnection;
  return lesson.thinkingQuestion || "把教材里的能力变成今天能说清楚的一小步。";
}

export function generateDailyLearningTask({
  date,
  subject = "math",
  energyMode = "normal",
  selectedLessonIds = [],
  focusSkill = "",
  hasPEClass = false,
  interestTag = "tennis",
  recentMasteryLog = []
} = {}) {
  const lesson = pickLesson({ date, subject, selectedLessonIds });
  const related = subject === "mixed"
    ? findRelatedLessons({ lessonId: lesson.id, targetSubjects: ["englishSchool", "longman", "chinese", "math"] }).slice(0, 1)
    : [];
  const linkedLessons = uniq([lesson, ...related].map((item) => item.id));
  const template = taskTemplate(lesson, hasPEClass && energyMode === "high" ? "normal" : energyMode);
  const rule = lesson.onePointFeedbackRules[dateSeed(date, focusSkill.length) % lesson.onePointFeedbackRules.length];
  const why = lesson.examConnection || interestLine(lesson, interestTag);
  const reviewHit = recentMasteryLog.find((item) => item.lessonId === lesson.id && !item.mastered);
  return {
    id: `${date}-${subject}-${lesson.id}`,
    date,
    subject,
    title: template.title,
    sourceLessons: linkedLessons,
    sourceTitle: `${subjectLabels[lesson.subject] || lesson.subject} · ${lesson.unit}`,
    lessonTitle: lesson.lessonTitle,
    why,
    taskSteps: template.steps,
    outputRequirement: template.outputRequirement,
    estimatedMinutes: template.estimatedMinutes,
    onePointFocus: rule.feedback,
    sampleAnswer: rule.example ? [rule.example] : [],
    feedbackRules: lesson.onePointFeedbackRules,
    nextReviewSuggestion: reviewHit ? "今天顺手复现上次卡住的一个点。" : `${lesson.reviewRules.firstReviewAfterDays}天后轻复现。`,
    energyMode,
    interestTag,
    lesson
  };
}

export function generateOnePointFeedback({ userOutput = "", lessonContent, subject = "math", focusSkill = "" } = {}) {
  const text = String(userOutput || "").trim();
  const lesson = lessonContent || lessonsBySubject(subject)[0] || allLessons()[0];
  const rules = lesson.onePointFeedbackRules || [];
  let rule = rules.find((item) => text.includes(item.commonMistake) || text.includes(item.target)) || rules[0];
  if (lesson.subject === "englishSchool" || lesson.subject === "longman") {
    if (/in Friday/i.test(text)) rule = rules.find((item) => item.target.includes("on + weekday")) || rule;
    if (/play usually/i.test(text)) rule = rules.find((item) => item.target.includes("usually")) || rule;
    if (/\bthink\b/i.test(text) && !/\bbecause\b/i.test(text)) rule = rules.find((item) => item.target.includes("because")) || rule;
  }
  if (lesson.subject === "math" && !/因为|why|先|小数点|估算|对齐/.test(text)) {
    rule = rules.find((item) => item.target === "只算不讲") || rule;
  }
  const praise = text ? "你已经把今天的小局留下来了。" : "你已经打开了这个小局。";
  return {
    praise,
    onePoint: rule?.feedback || "今天只改一个点：把想法说慢一点。",
    example: rule?.example || "",
    retryPrompt: rule?.retryPrompt || "你再用一句话说一次。",
    masteryTag: rule?.target || focusSkill || lesson.commonTaskTypes?.[0] || "表达"
  };
}

export function nextReviewDate(date, attempt = 1, mastered = false) {
  const days = mastered ? 7 : attempt >= 2 ? 4 : 2;
  const [year, month, day] = String(date).slice(0, 10).split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
