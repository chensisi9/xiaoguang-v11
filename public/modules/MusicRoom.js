import { focusLabels, generateMusicOnePointFeedback, generateMusicPracticeTask, hayaoMiyazakiMedley, musicSectionLabel } from "./musicPlan.js?v=20260613-music-room-1";

function fileList(files, emptyText, escapeHtml) {
  if (!files.length) return `<div class="history">${escapeHtml(emptyText)}</div>`;
  return files.map((file) => `<div class="history"><b>${escapeHtml(file.name)}</b><br><span class="tiny">${escapeHtml(file.type)} · ${escapeHtml(file.uploadedAt || "")}</span>${file.url ? `<br><button class="secondary" data-play-music-file="${escapeHtml(file.id)}">播放/打开</button>` : `<br><span class="tiny">已登记文件名。上传到本页面后可播放。</span>`}</div>`).join("");
}

function allFiles(piece, state) {
  const uploaded = state.musicFiles || [];
  return {
    scores: [...(piece.scoreFiles || []), ...uploaded.filter((file) => file.type === "score")],
    backing: [...(piece.backingTracks || []), ...uploaded.filter((file) => file.type === "backingTrack")],
    demos: [...(piece.demoTracks || []), ...uploaded.filter((file) => file.type === "demo")],
    recordings: uploaded.filter((file) => file.type === "recording")
  };
}

export function renderMusicRoom({ state, today, weekday, energyMode, fixedActivitiesToday = [], escapeHtml }) {
  const piece = { ...hayaoMiyazakiMedley, ...(state.currentMusicPiece || {}) };
  const logs = state.musicPracticeLogs || [];
  const task = generateMusicPracticeTask({ date: today, energyMode, weekday, fixedActivitiesToday, currentPiece: piece, recentPracticeLogs: logs });
  const section = piece.sections.find((item) => item.id === task.sectionId) || piece.sections[0];
  const files = allFiles(piece, state);
  const feedback = state.musicFeedback?.[task.id];
  const savedNote = state.musicDraft?.[task.id]?.note || "";
  const savedMinutes = state.musicDraft?.[task.id]?.minutes || task.estimatedMinutes;
  const savedFeeling = state.musicDraft?.[task.id]?.feeling || "";
  return `<section class="card modulePanel musicRoom">
    <div class="sectionTitle">
      <div><div class="pill">🎵 音乐舱</div><h2>当前曲目：${escapeHtml(piece.title)}</h2></div>
      <div class="status">${escapeHtml(piece.currentWorkTitle || "口琴")}</div>
    </div>
    <p>当前段落：${escapeHtml(musicSectionLabel(piece, task.sectionId))}</p>
    <div class="note green"><b>本周目标</b><br>${escapeHtml(piece.weeklyGoal)}</div>
    <div class="task card">
      <div class="taskTop"><div class="icon">🎵</div><div class="pill">${escapeHtml(section.label)} · ${escapeHtml(focusLabels[task.onePointFocus] || task.onePointFocus)}</div></div>
      <h2>${escapeHtml(task.title)}</h2>
      <div class="note blue"><b>为什么练这个</b><br>${escapeHtml(task.why)}</div>
      <div class="history"><b>步骤</b><ol>${task.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></div>
      <div class="note blue"><b>预计</b><br>${task.estimatedMinutes}分钟</div>
      <div class="note blue"><b>大白只听一个点</b><br>${escapeHtml(focusLabels[task.onePointFocus] || task.onePointFocus)}</div>
      <div class="row">
        <button class="secondary" data-toggle-score>查看曲谱</button>
        <button class="secondary" data-play-kind="backingTrack">播放伴奏</button>
        <button class="secondary" data-play-kind="demo">播放示范</button>
        <button class="secondary" data-speak-music-task>开始练习</button>
      </div>
      <details class="optionalBlock" id="scorePanel">
        <summary>曲谱和音频文件</summary>
        <div class="grid2">
          <div><h3>曲谱</h3>${fileList(files.scores, "还没有上传曲谱。", escapeHtml)}<label>添加曲谱 PDF / 图片</label><input type="file" data-music-upload="score" accept="image/*,.pdf"></div>
          <div><h3>伴奏</h3>${fileList(files.backing, "还没有上传伴奏。", escapeHtml)}<label>添加伴奏音频</label><input type="file" data-music-upload="backingTrack" accept="audio/*"></div>
          <div><h3>老师示范</h3>${fileList(files.demos, "还没有上传老师示范。", escapeHtml)}<label>添加老师示范</label><input type="file" data-music-upload="demo" accept="audio/*"></div>
          <div><h3>我的练习录音</h3>${fileList(files.recordings, "还没有上传练习录音。", escapeHtml)}<label>上传/录制后的练习</label><input type="file" data-music-upload="recording" accept="audio/*"></div>
        </div>
      </details>
      <label for="musicFeeling">今天自己听到的一个点</label>
      <select id="musicFeeling">
        ${["节奏稳了", "换气急了", "有一个音不准", "跟不上伴奏", "比上次顺了"].map((item) => `<option value="${escapeHtml(item)}" ${savedFeeling === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
      </select>
      <div class="miniGrid">
        <div><label for="musicMinutes">练了几分钟</label><input id="musicMinutes" type="number" min="1" max="40" value="${escapeHtml(savedMinutes)}"></div>
        <div><label for="musicNote">今天记录</label><div class="fieldWithVoice"><textarea id="musicNote" placeholder="例如：B段第5-8小节，换气有点急。">${escapeHtml(savedNote)}</textarea><button type="button" class="voiceMini" data-voice-target="musicNote" title="语音输入">🎙 说</button></div></div>
      </div>
      ${feedback ? `<div class="note green"><b>${escapeHtml(feedback.praise)}</b><br>${escapeHtml(feedback.onePoint)}<br>${escapeHtml(feedback.suggestion)}</div>` : ""}
      <button class="primary" data-music-complete="${escapeHtml(task.id)}">完成今天小局</button>
    </div>
    <details class="optionalBlock">
      <summary>音乐成长记录</summary>
      ${(state.musicPracticeLogs || []).slice(0, 10).map((log) => `<div class="history"><b>${escapeHtml(log.date)} · ${escapeHtml(piece.title)} ${escapeHtml(musicSectionLabel(piece, log.sectionId))}</b><br>练习：${escapeHtml(log.practicedMinutes)}分钟<br>完成：${log.completedSteps.map(escapeHtml).join(" + ")}<br>大白记录：${escapeHtml(log.nextSuggestion)}</div>`).join("") || `<div class="history">完成一次口琴小局后，这里会出现记录。</div>`}
    </details>
  </section>`;
}

export function createMusicFileMeta(file, type) {
  return {
    id: `music-${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: file.name,
    type,
    url: URL.createObjectURL(file),
    uploadedAt: new Date().toISOString().slice(0, 10)
  };
}

export function buildMusicPracticeLog({ task, piece, note, feeling, minutes, recordingFile }) {
  const feedback = generateMusicOnePointFeedback({ onePointFocus: task.onePointFocus, userNote: `${feeling} ${note}`, recordingFile });
  return {
    id: crypto.randomUUID(),
    date: task.date,
    pieceId: piece.id,
    sectionId: task.sectionId,
    practicedMinutes: Number(minutes) || task.estimatedMinutes,
    completedSteps: task.steps,
    recordingFile,
    onePointFocus: task.onePointFocus,
    note: `${feeling}${note ? `；${note}` : ""}`,
    nextSuggestion: feedback.nextTask,
    feedback
  };
}
