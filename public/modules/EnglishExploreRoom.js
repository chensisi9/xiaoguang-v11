import { englishProfile, getDailyEnglishTask, getEnglishLearningMap, weeklyEnglishPlan } from "./englishPlan.js?v=20260612-english-route-1";

function list(items, escapeHtml) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function resourceCard(resource, escapeHtml) {
  const purpose = resource.purpose || resource.materials || resource.templates || resource.skills?.map((skill) => skill.title) || resource.chunks || [];
  const flow = resource.flow || resource.units?.map(([title]) => title) || [];
  return `<div class="history">
    <b>${resource.icon || "•"} ${escapeHtml(resource.title)}</b><br>
    <span class="tiny">${escapeHtml(resource.cadence || resource.task || resource.principle || "")}</span>
    ${purpose.length ? `<div class="tiny">作用：${purpose.map(escapeHtml).join("、")}</div>` : ""}
    ${flow.length ? `<div class="tiny">路线：${flow.map(escapeHtml).join(" → ")}</div>` : ""}
  </div>`;
}

export function renderEnglishExploreRoom({ state, today, energyMode, renderEnglishProgress, escapeHtml }) {
  const english = state.englishExplore || {};
  const task = getDailyEnglishTask({ date: today, energyMode });
  const savedToday = english.date === today;
  const output = savedToday ? english.lastTask || "" : "";
  const reflection = savedToday ? english.reflection || "" : "";
  const feedback = savedToday ? english.onePointFeedback || "" : "";
  const map = getEnglishLearningMap();
  const planRows = Object.entries(weeklyEnglishPlan)
    .map(([day, plan]) => `<span>${escapeHtml(day)} · ${escapeHtml(plan)}</span>`)
    .join("");
  return `<section class="card modulePanel englishRoom">
    <div class="pill">🌍 英语探索舱</div>
    <h2>${escapeHtml(task.taskTitle)}</h2>
    <p>英语不是作业，是通向世界的工具。</p>
    ${renderEnglishProgress()}
    <div class="task card englishTodayTask">
      <div class="taskTop"><div class="icon">🌍</div><div class="pill">${escapeHtml(task.recommendedModule)} · ${escapeHtml(task.energyMode)}</div></div>
      <h2>${escapeHtml(task.subtitle)}</h2>
      <div class="history"><b>今天路线</b><ol>${list(task.steps, escapeHtml)}</ol></div>
      <div class="note blue"><b>输出要求</b><br>${escapeHtml(task.outputRequirement)}<br><span class="tiny">本周思维动作：${escapeHtml(task.thinkingSkill.title)} · ${escapeHtml(task.thinkingSkill.sentence)}</span></div>
      <label for="englishExploreInput">八宝的英语输出</label>
      <div class="fieldWithVoice">
        <textarea id="englishExploreInput" placeholder="${escapeHtml(task.outputPlaceholder)}">${escapeHtml(output)}</textarea>
        <button type="button" class="voiceMini" data-voice-target="englishExploreInput" title="语音输入">🎙 说</button>
      </div>
      <label for="englishExploreReflection">今天只留下一个点</label>
      <div class="fieldWithVoice">
        <textarea id="englishExploreReflection" placeholder="可以直接说：关键词是 tennis；我卡在 because；今天想记 I heard ___.">${escapeHtml(reflection)}</textarea>
        <button type="button" class="voiceMini" data-voice-target="englishExploreReflection" title="语音输入">🎙 说</button>
      </div>
      ${feedback ? `<div class="note green"><b>大白只改一个点</b><br>${escapeHtml(feedback)}</div>` : `<div class="note blue"><b>大白只改一个点</b><br>${escapeHtml(task.onePointFeedback)}<br>你可以这样说：I heard tennis.</div>`}
      <button class="primary" data-english-complete>完成英语回合</button>
    </div>
    <details class="optionalBlock">
      <summary>学习地图</summary>
      <div class="note green"><b>八宝英语画像</b><br>${escapeHtml(englishProfile.level)} · 优势：${englishProfile.strengths.map(escapeHtml).join("、")} · 补洞：${englishProfile.weaknesses.map(escapeHtml).join("、")}</div>
      <div class="countryRail englishWeekRail">${planRows}</div>
      ${map.map((resource) => resourceCard(resource, escapeHtml)).join("")}
    </details>
  </section>`;
}
