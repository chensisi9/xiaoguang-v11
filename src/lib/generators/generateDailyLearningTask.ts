import { allCurriculumLessons, getLessonById, getLessonsBySubject } from "../curriculum/allLessons";
import { findRelatedLessons } from "../curriculum/lessonMatcher";
import type { EnergyMode, GeneratedLearningTask, LessonContent, Skill, Subject } from "../../types/curriculum";

type GenerateDailyLearningTaskInput = {
  date: string;
  subject: Subject | "mixed";
  energyMode: EnergyMode;
  selectedLessonIds?: string[];
  focusSkill?: Skill;
  hasPEClass?: boolean;
  interestTag?: "tennis" | "sports" | "world" | "harryPotter" | "schoolLife" | "nature" | "family";
  recentMasteryLog?: Array<{ lessonId: string; mastered?: boolean }>;
};

function seed(date: string): number {
  return date.split("-").reduce((sum, part) => sum + Number(part), 0);
}

function selectLesson(input: GenerateDailyLearningTaskInput): LessonContent {
  const selected = input.selectedLessonIds?.map((id) => getLessonById(id)).find(Boolean);
  if (selected) return selected;
  const pool = input.subject === "mixed" ? allCurriculumLessons : getLessonsBySubject(input.subject);
  return pool[seed(input.date) % pool.length] || allCurriculumLessons[0];
}

function templateFor(lesson: LessonContent, energyMode: EnergyMode) {
  if (energyMode === "low") return lesson.lowEnergyTask;
  if (energyMode === "high") return lesson.challengeTask;
  return lesson.normalTask;
}

export function generateDailyLearningTask(input: GenerateDailyLearningTaskInput): GeneratedLearningTask {
  const lesson = selectLesson(input);
  const template = templateFor(lesson, input.hasPEClass && input.energyMode === "high" ? "normal" : input.energyMode);
  const related = input.subject === "mixed" ? findRelatedLessons({ lessonId: lesson.id }).slice(0, 1) : [];
  const rule = lesson.onePointFeedbackRules[seed(input.date) % lesson.onePointFeedbackRules.length];
  const reviewHit = input.recentMasteryLog?.find((item) => item.lessonId === lesson.id && !item.mastered);
  return {
    id: `${input.date}-${input.subject}-${lesson.id}`,
    date: input.date,
    subject: input.subject,
    title: template.title,
    sourceLessons: [lesson.id, ...related.map((item) => item.id)],
    why: lesson.examConnection || lesson.sportsConnection || lesson.lifeConnection || "把教材里的能力变成今天能说清楚的一小步。",
    taskSteps: template.steps,
    outputRequirement: template.outputRequirement,
    estimatedMinutes: template.estimatedMinutes,
    onePointFocus: rule.feedback,
    sampleAnswer: rule.example ? [rule.example] : [],
    feedbackRules: lesson.onePointFeedbackRules,
    nextReviewSuggestion: reviewHit ? "今天顺手复现上次卡住的一个点。" : `${lesson.reviewRules.firstReviewAfterDays}天后轻复现。`,
    energyMode: input.energyMode,
    interestTag: input.interestTag
  };
}
