import { allCurriculumLessons, getLessonById, getLessonsBySubject } from "./allLessons";
import type { LessonContent, Subject } from "../../types/curriculum";

function fieldText(lesson: LessonContent): string {
  return [
    lesson.theme,
    ...lesson.knowledgePoints,
    ...lesson.keyConcepts,
    ...(lesson.keyWords || []),
    ...(lesson.phraseChunks || []),
    ...(lesson.sentencePatterns || []),
    ...(lesson.grammarFocus || []),
    ...Object.values(lesson.abilityGoals),
    ...lesson.commonTaskTypes
  ].join(" ").toLowerCase();
}

function scoreRelated(source: LessonContent, target: LessonContent): number {
  const sourceText = fieldText(source);
  const targetTokens = fieldText(target).split(/\s+|、|，|。|\/|\+/).filter(Boolean);
  const tokenScore = targetTokens.reduce((score, token) => (sourceText.includes(token) ? score + 1 : score), 0);
  return tokenScore + (source.theme === target.theme ? 5 : 0);
}

export function findRelatedLessons({
  subject,
  lessonId,
  targetSubjects = []
}: {
  subject?: Subject;
  lessonId?: string;
  targetSubjects?: Subject[];
}): LessonContent[] {
  const source = lessonId ? getLessonById(lessonId) : subject ? getLessonsBySubject(subject)[0] : allCurriculumLessons[0];
  if (!source) return [];
  return allCurriculumLessons
    .filter((lesson) => lesson.id !== source.id)
    .filter((lesson) => !targetSubjects.length || targetSubjects.includes(lesson.subject))
    .map((lesson) => ({ lesson, score: scoreRelated(source, lesson) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.lesson);
}
