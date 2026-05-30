import { TODAY, createInitialState, defaultTasks, progressKeys } from "./schema.js";

export const storeKey = "xiaoguang_v11_state";
export const historyKey = "xiaoguang_v11_history";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function normalizeState(raw) {
  if (!raw || raw.date !== TODAY) return createInitialState();
  const existingTasks = Array.isArray(raw.tasks) ? raw.tasks : [];
  const tasks = defaultTasks.map((task) => ({ ...task, ...(existingTasks.find((item) => item.id === task.id) || {}) }));
  return {
    ...createInitialState(),
    ...raw,
    tasks,
    practice: raw.practice || {},
    map: raw.map || {},
    synthesis: raw.synthesis || {},
    tacit: raw.tacit || {},
    transfer: raw.transfer || {},
    dailyNotes: raw.dailyNotes || {},
    weekly: raw.weekly || {},
    teacherFeedback: raw.teacherFeedback || [],
    dadNotes: raw.dadNotes || [],
    done: raw.done || {}
  };
}

export let state = normalizeState(readJson(storeKey, {}));
export let history = readJson(historyKey, []);

export function save() {
  localStorage.setItem(storeKey, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("xiaoguang:state-saved", { detail: state }));
}

export function saveHistory() {
  localStorage.setItem(historyKey, JSON.stringify(history));
}

export function setDone(key, value = true) {
  state.done[key] = value;
  save();
}

export function progressCount() {
  return progressKeys.filter((key) => state.done?.[key] || state[key]).length;
}

export function addTeacherFeedback(entry) {
  state.teacherFeedback.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...entry });
  save();
}

export function addDadNote(text, tone = "warm") {
  state.dadNotes.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), tone, text });
  save();
}

export function snapshotToday() {
  const snapshot = {
    id: `${state.date}-${Date.now()}`,
    savedAt: new Date().toISOString(),
    date: state.date,
    weather: state.weather,
    load: state.load,
    difficulty: state.difficulty,
    done: state.done,
    progress: progressCount(),
    tasks: state.tasks,
    dailyNotes: state.dailyNotes,
    teacherFeedback: state.teacherFeedback,
    dadNotes: state.dadNotes
  };
  history = [snapshot, ...history.filter((item) => item.date !== state.date)].slice(0, 120);
  saveHistory();
  return snapshot;
}

export function deleteHistoryItem(id) {
  history = history.filter((item) => item.id !== id);
  saveHistory();
}

export function getWeekHistory() {
  const now = new Date(TODAY);
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  return history.filter((item) => {
    const day = new Date(item.date);
    return day >= start && day <= now;
  });
}

save();
