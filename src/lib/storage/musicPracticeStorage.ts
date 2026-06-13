import type { MusicPracticeLog } from "../../types/music";

const key = "musicPracticeLogs";

export function getMusicPracticeLogs(): MusicPracticeLog[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function saveMusicPracticeLog(log: MusicPracticeLog): MusicPracticeLog[] {
  const logs = [log, ...getMusicPracticeLogs()].slice(0, 120);
  if (typeof localStorage !== "undefined") localStorage.setItem(key, JSON.stringify(logs));
  return logs;
}
