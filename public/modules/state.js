import { TODAY, createInitialState, defaultTasks, progressKeys } from "./schema.js?v=20260602-final-review-4b";

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
  const tasks = defaultTasks.map((task) => {
    const existing = existingTasks.find((item) => item.id === task.id) || {};
    return { ...existing, ...task, icap: existing.icap || task.icap };
  });
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
    companion: {
      moments: raw.companion?.moments || [],
      conversation: raw.companion?.conversation || [],
      lastSpokenAt: raw.companion?.lastSpokenAt || "",
      quietMode: Boolean(raw.companion?.quietMode)
    },
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

export function addCompanionMoment(text, source = "daily") {
  const value = String(text || "").trim();
  if (!value) return;
  state.companion = state.companion || { moments: [], conversation: [], lastSpokenAt: "", quietMode: false };
  state.companion.moments.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), source, text: value });
  state.companion.moments = state.companion.moments.slice(0, 30);
  save();
}

export function addCompanionMessage(role, text) {
  const value = String(text || "").trim();
  if (!value) return;
  state.companion = state.companion || { moments: [], conversation: [], lastSpokenAt: "", quietMode: false };
  state.companion.conversation.push({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), role, text: value });
  state.companion.conversation = state.companion.conversation.slice(-30);
  if (role === "assistant") state.companion.lastSpokenAt = new Date().toISOString();
  save();
}

export function setQuietMode(value) {
  state.companion = state.companion || { moments: [], conversation: [], lastSpokenAt: "", quietMode: false };
  state.companion.quietMode = value;
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
    dadNotes: state.dadNotes,
    companion: state.companion
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
