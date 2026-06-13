import { allLessons } from "./curriculumData.js?v=20260613-voice-reward-1";
import { generateDailyLearningTask } from "./curriculumEngine.js?v=20260613-voice-reward-1";

const subjectOptions = [
  ["math", "数学"],
  ["chinese", "语文"],
  ["englishSchool", "英语"],
  ["mixed", "混合小局"]
];

export function renderLearningRoom({ state, today, energyMode, escapeHtml }) {
  const subject = state.learningSubject || "math";
  const task = generateDailyLearningTask({
    date: today,
    subject,
    energyMode,
    interestTag: subject === "englishSchool" ? "world" : "tennis",
    recentMasteryLog: state.masteryLog || []
  });
  const output = state.learningOutput?.[task.id] || "";
  const feedback = state.learningFeedback?.[task.id];
  return `<section class="card modulePanel learningRoom">
    <div class="sectionTitle">
      <div><div class="pill">📚 学习小局</div><h2>今天大白选了一个小点</h2></div>
      <div class="status">${escapeHtml(task.estimatedMinutes)}分钟</div>
    </div>
    <div class="choiceGrid subjectChoiceGrid">
      ${subjectOptions.map(([id, label]) => `<button class="choice ${subject === id ? "active" : ""}" data-learning-subject="${id}"><b>${escapeHtml(label)}</b></button>`).join("")}
    </div>
    <div class="task card subjectTaskCard">
      <div class="taskTop"><div class="icon">📚</div><div class="pill">${escapeHtml(task.sourceTitle || task.sourceLessons[0])}</div></div>
      <h2>${escapeHtml(task.title)}</h2>
      <p class="oneSentence">${escapeHtml(task.lessonTitle || "教材能力小局")}</p>
      <div class="note green"><b>为什么练这个</b><br>${escapeHtml(task.why)}</div>
      <div class="history"><b>今天只做一件事</b><ol>${task.taskSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></div>
      <div class="note blue"><b>输出</b><br>${escapeHtml(task.outputRequirement)}</div>
      <div class="note blue"><b>大白只改一个点</b><br>${escapeHtml(task.onePointFocus)}</div>
      <label for="learningOutput">八宝输出</label>
      <div class="fieldWithVoice">
        <textarea id="learningOutput" data-learning-output="${escapeHtml(task.id)}" placeholder="${escapeHtml(outputPlaceholder(task.subject))}">${escapeHtml(output)}</textarea>
        <button type="button" class="voiceMini" data-voice-target="learningOutput" title="语音输入">🎙 说</button>
      </div>
      ${feedback ? `<div class="note green"><b>${escapeHtml(feedback.praise)}</b><br>${escapeHtml(feedback.onePoint)}${feedback.example ? `<br><span class="tiny">例：${escapeHtml(feedback.example)}</span>` : ""}<br>${escapeHtml(feedback.retryPrompt)}</div>` : ""}
      <button class="primary" data-learning-complete="${escapeHtml(task.id)}">完成学习小局</button>
    </div>
  </section>`;
}

function outputPlaceholder(subject) {
  if (subject === "math") return "请完整说：题目要求___；我的算式是___；答案是___；我这样做是因为___。";
  if (subject === "chinese") return "可以直接说：这一段写了___，我仿写一句___。";
  if (subject === "englishSchool" || subject === "longman") return "可以直接说：I usually play tennis on Friday.";
  return "可以直接说：我今天讲清楚了一个小点。";
}

export function renderContentLibrary({ state, escapeHtml }) {
  const grouped = allLessons().reduce((map, lesson) => {
    map[lesson.subject] = map[lesson.subject] || [];
    map[lesson.subject].push(lesson);
    return map;
  }, {});
  const mastery = state.masteryLog || [];
  return `<div class="card">
    <div class="taskTop"><div class="pill">家长后台</div><div class="tiny">教材结构库</div></div>
    <h2>已导入 PDF 教材</h2>
    <p>这里只显示结构化信息：单元、主题、知识点、能力目标、题型、反馈规则。不给孩子展示整页 PDF。</p>
    ${Object.entries(grouped).map(([subject, lessons]) => `<details class="optionalBlock" open>
      <summary>${escapeHtml(subject)} · ${lessons.length}课</summary>
      ${lessons.map((lesson) => `<div class="history">
        <b>${escapeHtml(lesson.bookName)} · ${escapeHtml(lesson.unit)}</b><br>
        ${escapeHtml(lesson.lessonTitle)}<br>
        <span class="tiny">主题：${escapeHtml(lesson.theme)}</span><br>
        <span class="tiny">知识点：${lesson.knowledgePoints.map(escapeHtml).join("、")}</span><br>
        <span class="tiny">能力：${Object.values(lesson.abilityGoals).map(escapeHtml).join("；")}</span><br>
        <span class="tiny">反馈规则：${lesson.onePointFeedbackRules.map((rule) => escapeHtml(rule.target)).join("、")}</span>
      </div>`).join("")}
    </details>`).join("")}
    <details class="optionalBlock">
      <summary>最近八宝掌握情况</summary>
      ${mastery.slice(0, 20).map((item) => `<div class="history"><b>${escapeHtml(item.date)} · ${escapeHtml(item.taskTitle)}</b><br>${escapeHtml(item.masteryTag)} · 下次复习：${escapeHtml(item.nextReviewDate)}<br>${escapeHtml(item.onePointFocus)}</div>`).join("") || `<div class="history">还没有教材小局记录。</div>`}
    </details>
  </div>`;
}
