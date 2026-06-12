import type { MasteryLogItem } from "../../types/curriculum";

const masteryKey = "dabai_mastery_log";

function safeRead(): MasteryLogItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(masteryKey) || "[]");
  } catch {
    return [];
  }
}

export function getMasteryLog(): MasteryLogItem[] {
  return safeRead();
}

export function nextReviewDate(date: string, attempt = 1, mastered = false): string {
  const days = mastered ? 7 : attempt >= 2 ? 4 : 2;
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function saveMasteryLog(item: MasteryLogItem): MasteryLogItem[] {
  const log = [item, ...safeRead()].slice(0, 365);
  if (typeof localStorage !== "undefined") localStorage.setItem(masteryKey, JSON.stringify(log));
  return log;
}
