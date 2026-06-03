import { baobaoProfile, companionLines, companionProfile, dadMessages, dailyResourceTracks, exampleBank, finalReviewPlan, humanToneLines, pagesDef, progressKeys, studyMaterials, teacherSubjects, TODAY, weeklySchedule } from "./modules/schema.js?v=20260603-abroad-daily";
import {
  addCompanionMoment,
  addCompanionMessage,
  addDadNote,
  addTeacherFeedback,
  deleteHistoryItem,
  getWeekHistory,
  history,
  progressCount,
  save,
  setDone,
  setQuietMode,
  snapshotToday,
  state
} from "./modules/state.js?v=20260603-abroad-daily";

const nav = document.getElementById("nav");
const pages = document.getElementById("pages");
const progressNum = document.getElementById("progressNum");
const progressText = document.getElementById("progressText");
const bar = document.getElementById("bar");
const todayTitle = document.getElementById("todayTitle");
let audio = null;
let recognition = null;
let continuousCompanion = false;

const loadProfiles = {
  "很好": {
    name: "完整训练版",
    summary: "今天状态在线，可以做完整五项，但每项仍然只改一个点。",
    required: ["math", "english", "chinese", "harmonica", "tennis"],
    optional: [],
    paused: [],
    template: [
      "数学 25分钟：人教四下 12道计算/简算 + 3道图形/统计/应用题，记录1个错因。",
      "语文 25分钟：人教四下 1个课内点 + 1段阅读 + 1句写具体。",
      "英语 20分钟：精通四下听读 + 4组课本问答 + 3句输出。",
      "英语能力线 10分钟：RAZ/自然拼读/哈利波特三选一。",
      "可汗数学 10分钟：只补一个数学卡点。",
      "口琴 8分钟，网球 15分钟。"
    ],
    targets: {
      math: "完整版：12道小数/简算 + 3道三角形/统计/应用题。记录1个错因。",
      english: "完整版：精通四下听读1段 + 4组课本问答 + 3句输出。",
      chinese: "完整版：人教四下1个课内点 + 1段阅读 + 1句写具体。",
      harmonica: "完整版：8分钟，最乱4-8小节慢速三遍。",
      tennis: "完整版：15分钟，只练小垫步或击球点。"
    }
  },
  "还行": {
    name: "标准短版",
    summary: "今天不堆量，三科保留，口琴和网球缩短。",
    required: ["math", "english", "chinese", "harmonica", "tennis"],
    optional: [],
    paused: [],
    template: [
      "数学 20分钟：人教四下 10道计算/简算 + 2道图形/统计/应用题。",
      "语文 20分钟：人教四下 1个课内点 + 1段阅读。",
      "英语 15分钟：精通四下听读 + 3组课本问答 + 3句输出。",
      "英语能力线 5分钟：只选 RAZ/自然拼读/哈利波特一个。",
      "口琴 5分钟，网球 10分钟。"
    ],
    targets: {
      math: "短版：10道小数/简算 + 2道三角形/统计/应用题。只抓1个错因。",
      english: "短版：精通四下听读1段 + 3组课本问答 + 3句输出。",
      chinese: "短版：人教四下1个课内点 + 1段阅读，只留1句表达。",
      harmonica: "短版：5分钟，只练一个小节不乱。",
      tennis: "短版：10分钟，只练一个动作点。"
    }
  },
  "有点累": {
    name: "三科保底版",
    summary: "今天保护精力，只保留数学、语文、英语。口琴和网球变成可选小动作。",
    required: ["math", "english", "chinese"],
    optional: ["harmonica", "tennis"],
    paused: [],
    template: [
      "数学 12分钟：人教四下 6道计算/简算，只圈关键词和错因。",
      "语文 12分钟：人教四下 1个课内点，只说清楚画面或中心。",
      "英语 10分钟：精通四下听读 + 2组问答，只改1个易混点。",
      "可选：口琴3分钟或网球5分钟，二选一即可。"
    ],
    targets: {
      math: "保底版：6道小数/简算，只抓关键词和1个错因。",
      english: "保底版：精通四下听读1小段 + 2组课本问答。",
      chinese: "保底版：人教四下1个课内点，只说画面/中心，不大段写。",
      harmonica: "可选：3分钟，只吹最熟的一小段。",
      tennis: "可选：5分钟，只做挥拍或小垫步。"
    }
  },
  "不想学": {
    name: "最低启动版",
    summary: "今天目标不是完成全部，是打破不开局。只做一个最小学习动作。",
    required: ["math"],
    optional: ["english", "chinese"],
    paused: ["harmonica", "tennis"],
    template: [
      "必做 5分钟：数学只做3道最基础的人教四下题，圈关键词。",
      "可选 3分钟：英语只说1句精通四下句子，或语文只说1个课内画面。",
      "口琴和网球今天暂停，不补债。"
    ],
    targets: {
      math: "最低版：只做3道基础题，圈关键词，完成就算赢。",
      english: "可选：只说1句精通四下句子。",
      chinese: "可选：只说1个课内画面或1个关键词。",
      harmonica: "今日暂停：不补债。",
      tennis: "今日暂停：不补债。"
    }
  }
};

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
  return requiredTasks().filter((task) => state.done?.[`task_${task.id}`]).length;
}

function todayLoadProfile() {
  const base = loadProfiles[state.weather] || loadProfiles["还行"];
  const schedule = todaySchedule();
  const required = schedule.requiredOverride || base.required;
  const optional = uniqueList([...base.optional, ...(schedule.optionalExtra || [])]).filter((id) => !required.includes(id));
  const paused = uniqueList([...base.paused, ...(schedule.pausedExtra || [])]).filter((id) => !required.includes(id) && !optional.includes(id));
  const adjusted = Boolean(schedule.requiredOverride || schedule.optionalExtra?.length || schedule.pausedExtra?.length);
  return {
    ...base,
    baseKey: state.weather || "还行",
    name: adjusted ? `${schedule.title} · 固定课调整` : `${base.name} · ${schedule.title}`,
    summary: adjusted ? `按${schedule.day}固定安排调整任务。${schedule.energy}` : `${base.summary} ${schedule.energy}`,
    required,
    optional,
    paused,
    targets: {
      ...base.targets,
      ...(schedule.targetAdjust || {})
    },
    template: scheduleTemplate(base, schedule),
    schedule
  };
}

function resourceIntensityKey() {
  const key = todayLoadProfile().baseKey;
  if (key === "很好") return "full";
  if (key === "还行") return "standard";
  if (key === "有点累") return "support";
  return "minimum";
}

function resourcePlanCard(compact = false) {
  const mode = resourceIntensityKey();
  const englishTracks = dailyResourceTracks.filter((track) => track.subject === "英语");
  const mathTracks = dailyResourceTracks.filter((track) => track.subject === "数学");
  const renderTrack = (track) => `<div class="history"><b>${escapeHtml(track.title)}</b><br><span class="tiny">${escapeHtml(track.purpose)}</span><br>${escapeHtml(track[mode])}</div>`;
  return `<div class="card">
    <div class="taskTop"><div class="pill">留学能力线 · 每日</div><div class="tiny">${mode === "full" ? "完整" : mode === "standard" ? "标准" : mode === "support" ? "保底" : "最低"}</div></div>
    <h2>英语优先，每天不断线</h2>
    <p>RAZ、自然拼读、朗文、哈利波特每天都进计划；状态差就变成微任务，不取消。</p>
    ${compact ? englishTracks.slice(0, 2).map(renderTrack).join("") : englishTracks.map(renderTrack).join("")}
    <div class="note blue">数学辅助：${escapeHtml(mathTracks[0][mode])}</div>
  </div>`;
}

function todaySchedule() {
  return weeklySchedule[new Date(TODAY).getDay()] || weeklySchedule[1];
}

function uniqueList(items) {
  return [...new Set(items)];
}

function scheduleTemplate(base, schedule) {
  const lines = [
    `${schedule.day}：${schedule.title}。${schedule.school}`,
    ...schedule.fixed.map((item) => `固定安排：${item}`),
    `今日原则：${schedule.energy}`
  ];
  const required = schedule.requiredOverride || base.required;
  required.forEach((id) => {
    const label = {
      math: "数学",
      english: "英语",
      chinese: "语文",
      harmonica: "口琴",
      tennis: "网球"
    }[id];
    if (label) lines.push(`${label}：${(schedule.targetAdjust || base.targets)[id] || base.targets[id]}`);
  });
  if (schedule.optionalExtra?.length) lines.push(`可选：${schedule.optionalExtra.map((id) => taskNameById(id)).join("、")}，有余力再做。`);
  if (schedule.pausedExtra?.length) lines.push(`暂停：${schedule.pausedExtra.map((id) => taskNameById(id)).join("、")}，今天不补债。`);
  return lines;
}

function taskNameById(id) {
  return {
    math: "数学",
    english: "英语",
    chinese: "语文",
    harmonica: "口琴",
    tennis: "网球"
  }[id] || id;
}

function taskLoadStatus(task) {
  const profile = todayLoadProfile();
  if (profile.required.includes(task.id)) return "必做";
  if (profile.optional.includes(task.id)) return "可选";
  return "暂停";
}

function taskLoadTarget(task) {
  return todayLoadProfile().targets?.[task.id] || task.target;
}

function exampleCountForTask(task) {
  const profile = todayLoadProfile().name;
  if (!exampleBank[task.id]) return 0;
  if (profile === "完整训练版") return 3;
  if (profile === "标准短版") return 2;
  return 1;
}

function taskExamples(task) {
  const examples = exampleBank[task.id] || [];
  const count = exampleCountForTask(task);
  if (!count) return [];
  const seed = new Date(TODAY).getDate() + task.id.length;
  return Array.from({ length: Math.min(count, examples.length) }, (_, index) => examples[(seed + index) % examples.length]);
}

function requiredTasks() {
  const profile = todayLoadProfile();
  return state.tasks.filter((task) => profile.required.includes(task.id));
}

function optionalTasks() {
  const profile = todayLoadProfile();
  return state.tasks.filter((task) => profile.optional.includes(task.id));
}

function pausedTasks() {
  const profile = todayLoadProfile();
  return state.tasks.filter((task) => profile.paused.includes(task.id));
}

function pickLine(group) {
  const lines = companionLines[group] || companionLines.start;
  const seed = new Date().getDate() + taskDoneCount();
  return lines[seed % lines.length];
}

function companionTodayLine() {
  if (state.companion?.quietMode) return companionLines.tired[0];
  if (taskDoneCount() > 0) return companionLines.done[taskDoneCount() % companionLines.done.length];
  if (state.weather === "有点累" || state.weather === "不想学") return pickLine("tired");
  return pickLine("start");
}

function taskCompanionHint(task) {
  const note = state.dailyNotes?.[task.id]?.focus;
  if (note) return `大白记得：${task.title} 今天只改“${escapeHtml(note)}”。`;
  const status = taskLoadStatus(task);
  if (status === "暂停") return "今天这项暂停，不补债。先保护启动感。";
  return `大白陪你把 ${task.title} 变小：今天是${todayLoadProfile().name}，这项是${status}。`;
}

function bedtimeSummary() {
  const doneTasks = state.tasks.filter((task) => state.done?.[`task_${task.id}`]).map((task) => task.title);
  const feedback = state.teacherFeedback[0];
  const parts = [
    `八宝，今天大白记住了：你完成了 ${taskDoneCount()} 项每日练习。`,
    doneTasks.length ? `已经完成的是：${doneTasks.join("、")}。` : "就算还没完成，也可以先从一个最小动作开始。",
    feedback ? `老师反馈里，最近一次重点是${teacherSubjects[feedback.subject]?.name || "练习"}的${feedback.focus}。` : "",
    state.weekly?.next ? `下周的小重点是：${state.weekly.next}。` : "",
    pickLine("review")
  ];
  return parts.filter(Boolean).join("");
}

function companionContext() {
  const doneTasks = state.tasks.filter((task) => state.done?.[`task_${task.id}`]).map((task) => task.title);
  const focusNotes = state.tasks
    .map((task) => {
      const focus = state.dailyNotes?.[task.id]?.focus;
      return focus ? `${task.title}:${focus}` : "";
    })
    .filter(Boolean);
  const latestFeedback = state.teacherFeedback[0];
  return {
    weather: state.weather,
    loadProfile: todayLoadProfile().name,
    weeklySchedule: todaySchedule(),
    dailyResourceTracks,
    doneTasks,
    focusNotes,
    latestFeedback: latestFeedback ? `${teacherSubjects[latestFeedback.subject]?.name || "练习"} ${latestFeedback.focus}，下次${latestFeedback.nextAction || "继续练"}` : "",
    baobaoProfile,
    finalReviewPlan,
    studyMaterials: studyMaterials.map((item) => ({
      subject: item.subject,
      title: item.title,
      role: item.role,
      coachingUse: item.coachingUse,
      units: item.units
    }))
  };
}

function currentReviewWeek() {
  const today = new Date(TODAY);
  const month = today.getMonth() + 1;
  const day = today.getDate();
  if (month !== 6) return finalReviewPlan.weeks[0];
  if (day <= 7) return finalReviewPlan.weeks[0];
  if (day <= 14) return finalReviewPlan.weeks[1];
  if (day <= 21) return finalReviewPlan.weeks[2];
  return finalReviewPlan.weeks[3];
}

function reviewPlanCard(compact = false) {
  const week = currentReviewWeek();
  return `<div class="card reviewCard">
    <div class="taskTop"><div class="pill">期末复习</div><div class="tiny">${escapeHtml(week.range)}</div></div>
    <h2>${escapeHtml(week.name)}</h2>
    <p>${escapeHtml(finalReviewPlan.principle)}</p>
    <div class="note green">当前复习资料：${finalReviewPlan.sources.map(escapeHtml).join("、")}</div>
    <div class="note blue">辅助资源：${finalReviewPlan.supportingResources.map(escapeHtml).join("、")}。只做查漏和轻量输入，不抢期末主线。</div>
    <div class="reviewList">${week.focus.map((item) => `<div class="history">${escapeHtml(item)}</div>`).join("")}</div>
    ${compact ? "" : `<div class="note blue">${escapeHtml(week.daily)}</div>`}
  </div>`;
}

function renderConversation() {
  const conversation = state.companion?.conversation || [];
  if (!conversation.length) {
    return `<div class="chatEmpty">你可以对大白说：我今天不想学、数学有点烦、网球打得不错，或者只是说“陪我一下”。</div>`;
  }
  return conversation
    .map((item) => `<div class="bubble ${item.role === "user" ? "userBubble" : "lightBubble"}"><b>${item.role === "user" ? "八宝" : "大白"}</b><br>${escapeHtml(item.text)}</div>`)
    .join("");
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
  const status = taskLoadStatus(task);
  const paused = status === "暂停";
  const examples = paused ? [] : taskExamples(task);
  return `<div class="card task ${done ? "done" : ""}">
    <div class="taskTop"><div class="icon">${task.icon}</div><div class="pill">${task.type} · ${status}</div></div>
    <h2>${task.title}</h2>
    <p>${task.detail}</p>
    <div class="note green">${taskCompanionHint(task)}</div>
    <div class="note blue">${escapeHtml(taskLoadTarget(task))}</div>
    ${examples.length ? `<div class="exampleBox">
      <h3>今天直接做</h3>
      ${examples.map((example, index) => `<div class="history">
        <b>${index + 1}. ${escapeHtml(example.point)}</b><br>
        ${escapeHtml(example.prompt)}
        <details><summary>提示 / 答案</summary><div class="tiny">${escapeHtml(example.hint)}<br><b>参考：</b>${escapeHtml(example.answer)}</div></details>
      </div>`).join("")}
    </div>` : ""}
    ${paused ? "" : compact ? "" : `<label>今天实际练了什么</label>${noteField(task, "today", "例如：6 道计算题 / 朗读第 3 段 / 第 4-8 小节")}` }
    ${paused ? "" : compact ? "" : `<label>今天只改一个点</label>${noteField(task, "focus", "例如：计算前先圈关键词 / 换孔慢半拍 / 击球点靠前")}` }
    ${paused ? "" : `<div class="ladder" data-task="${task.id}">
      ${["P 看过", "A 练过", "C 讲清楚", "I 得到反馈"].map((item) => `<button class="${task.icap === item[0] ? "active" : ""}" data-icap="${item[0]}">${item}</button>`).join("")}
    </div>
    <button class="primary ${done ? "done" : ""}" data-done="task_${task.id}">${done ? "已完成" : status === "可选" ? "完成可选项" : "完成这一项"}</button>`}
  </div>`;
}

function loadPlanCard() {
  const profile = todayLoadProfile();
  return `<div class="card">
    <h2>今日负荷：${escapeHtml(profile.name)}</h2>
    <div class="quote">${escapeHtml(profile.summary)}</div>
    <div class="history"><b>必做：</b>${requiredTasks().map((task) => `${task.icon} ${task.title}`).join("、") || "无"}</div>
    ${optionalTasks().length ? `<div class="history"><b>可选：</b>${optionalTasks().map((task) => `${task.icon} ${task.title}`).join("、")}</div>` : ""}
    ${pausedTasks().length ? `<div class="history"><b>暂停：</b>${pausedTasks().map((task) => `${task.icon} ${task.title}`).join("、")}。今天不补债。</div>` : ""}
  </div>`;
}

function scheduleCard() {
  const schedule = todaySchedule();
  return `<div class="card">
    <div class="taskTop"><div class="pill">一周时间表</div><div class="tiny">${escapeHtml(schedule.day)}</div></div>
    <h2>${escapeHtml(schedule.title)}</h2>
    <p>${escapeHtml(schedule.school)}</p>
    ${schedule.fixed.map((item) => `<div class="history">${escapeHtml(item)}</div>`).join("")}
    <div class="note blue">${escapeHtml(schedule.energy)}</div>
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

function materialCards(subject = "") {
  return studyMaterials
    .filter((item) => !subject || item.subject === subject)
    .map((item) => `<div class="history"><b>${escapeHtml(item.subject)} · ${escapeHtml(item.title)}</b><br>${escapeHtml(item.role)} · ${item.pages} 页<br><span class="tiny">${escapeHtml(item.coachingUse)}</span><br><span class="tiny">重点：${item.units.map(escapeHtml).join("、")}</span></div>`)
    .join("");
}

const renderers = {
  home() {
    return `<div class="grid2">
      <div class="card">
        <h2>今天状态</h2>
        <div class="choiceGrid">${choiceButtons("weather", [["很好", "可以正常练"], ["还行", "每项做短一点"], ["有点累", "只保留三项"], ["不想学", "先做一项最小动作"]])}</div>
        <div class="quote">${companionTodayLine()}</div>
        <label>想让大白记住的一句话</label>
        <textarea id="companionMoment" placeholder="例如：今天数学审题有点烦，但我还是开始了。"></textarea>
        <button class="primary secondary" id="saveCompanionMoment">让大白记住</button>
        <button class="primary secondary" id="quietBtn">${state.companion?.quietMode ? "退出少说" : "少说陪伴"}</button>
      </div>
      ${scheduleCard()}
      ${loadPlanCard()}
      ${resourcePlanCard(true)}
      ${reviewPlanCard(true)}
      <div class="card">
        <h2>今日任务会随状态变化</h2>
        ${state.tasks.map((task) => {
          const examples = taskExamples(task);
          return `<div class="history"><b>${task.icon} ${task.title}</b> · ${taskLoadStatus(task)} · ${state.done?.[`task_${task.id}`] ? "已完成" : "未完成"}<br><span class="tiny">${escapeHtml(taskLoadTarget(task))}</span>${examples.length ? `<br><span class="tiny">例题：${escapeHtml(examples[0].point)} · ${escapeHtml(examples[0].prompt)}</span>` : ""}</div>`;
        }).join("")}
        <button class="primary" data-jump="daily">开始每日任务</button>
      </div>
    </div>`;
  },
  daily() {
    const required = requiredTasks();
    const optional = optionalTasks();
    const paused = pausedTasks();
    return `${reviewPlanCard()}${scheduleCard()}${loadPlanCard()}${resourcePlanCard()}<div class="card"><h2>今天照这个节奏</h2>${todayLoadProfile().template.map((item) => `<div class="history">${escapeHtml(item)}</div>`).join("")}</div>
      <div class="grid2">${required.map((task) => taskCard(task)).join("")}</div>
      ${optional.length ? `<div class="card"><h2>可选小动作</h2><p>做完必做还有余力，再选这里。没做也不算失败。</p></div><div class="grid2">${optional.map((task) => taskCard(task)).join("")}</div>` : ""}
      ${paused.length ? `<div class="card"><h2>今日暂停</h2>${paused.map((task) => `<div class="history"><b>${task.icon} ${task.title}</b><br>${escapeHtml(taskLoadTarget(task))}</div>`).join("")}</div>` : ""}`;
  },
  materials() {
    const mainMaterials = studyMaterials.filter((item) => ["pep-math-4b", "pep-chinese-4b", "jing-tong-english-4b"].includes(item.id));
    const mathSupport = studyMaterials.filter((item) => item.id === "khan-math");
    const englishAbility = studyMaterials.filter((item) => ["raz-reading", "phonics", "harry-potter-original"].includes(item.id));
    const longmanMaterials = studyMaterials.filter((item) => item.title.startsWith("朗文课本"));
    return `<div class="grid2">
      <div class="card">
        <h2>期末主线资料</h2>
        <div class="note green">6月期末复习只按这三套四年级下资料走：人教四下数学、人教四下语文、精通四下英语。</div>
        ${mainMaterials.map((item) => `<div class="history"><b>${escapeHtml(item.subject)} · ${escapeHtml(item.title)}</b><br>${escapeHtml(item.role)} · ${item.pages} 页<br><span class="tiny">${escapeHtml(item.coachingUse)}</span><br><span class="tiny">复习范围：${item.units.map(escapeHtml).join("、")}</span></div>`).join("")}
      </div>
      <div class="card">
        <h2>数学辅助线</h2>
        <div class="note blue">可汗数学只用来解释卡点和补洞。6月做题仍然回到人教四下。</div>
        ${mathSupport.map((item) => `<div class="history"><b>${escapeHtml(item.subject)} · ${escapeHtml(item.title)}</b><br>${escapeHtml(item.role)}<br><span class="tiny">${escapeHtml(item.coachingUse)}</span><br><span class="tiny">可用场景：${item.units.map(escapeHtml).join("、")}</span></div>`).join("")}
      </div>
      <div class="card">
        <h2>英语能力线</h2>
        <div class="note blue">RAZ、自然拼读、哈利波特原著阅读课用于听读、拼读和兴趣阅读。期末期间每天最多选一个，5-10分钟即可。</div>
        ${englishAbility.map((item) => `<div class="history"><b>${escapeHtml(item.title)}</b><br>${escapeHtml(item.role)}<br><span class="tiny">${escapeHtml(item.coachingUse)}</span><br><span class="tiny">训练点：${item.units.map(escapeHtml).join("、")}</span></div>`).join("")}
      </div>
      <div class="card">
        <h2>朗文长期补充</h2>
        <div class="note blue">朗文 1A-6B 只作为长期听说和句型复现补充，不进入6月期末主计划。</div>
        ${longmanMaterials.map((item) => `<div class="history"><b>${escapeHtml(item.title)}</b> · ${item.pages} 页<br><span class="tiny">${escapeHtml(item.coachingUse)}</span></div>`).join("")}
      </div>
    </div>`;
  },
  companion() {
    return `<div class="grid2">
      <div class="card">
        <h2>大白在听</h2>
        <div class="chatBox" id="chatBox">${renderConversation()}</div>
        <label>直接跟大白说</label>
        <textarea id="companionInput" placeholder="例如：我今天不想做数学，感觉很烦。"></textarea>
        <div class="status" id="companionStatus">点“开始说话”，说完后大白会自动回答。</div>
        <div class="row">
          <button class="primary" id="voiceCompanion">🎙 开始说话</button>
          <button class="secondary" id="continuousCompanion">${continuousCompanion ? "连续对话：开" : "连续对话：关"}</button>
          <button class="secondary" id="sendCompanion">发送文字</button>
        </div>
      </div>
      <div class="card">
        <h2>大白会记得</h2>
        <div class="note blue">${companionProfile.learningPromise}</div>
        <div class="history">今天状态：${escapeHtml(state.weather || "还没选")}<br>完成：${taskDoneCount()}/${state.tasks.length} 项<br>最近记忆：${escapeHtml(state.companion?.moments?.[0]?.text || "还没有")}</div>
        <button class="primary secondary" id="bedtimeSummaryCompanion">说睡前小结</button>
      </div>
    </div>`;
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
        <div class="note green">不用评价孩子够不够努力。大白只看：哪一项更稳定了，哪个错误反复出现，下一周少做一点但做准一点。</div>
        <button class="primary secondary" id="bedtimeSummary">大白说睡前小结</button>
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
      <div class="card"><h2>大白底层陪伴</h2><div class="note blue">${companionProfile.learningPromise}</div><div class="history"><b>八宝适合：</b>${baobaoProfile.coachingIdentities.join(" / ")}<br><b>容易被点燃：</b>${baobaoProfile.sparks.slice(0, 7).join("、")}<br><b>核心机制：</b>${baobaoProfile.interactionMechanisms.join("、")}<br><b>真实场景：</b>${baobaoProfile.upcomingScenes.join("、")}<br><b>避免：</b>${baobaoProfile.resistanceTriggers.slice(0, 5).join("、")}</div><div class="choiceGrid">${Object.entries(humanToneLines).map(([tone, lines]) => `<button class="choice" data-tone="${tone}"><b>${tone}</b><span class="small">${escapeHtml(lines[0])}</span></button>`).join("")}</div><div class="history">${state.companion?.moments?.map((moment) => `${escapeHtml(moment.text)}<br><span class="tiny">${new Date(moment.createdAt).toLocaleString("zh-CN")}</span>`).join("<hr>") || "大白还没有今日记忆。"}</div></div>
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
  document.getElementById("quietBtn")?.addEventListener("click", () => {
    const next = !state.companion?.quietMode;
    setQuietMode(next);
    speak(next ? "我在。今天先少说。我们只选一个最小动作，做完就算开始了。" : "好，我回来陪你。我们还是慢慢来。");
    renderPages("home");
  });
  document.getElementById("saveCompanionMoment")?.addEventListener("click", () => {
    addCompanionMoment(document.getElementById("companionMoment").value, "home");
    renderPages("home");
  });
  document.getElementById("sendCompanion")?.addEventListener("click", () => sendCompanionMessage());
  document.getElementById("voiceCompanion")?.addEventListener("click", startCompanionVoiceInput);
  document.getElementById("continuousCompanion")?.addEventListener("click", () => {
    continuousCompanion = !continuousCompanion;
    renderPages("companion");
    if (continuousCompanion) setTimeout(startCompanionVoiceInput, 250);
  });
  document.getElementById("bedtimeSummaryCompanion")?.addEventListener("click", () => speak(bedtimeSummary()));
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
  document.getElementById("bedtimeSummary")?.addEventListener("click", () => speak(bedtimeSummary()));
  document.querySelectorAll("[data-delete-history]").forEach((button) => {
    button.onclick = () => {
      deleteHistoryItem(button.dataset.deleteHistory);
      renderPages("history");
    };
  });
  document.getElementById("exportHistory")?.addEventListener("click", () => downloadJson(`dabai-history-${TODAY}.json`, history));
  document.getElementById("saveDadNote")?.addEventListener("click", () => {
    addDadNote(document.getElementById("dadMessage").value);
    renderPages("parent");
  });
  document.querySelectorAll("[data-tone]").forEach((button) => {
    button.onclick = () => speak(humanToneLines[button.dataset.tone][0]);
  });
}

async function sendCompanionMessage(messageOverride = "") {
  const input = document.getElementById("companionInput");
  const message = String(messageOverride || input?.value || "").trim();
  if (!message) return;
  if (input) input.value = "";
  addCompanionMessage("user", message);
  renderPages("companion");
  try {
    const response = await fetch("/api/companion-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        context: companionContext(),
        recentMessages: state.companion?.conversation || []
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "chat failed");
    addCompanionMessage("assistant", data.reply);
    addCompanionMoment(data.reply, "companion");
    renderPages("companion");
    speak(data.reply, { afterEnd: continuousCompanion ? () => setTimeout(startCompanionVoiceInput, 700) : null });
  } catch {
    const fallback = "我在。我们先不急着解决全部，先把这件事变小一点。";
    addCompanionMessage("assistant", fallback);
    renderPages("companion");
    speak(fallback, { afterEnd: continuousCompanion ? () => setTimeout(startCompanionVoiceInput, 700) : null });
  }
}

function startCompanionVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const input = document.getElementById("companionInput");
  const status = document.getElementById("companionStatus");
  if (!SpeechRecognition || !input) {
    alert("这个浏览器暂时不支持语音识别，可以换 Chrome/Safari，或者先用文字。");
    return;
  }
  if (recognition) recognition.stop();
  recognition = new SpeechRecognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  if (status) status.textContent = "大白在听，说完停一下就会自动回答。";
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    if (status) status.textContent = `听到了：${transcript}`;
    sendCompanionMessage(transcript);
  };
  recognition.onerror = () => {
    if (status) status.textContent = "刚才没听清，可以再点一次开始说话。";
  };
  recognition.onend = () => {
    if (status && !input.value) status.textContent = "点“开始说话”，说完后大白会自动回答。";
  };
  recognition.start();
}

function renderProgress() {
  const count = taskDoneCount();
  const total = requiredTasks().length || 1;
  const percent = Math.min(100, Math.round((count / total) * 100));
  progressNum.textContent = `${percent}%`;
  bar.style.width = `${percent}%`;
  progressText.textContent = count ? `今天完成 ${count}/${total} 项必做练习。` : `${todayLoadProfile().name}：先完成一项就很好。`;
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

async function speak(text, options = {}) {
  text = String(text || "").trim();
  if (!text) return;
  try {
    if (audio) audio.pause();
    const voice = document.getElementById("voiceSel")?.value || "marin";
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice,
        model: "gpt-4o-mini-tts",
        instructions: "像一个熟悉八宝的温暖伙伴在身边说话。语速自然，有轻微停顿和呼吸感，不要播音腔，不要机器人客服感。"
      })
    });
    if (!response.ok) throw new Error("tts failed");
    const blob = await response.blob();
    audio = new Audio(URL.createObjectURL(blob));
    audio.onended = () => options.afterEnd?.();
    await audio.play();
  } catch {
    fallbackSpeak(text, options);
  }
}

function fallbackSpeak(text, options = {}) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
  utterance.pitch = 1.04;
  utterance.onend = () => options.afterEnd?.();
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
  todayTitle.textContent = `${date.getMonth() + 1}月${date.getDate()}日 · 大白训练舱`;
}

document.getElementById("readPage").onclick = () => speak(pageText());
document.getElementById("readMotto").onclick = () => speak(document.getElementById("motto").textContent);
document.getElementById("stopVoice").onclick = () => {
  if (audio) audio.pause();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
};
document.getElementById("exportBtn").onclick = () => downloadJson(`dabai-${TODAY}.json`, state);
window.addEventListener("dabai:state-saved", renderProgress);

initNav();
renderPages("home");
renderProgress();
title();
checkHealth();
