import { getLessonsBySubject } from "../curriculum/allLessons";
import type { LessonContent, Subject } from "../../types/curriculum";

export function generateOnePointFeedback({
  userOutput,
  lessonContent,
  subject,
  focusSkill
}: {
  userOutput: string;
  lessonContent?: LessonContent;
  subject: Subject;
  focusSkill?: string;
}) {
  const lesson = lessonContent || getLessonsBySubject(subject)[0];
  const text = String(userOutput || "").trim();
  const rules = lesson.onePointFeedbackRules;
  let rule = rules.find((item) => text.includes(item.commonMistake) || text.includes(item.target)) || rules[0];
  if ((subject === "englishSchool" || subject === "longman") && /in Friday/i.test(text)) {
    rule = rules.find((item) => item.target.includes("on + weekday")) || rule;
  }
  if (subject === "math" && !/因为|先|估算|小数点|对齐/.test(text)) {
    rule = rules.find((item) => item.target === "只算不讲") || rule;
  }
  return {
    praise: text ? "你已经把今天的小局留下来了。" : "你已经打开了这个小局。",
    onePoint: rule.feedback,
    example: rule.example || "",
    retryPrompt: rule.retryPrompt,
    masteryTag: rule.target || focusSkill || lesson.commonTaskTypes[0]
  };
}
