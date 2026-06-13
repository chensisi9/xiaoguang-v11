import type { EnergyMode } from "../../types/curriculum";
import type { MusicPiece, MusicPracticeLog, MusicPracticeTask, MusicSection } from "../../types/music";

type Input = {
  date: string;
  energyMode: EnergyMode;
  weekday: number;
  fixedActivitiesToday?: string[];
  currentPiece: MusicPiece;
  recentPracticeLogs?: MusicPracticeLog[];
};

function currentSection(piece: MusicPiece, logs: MusicPracticeLog[] = []): MusicSection {
  const reviewCounts = logs.reduce<Record<string, number>>((map, log) => {
    if (log.nextSuggestion.includes("继续") || log.note.includes("急") || log.note.includes("不准")) {
      map[log.sectionId] = (map[log.sectionId] || 0) + 1;
    }
    return map;
  }, {});
  const needsReview = Object.entries(reviewCounts).find(([, count]) => count >= 2)?.[0];
  if (needsReview) return piece.sections.find((section) => section.id === needsReview) || piece.sections[0];
  const current = piece.sections.find((section) => section.id === piece.currentSectionId) || piece.sections[0];
  if (current.status === "stable") {
    const index = piece.sections.findIndex((section) => section.id === current.id);
    return piece.sections[Math.min(piece.sections.length - 1, index + 1)];
  }
  return current;
}

export function generateMusicPracticeTask(input: Input): MusicPracticeTask {
  const section = currentSection(input.currentPiece, input.recentPracticeLogs || []);
  const hasHarmonicaClass = input.fixedActivitiesToday?.some((item) => item.includes("口琴课")) || input.weekday === 2;
  const low = input.energyMode === "low";
  if (low) {
    return {
      id: `${input.date}-${input.currentPiece.id}-${section.id}-low`,
      date: input.date,
      pieceId: input.currentPiece.id,
      sectionId: section.id,
      title: "低电量口琴：听一遍，吹一小节",
      why: "今天只保留声音和手感，不追求完整。",
      steps: ["听示范或伴奏1遍", "只吹1小节", "说一个感觉：顺了/急了/有音不准"],
      estimatedMinutes: 5,
      onePointFocus: section.focusPoints[0],
      outputRequirement: "说1个感觉，可以不录音。",
      recordRequired: false
    };
  }
  if (hasHarmonicaClass) {
    return {
      id: `${input.date}-${input.currentPiece.id}-class-review`,
      date: input.date,
      pieceId: input.currentPiece.id,
      sectionId: section.id,
      title: "口琴课后轻复盘",
      why: "周二已经有口琴课，晚上只把老师讲过的点收好。",
      steps: ["说今天老师讲了哪一段", "说哪个小节最难", "听一遍伴奏或示范", "可以不录音"],
      estimatedMinutes: 8,
      onePointFocus: "smoothness",
      outputRequirement: "说出今天最难的1个小节。",
      recordRequired: false
    };
  }
  if (input.weekday === 3 || input.weekday === 4) {
    return {
      id: `${input.date}-${input.currentPiece.id}-${section.id}-section`,
      date: input.date,
      pieceId: input.currentPiece.id,
      sectionId: section.id,
      title: "分段巩固任务",
      why: section.description,
      steps: ["听老师示范1遍", "慢速吹2遍", "跟伴奏1遍", "可选录一遍给大白"],
      estimatedMinutes: 12,
      onePointFocus: section.focusPoints[0],
      outputRequirement: "留下这一段的一个感觉：节奏/换气/音准/连贯。",
      recordRequired: false
    };
  }
  if (input.weekday === 6) {
    return {
      id: `${input.date}-${input.currentPiece.id}-${section.id}-connection`,
      date: input.date,
      pieceId: input.currentPiece.id,
      sectionId: section.id,
      title: "连接练习",
      why: "周末适合把两小段接起来，但仍然不要求整首。",
      steps: ["听伴奏1遍", "当前段慢速吹2遍", "当前段+下一段连接1遍", "录一遍保存"],
      estimatedMinutes: 18,
      onePointFocus: "sectionConnection",
      outputRequirement: "录一遍或说出连接处哪里最容易断。",
      recordRequired: true
    };
  }
  if (input.weekday === 0) {
    return {
      id: `${input.date}-${input.currentPiece.id}-${section.id}-light-review`,
      date: input.date,
      pieceId: input.currentPiece.id,
      sectionId: section.id,
      title: "周日轻复盘",
      why: "听一遍上周录音，发现一个进步点就够。",
      steps: ["听一遍上周录音或伴奏", "说一个比上次顺的地方", "选下周继续练的一小段"],
      estimatedMinutes: 6,
      onePointFocus: "expression",
      outputRequirement: "说1个进步点。",
      recordRequired: false
    };
  }
  return {
    id: `${input.date}-${input.currentPiece.id}-${section.id}-daily`,
    date: input.date,
    pieceId: input.currentPiece.id,
    sectionId: section.id,
    title: "今日口琴小局",
    why: section.description,
    steps: ["听示范1遍", "慢速吹1遍", "只改一个点", "收好今天的感觉"],
    estimatedMinutes: 10,
    onePointFocus: section.focusPoints[0],
    outputRequirement: "说出今天最需要改的一个点。",
    recordRequired: false
  };
}
