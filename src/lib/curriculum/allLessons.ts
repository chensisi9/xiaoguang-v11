import { chineseCurrentTerm } from "../../content/chinese/currentTerm";
import { englishSchoolCurrentTerm } from "../../content/englishSchool/currentTerm";
import { longmanCurrentBook } from "../../content/longman/currentBook";
import { mathCurrentTerm } from "../../content/math/currentTerm";
import type { LessonContent, Subject } from "../../types/curriculum";

export const allCurriculumLessons: LessonContent[] = [
  ...mathCurrentTerm,
  ...chineseCurrentTerm,
  ...englishSchoolCurrentTerm,
  ...longmanCurrentBook
];

export function getLessonById(id: string): LessonContent | undefined {
  return allCurriculumLessons.find((lesson) => lesson.id === id);
}

export function getLessonsBySubject(subject: Subject | "mixed"): LessonContent[] {
  if (subject === "mixed") return allCurriculumLessons;
  return allCurriculumLessons.filter((lesson) => lesson.subject === subject);
}
