export type MusicFile = {
  id: string;
  name: string;
  type: "score" | "backingTrack" | "demo" | "recording";
  url: string;
  uploadedAt: string;
};

export type MusicFocusPoint =
  | "rhythm"
  | "breathing"
  | "intonation"
  | "smoothness"
  | "tempo"
  | "expression"
  | "sectionConnection";

export type MusicSection = {
  id: string;
  label: string;
  measureRange?: string;
  description: string;
  difficulty: "easy" | "normal" | "hard";
  focusPoints: MusicFocusPoint[];
  status: "notStarted" | "learning" | "stable" | "needsReview";
};

export type MusicPiece = {
  id: string;
  title: string;
  composerOrSource?: string;
  instrument: "harmonica";
  status: "notStarted" | "learning" | "reviewing" | "completed";
  scoreFiles: MusicFile[];
  backingTracks: MusicFile[];
  demoTracks: MusicFile[];
  sections: MusicSection[];
  weeklyGoal: string;
  currentSectionId?: string;
};

export type MusicPracticeTask = {
  id: string;
  date: string;
  pieceId: string;
  sectionId: string;
  title: string;
  why: string;
  steps: string[];
  estimatedMinutes: number;
  onePointFocus: MusicFocusPoint;
  outputRequirement: string;
  recordRequired: boolean;
};

export type MusicPracticeLog = {
  id: string;
  date: string;
  pieceId: string;
  sectionId: string;
  practicedMinutes: number;
  completedSteps: string[];
  recordingFile?: MusicFile;
  onePointFocus: MusicFocusPoint;
  note: string;
  nextSuggestion: string;
};
