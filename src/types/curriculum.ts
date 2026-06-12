export type Subject = "chinese" | "math" | "englishSchool" | "longman" | "reading" | "other";

export type Skill =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "recitation"
  | "calculation"
  | "reasoning"
  | "problemSolving"
  | "expression"
  | "comprehension"
  | "phonics"
  | "grammar"
  | "vocabulary"
  | "thinking";

export type EnergyMode = "low" | "normal" | "high";

export type LearningTaskTemplate = {
  title: string;
  steps: string[];
  outputRequirement: string;
  estimatedMinutes: number;
};

export type OnePointFeedbackRule = {
  target: string;
  commonMistake: string;
  feedback: string;
  example?: string;
  retryPrompt: string;
};

export type LessonContent = {
  id: string;
  subject: Subject;
  bookName: string;
  grade?: string;
  term?: string;
  unit: string;
  lessonTitle: string;
  theme: string;
  sourcePdf?: string;
  pageRange?: string;
  knowledgePoints: string[];
  keyConcepts: string[];
  keyWords?: string[];
  phraseChunks?: string[];
  sentencePatterns?: string[];
  formulas?: string[];
  grammarFocus?: string[];
  abilityGoals: {
    listening?: string;
    speaking?: string;
    reading?: string;
    writing?: string;
    recitation?: string;
    calculation?: string;
    reasoning?: string;
    problemSolving?: string;
    expression?: string;
    comprehension?: string;
    thinking?: string;
  };
  commonTaskTypes: string[];
  lowEnergyTask: LearningTaskTemplate;
  normalTask: LearningTaskTemplate;
  challengeTask: LearningTaskTemplate;
  sportsConnection?: string;
  worldConnection?: string;
  lifeConnection?: string;
  examConnection?: string;
  thinkingQuestion?: string;
  onePointFeedbackRules: OnePointFeedbackRule[];
  reviewRules: {
    firstReviewAfterDays: number;
    secondReviewAfterDays: number;
    masteryCriteria: string;
  };
};

export type GeneratedLearningTask = {
  id: string;
  date: string;
  subject: Subject | "mixed";
  title: string;
  sourceLessons: string[];
  why: string;
  taskSteps: string[];
  outputRequirement: string;
  estimatedMinutes: number;
  onePointFocus: string;
  sampleAnswer?: string[];
  feedbackRules: OnePointFeedbackRule[];
  nextReviewSuggestion: string;
  energyMode: EnergyMode;
  interestTag?: string;
};

export type MasteryLogItem = {
  id: string;
  date: string;
  subject: Subject | "mixed";
  lessonId: string;
  taskTitle: string;
  focusSkill: Skill | string;
  userOutput: string;
  onePointFocus: string;
  masteryTag: string;
  mastered: boolean;
  nextReviewDate: string;
};
