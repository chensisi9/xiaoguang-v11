import { dadMessages, humanToneLines, pagesDef, progressKeys, teacherSubjects, TODAY } from "./modules/schema.js";
import {
  addDadNote,
  addTeacherFeedback,
  deleteHistoryItem,
  getWeekHistory,
  history,
  progressCount,
  save,
  setDone,
  snapshotToday,
  state
} from "./modules/state.js";

const nav = document.getElementById("nav");
const pages = document.getElementById("pages");
const progressNum = document.getElementById("progressNum");
const progressText = document.getElementById("progressText");
const bar = document.getElementById("bar");
const todayTitle = document.getElementById("todayTitle");
let audio = null;

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
}

function initNav() {
  nav.innerHTML = pagesDef.map((p, i) => `<button class="${i === 0 ? "active" : ""}" data-page="${p.id}">${p.icon} ${p.name}</button>`).join("");
  nav.querySelectorAll("button").forEach((button) => (button.onclick = () => showPage(button.dataset.page)));
}

function showPage(id) {
  document.querySelectorAll(".nav button").forEach((button) => button.classList.toggle("active", button.dataset.page === id));
  document.querySelectorAll(".page").forEach((page) => page.classList.toggle("active", page.id === id));
}

function renderPages(activeId = document.querySelector(".page.active")?.id || "home") {
  pages.innerHTML = pagesDef.map((page) => `<section id="${page.id}" class="page ${page.id === activeId ? "active" : ""}">${renderPage(page)}</section>`).join("");
  bindAll();
  showPage(activeId);
}

function renderPage(page) {
  return `<div class="card"><h2>${page.icon} ${page.title}</h2><p>${page.hint}</p></div>${renderers[page.kind]?.() || ""}`;
}

function taskDoneCount() {
  return state.tasks.filter((task) => state.done?.[`task_${task.id}`]).length;
}

function choiceButtons(field, options) {
  return options
    .map(([value, hint]) => `<button class="choice ${state[field] === value ? "active" : ""}" data-choice-field="${field}" data-choice="${escapeHtml(value)}"><b>${value}</b><span class="small">${hint}</span></button>`)
    .join("");
}

function noteField(task, key, placeholder) {
  const value = state.dailyNotes?.[task.id]?.[key] || "";
  return `<textarea data-daily-task="${task.id}" data-daily-key="${key}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>`;
}

function taskCard(task, compact = false) {
  const done = state.done?.[`task_${task.id}`];
  return `<div class="card task ${done ? "done" : ""}">
    <div class="taskTop"><div class="icon">${task.icon}</div><div class="pill">${task.type}</div></div>
    <h2>${task.title}</h2>
    <p>${task.detail}</p>
    <div class="note blue">${task.target}</div>
    ${compact ? "" : `<label>今天实际练了什么</label>${noteField(task, "today", "例如：20 道计算题 / 朗读第 3 段 / 第 4-8 小节")}` }
    ${compact ? "" : `<label>今天只改一个点</label>${noteField(task, "focus", "例如：计算前先圈关键词 / 换孔慢半拍 / 击球点靠前")}` }
    <div class="ladder" data-task="${task.id}">
      ${["P 看过", "A 练过", "C 讲清楚", "I 得到反馈"].map((item) => `<button class="${task.icap === item[0] ? "active" : ""}" data-icap="${item[0]}">${item}</button>`).join("")}
    </div>
    <button class="primary ${done ? "done" : ""}" data-done="task_${task.id}">${done ? "已完成" : "完成这一项"}</button>
  </div>`;
}

function teacherSubjectOptions(selected = "tennis") {
  return Object.entries(teacherSubjects).map(([key, item]) => `<option value="${key}" ${selected === key ? "selected" : ""}>${item.icon} ${item.name}</option>`).join("");
}

function renderFeedbackList() {
  if (!state.teacherFeedback.length) return `<div class="history">还没有反馈。可以先记一句老师今天说过的重点。</div>`;
  return state.teacherFeedback
    .map((item) => {
      const subject = teacherSubjects[item.subject] || teacherSubjects.tennis;
      return `<div class="history"><b>${subject.icon} ${subject.name}</b> · ${escapeHtml(item.focus)}<br>${escapeHtml(item.words || "未填写老师原话")}<br><span class="tiny">下次只练：${escapeHtml(item.nextAction || "未填写")} · ${new Date(item.createdAt).toLocaleString("zh-CN")}</span></div>`;
    })
    .join("");
}

function renderHistoryList() {
  if (!history.length) return `<div class="history">还没有历史。点“保存今天”，今天的任务和反馈就会留下来。</div>`;
  return history
    .map((item) => `<div class="history"><b>${item.date}</b> · 完成 ${item.progress}/${progressKeys.length}<br>天气：${escapeHtml(item.weather || "未记录")}<br>老师反馈：${item.teacherFeedback?.length || 0} 条<br><button class="secondary" data-delete-history="${item.id}">删除</button></div>`)
    .join("");
}

function weeklySummary() {
  const week = getWeekHistory();
  const feedbackCount = week.reduce((count, item) => count + (item.teacherFeedback?.length || 0), 0);
  const avg = week.length ? Math.round(week.reduce((count, item) => count + item.progress, 0) / week.length) : 0;
  return { days: week.length, feedbackCount, avg };
}

function field(group, key, placeholder) {
  const value = state[group]?.[key] || "";
  return `<label>${placeholder}</label><textarea data-group="${group}" data-key="${key}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>`;
}

const renderers = {
  home() {
    return `<div class="grid2">
      <div class="card">
        <h2>今天状态</h2>
        <div class="choiceGrid">${choiceButtons("weather", [["很好", "可以正常练"], ["还行", "每项做短一点"], ["有点累", "只保留三项"], ["不想学", "先做一项最小动作"]])}</div>
        <div class="quote">今天完成 ${taskDoneCount()}/${state.tasks.length} 项。够不够，不看全满，看有没有把一个小点练准。</div>
        <button class="primary secondary" id="quietBtn">少说模式</button>
      </div>
      <div class="card">
        <h2>今日五项</h2>
        ${state.tasks.map((task) => `<div class="history"><b>${task.icon} ${task.title}</b> · ${state.done?.[`task_${task.id}`] ? "已完成" : "未完成"}<br><span class="tiny">${escapeHtml(task.target)}</span></div>`).join("")}
        <button class="primary" data-jump="daily">开始每日任务</button>
      </div>
    </div>`;
  },
  daily() {
    return `<div class="grid2">${state.tasks.map((task) => taskCard(task)).join("")}</div>`;
  },
  feedback() {
    const selected = state.feedbackSubject || "tennis";
    const subject = teacherSubjects[selected] || teacherSubjects.tennis;
    return `<div class="grid2">
      <div class="card">
        <h2>${subject.icon} 新增反馈</h2>
        <label>项目</label><select id="feedbackSubject">${teacherSubjectOptions(selected)}</select>
        <label>老师原话</label><textarea id="teacherWords" placeholder="${escapeHtml(subject.samples[0])}"></textarea>
        <label>今天主要在改什么</label><select id="teacherFocus">${subject.focus.map((focus) => `<option>${escapeHtml(focus)}</option>`).join("")}</select>
        <label>下一次只练一个动作</label><textarea id="nextAction" placeholder="例如：下次只练第 4-8 小节慢速三遍"></textarea>
        <button class="primary" id="addFeedback">保存反馈</button>
      </div>
      <div class="card"><h2>反馈记录</h2>${renderFeedbackList()}</div>
    </div>`;
  },
  weekly() {
    const summary = weeklySummary();
    return `<div class="grid2">
      <div class="card">
        <h2>这一周怎么样</h2>
        <div class="quote">已保存 ${summary.days} 天，平均完成 ${summary.avg}/${progressKeys.length} 项，老师反馈 ${summary.feedbackCount} 条。</div>
        ${field("weekly", "stable", "本周最稳定的一项：")}
        ${field("weekly", "stuck", "本周最容易卡住的一项：")}
        ${field("weekly", "next", "下周只保留一个重点动作：")}
        <button class="primary" data-done="weekly">保存周复盘</button>
      </div>
      <div class="card">
        <h2>复盘提醒</h2>
        <div class="note green">不用评价孩子够不够努力。只看：哪一项更稳定了，哪个错误反复出现，下一周少做一点但做准一点。</div>
        <button class="primary secondary" id="snapshotFromWeekly">保存今天</button>
      </div>
    </div>`;
  },
  history() {
    return `<div class="grid2">
      <div class="card"><h2>保存今天</h2><p>保存后，今天的五项练习、状态和老师反馈会进入历史。</p><button class="primary" id="saveSnapshot">保存今天</button><button class="primary secondary" id="exportHistory">导出历史</button></div>
      <div class="card"><h2>历史</h2>${renderHistoryList()}</div>
    </div>`;
  },
  parent() {
    return `<div class="grid2">
      <div class="card"><h2>爸爸留言</h2><label>选一句今天能说的话</label><select id="dadMessage">${dadMessages.map((message) => `<option>${escapeHtml(message)}</option>`).join("")}</select><button class="primary" id="saveDadNote">保存留言</button></div>
      <div class="card"><h2>语气</h2><div class="choiceGrid">${Object.entries(humanToneLines).map(([tone, lines]) => `<button class="choice" data-tone="${tone}"><b>${tone}</b><span class="small">${escapeHtml(lines[0])}</span></button>`).join("")}</div><div class="history">${state.dadNotes.map((note) => `${escapeHtml(note.text)}<br><span class="tiny">${new Date(note.createdAt).toLocaleString("zh-CN")}</span>`).join("<hr>") || "还没有留言。"}</div></div>
    </div>`;
  }
};

function bindAll() {
  document.querySelectorAll("[data-choice-field]").forEach((button) => {
    button.onclick = () => {
      state[button.dataset.choiceField] = button.dataset.choice;
      save();
      renderPages("home");
    };
  });
  document.querySelectorAll("[data-jump]").forEach((button) => (button.onclick = () => showPage(button.dataset.jump)));
  document.querySelectorAll("[data-done]").forEach((button) => {
    button.onclick = () => {
      setDone(button.dataset.done, !state.done[button.dataset.done]);
      renderPages(document.querySelector(".page.active")?.id || "home");
    };
  });
  document.querySelectorAll("[data-daily-task]").forEach((input) => {
    input.oninput = () => {
      state.dailyNotes = state.dailyNotes || {};
      state.dailyNotes[input.dataset.dailyTask] = state.dailyNotes[input.dataset.dailyTask] || {};
      state.dailyNotes[input.dataset.dailyTask][input.dataset.dailyKey] = input.value;
      save();
    };
  });
  document.querySelectorAll("textarea[data-group]").forEach((input) => {
    input.oninput = () => {
      state[input.dataset.group] = state[input.dataset.group] || {};
      state[input.dataset.group][input.dataset.key] = input.value;
      save();
    };
  });
  document.querySelectorAll("[data-task] [data-icap]").forEach((button) => {
    button.onclick = () => {
      const task = state.tasks.find((item) => item.id === button.parentElement.dataset.task);
      task.icap = button.dataset.icap;
      save();
      renderPages("daily");
    };
  });
  document.getElementById("quietBtn")?.addEventListener("click", () => speak("我在。今天先少说。我们只选一个最小动作，做完就算开始了。"));
  document.getElementById("feedbackSubject")?.addEventListener("change", (event) => {
    state.feedbackSubject = event.target.value;
    save();
    renderPages("feedback");
  });
  document.getElementById("addFeedback")?.addEventListener("click", () => {
    addTeacherFeedback({
      subject: document.getElementById("feedbackSubject").value,
      words: document.getElementById("teacherWords").value.trim(),
      focus: document.getElementById("teacherFocus").value,
      nextAction: document.getElementById("nextAction").value.trim()
    });
    renderPages("feedback");
  });
  document.getElementById("saveSnapshot")?.addEventListener("click", () => {
    snapshotToday();
    renderPages("history");
  });
  document.getElementById("snapshotFromWeekly")?.addEventListener("click", () => {
    snapshotToday();
    renderPages("weekly");
  });
  document.querySelectorAll("[data-delete-history]").forEach((button) => {
    button.onclick = () => {
      deleteHistoryItem(button.dataset.deleteHistory);
      renderPages("history");
    };
  });
  document.getElementById("exportHistory")?.addEventListener("click", () => downloadJson(`xiaoguang-history-${TODAY}.json`, history));
  document.getElementById("saveDadNote")?.addEventListener("click", () => {
    addDadNote(document.getElementById("dadMessage").value);
    renderPages("parent");
  });
  document.querySelectorAll("[data-tone]").forEach((button) => {
    button.onclick = () => speak(humanToneLines[button.dataset.tone][0]);
  });
}

function renderProgress() {
  const count = progressCount();
  const percent = Math.min(100, Math.round((count / progressKeys.length) * 100));
  progressNum.textContent = `${percent}%`;
  bar.style.width = `${percent}%`;
  progressText.textContent = count ? `今天完成 ${count}/${progressKeys.length} 项每日练习。` : "今天先完成一项就很好。";
}

function pageText() {
  const active = document.querySelector(".page.active");
  return active ? active.innerText.replace(/\s+/g, " ").slice(0, 800) : document.body.innerText.slice(0, 800);
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    document.getElementById("ttsStatus").textContent = data.ttsConfigured ? "高级语音已连接" : "本地语音可用";
  } catch {
    document.getElementById("ttsStatus").textContent = "请从 http://localhost:3000 打开";
  }
}

async function speak(text) {
  text = String(text || "").trim();
  if (!text) return;
  try {
    if (audio) audio.pause();
    const voice = document.getElementById("voiceSel")?.value || "cedar";
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice,
        model: "gpt-4o-mini-tts",
        instructions: "像温暖的家庭学习伙伴一样朗读，短句、自然、少说教。"
      })
    });
    if (!response.ok) throw new Error("tts failed");
    const blob = await response.blob();
    audio = new Audio(URL.createObjectURL(blob));
    await audio.play();
  } catch {
    fallbackSpeak(text);
  }
}

function fallbackSpeak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
  utterance.pitch = 1.04;
  speechSynthesis.speak(utterance);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function title() {
  const date = new Date();
  todayTitle.textContent = `${date.getMonth() + 1}月${date.getDate()}日 · 八宝每日练习`;
}

document.getElementById("readPage").onclick = () => speak(pageText());
document.getElementById("readMotto").onclick = () => speak(document.getElementById("motto").textContent);
document.getElementById("stopVoice").onclick = () => {
  if (audio) audio.pause();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
};
document.getElementById("exportBtn").onclick = () => downloadJson(`xiaoguang-${TODAY}.json`, state);
window.addEventListener("xiaoguang:state-saved", renderProgress);

initNav();
renderPages("home");
renderProgress();
title();
checkHealth();
