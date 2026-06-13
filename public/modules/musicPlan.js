export const focusLabels = {
  rhythm: "节奏",
  breathing: "换气",
  intonation: "音准",
  smoothness: "连贯",
  tempo: "速度",
  expression: "表现力",
  sectionConnection: "连接"
};

export const hayaoMiyazakiMedley = {
  id: "hayao-miyazaki-medley",
  title: "宫崎骏组曲",
  currentWorkTitle: "天空之城",
  composerOrSource: "宫崎骏动画音乐练习素材",
  instrument: "harmonica",
  status: "learning",
  weeklyGoal: "把当前段吹稳，不抢拍，换气更自然。",
  currentSectionId: "section-b",
  scoreFiles: [
    {
      id: "score-castle-page-1",
      name: "天空之城口琴谱 第1页",
      type: "score",
      url: "",
      uploadedAt: "2026-06-13",
      localPath: "/Users/chensifan/Downloads/微信图片_20260609164415_4_156.jpg"
    },
    {
      id: "score-castle-page-2",
      name: "天空之城口琴谱 第2页",
      type: "score",
      url: "",
      uploadedAt: "2026-06-13",
      localPath: "/Users/chensifan/Downloads/微信图片_20260609164425_5_156.jpg"
    }
  ],
  backingTracks: [
    {
      id: "backing-castle-bb",
      name: "笨笨口琴 - 天空之城 动漫版 笨笨口琴.mp3",
      type: "backingTrack",
      url: "",
      uploadedAt: "2026-06-13",
      localPath: "/Users/chensifan/Downloads/笨笨口琴 - 天空之城 动漫版 笨笨口琴.mp3"
    }
  ],
  demoTracks: [],
  sections: [
    {
      id: "section-a",
      label: "A段",
      measureRange: "第1-4小节",
      description: "开头旋律，重点是吹稳，不抢拍。",
      difficulty: "easy",
      focusPoints: ["rhythm", "breathing", "smoothness"],
      status: "learning"
    },
    {
      id: "section-b",
      label: "B段",
      measureRange: "第5-8小节",
      description: "旋律开始展开，重点是换气和连贯。",
      difficulty: "normal",
      focusPoints: ["breathing", "smoothness", "tempo"],
      status: "learning"
    },
    {
      id: "section-c",
      label: "C段",
      measureRange: "第9-12小节",
      description: "情绪更完整，重点是音准和表现力。",
      difficulty: "normal",
      focusPoints: ["intonation", "expression", "tempo"],
      status: "notStarted"
    },
    {
      id: "section-bridge",
      label: "连接段",
      measureRange: "第13-16小节",
      description: "把前后乐句接起来，重点是不断气。",
      difficulty: "hard",
      focusPoints: ["sectionConnection", "breathing", "smoothness"],
      status: "notStarted"
    },
    {
      id: "section-full",
      label: "完整跟伴奏",
      description: "跟伴奏吹完整段落，重点是节奏和稳定。",
      difficulty: "hard",
      focusPoints: ["rhythm", "tempo", "expression"],
      status: "notStarted"
    }
  ]
};

function sectionById(piece, sectionId) {
  return piece.sections.find((section) => section.id === sectionId) || piece.sections[0];
}

function currentSection(piece, logs = []) {
  const reviewCounts = logs.reduce((map, log) => {
    if (String(log.nextSuggestion || "").includes("继续") || /急|不准|跟不上|断/.test(log.note || "")) {
      map[log.sectionId] = (map[log.sectionId] || 0) + 1;
    }
    return map;
  }, {});
  const needsReviewId = Object.entries(reviewCounts).find(([, count]) => count >= 2)?.[0];
  if (needsReviewId) return sectionById(piece, needsReviewId);
  const current = sectionById(piece, piece.currentSectionId);
  if (current.status === "stable") {
    const index = piece.sections.findIndex((section) => section.id === current.id);
    return piece.sections[Math.min(piece.sections.length - 1, index + 1)];
  }
  return current;
}

export function generateMusicPracticeTask({ date, energyMode = "normal", weekday, fixedActivitiesToday = [], currentPiece = hayaoMiyazakiMedley, recentPracticeLogs = [] } = {}) {
  const section = currentSection(currentPiece, recentPracticeLogs);
  const hasHarmonicaClass = fixedActivitiesToday.some((item) => String(item).includes("口琴课")) || weekday === 2;
  if (energyMode === "low") {
    return {
      id: `${date}-${currentPiece.id}-${section.id}-low`,
      date,
      pieceId: currentPiece.id,
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
      id: `${date}-${currentPiece.id}-class-review`,
      date,
      pieceId: currentPiece.id,
      sectionId: section.id,
      title: "口琴课后轻复盘",
      why: "周二已经有口琴课，晚上只把老师讲过的点收好。",
      steps: ["今天老师讲了哪一段", "哪个小节最难", "听一遍伴奏或示范", "可以不录音"],
      estimatedMinutes: 8,
      onePointFocus: "smoothness",
      outputRequirement: "说出今天最难的1个小节。",
      recordRequired: false
    };
  }
  if (weekday === 3 || weekday === 4) {
    return {
      id: `${date}-${currentPiece.id}-${section.id}-section`,
      date,
      pieceId: currentPiece.id,
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
  if (weekday === 6) {
    return {
      id: `${date}-${currentPiece.id}-${section.id}-connection`,
      date,
      pieceId: currentPiece.id,
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
  if (weekday === 0) {
    return {
      id: `${date}-${currentPiece.id}-${section.id}-light-review`,
      date,
      pieceId: currentPiece.id,
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
    id: `${date}-${currentPiece.id}-${section.id}-daily`,
    date,
    pieceId: currentPiece.id,
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

const feedbackByFocus = {
  rhythm: { onePoint: "今天只听一个点：节奏不要抢。", suggestion: "下一次先听伴奏，再用慢速吹一遍。", nextTask: "继续练当前段，重点听节奏。" },
  breathing: { onePoint: "今天只改一个点：换气提前一点，不要憋到最后。", suggestion: "在乐句结束前做一次小换气。", nextTask: "下次继续当前段，重点是换气。" },
  intonation: { onePoint: "今天只听一个点：有一个音要更稳。", suggestion: "把不稳的音单独慢吹3次。", nextTask: "继续当前段，重点是音准。" },
  smoothness: { onePoint: "今天只改一个点：两个音之间接得再顺一点。", suggestion: "慢速吹，不急着跟伴奏。", nextTask: "继续当前段，重点是连贯。" },
  tempo: { onePoint: "今天只改一个点：速度先稳，不要忽快忽慢。", suggestion: "先慢速，再跟伴奏。", nextTask: "继续当前段，重点是速度稳定。" },
  expression: { onePoint: "今天只听一个点：句尾轻一点，会更像音乐。", suggestion: "把最后一个长音吹轻一点。", nextTask: "下次听一遍自己的录音，找一个好听的地方。" },
  sectionConnection: { onePoint: "今天只改一个点：连接处不要断气。", suggestion: "连接前提前吸一小口气。", nextTask: "继续练两段连接。" }
};

export function generateMusicOnePointFeedback({ onePointFocus, userNote = "", recordingFile = null } = {}) {
  const preset = feedbackByFocus[onePointFocus] || feedbackByFocus.smoothness;
  const praise = /顺|稳|进步/.test(userNote)
    ? "这段旋律已经比上次更顺了。"
    : recordingFile
      ? "你已经把这一段录下来了。"
      : "你已经完成了今天的口琴小局。";
  return { praise, ...preset };
}

export function musicSectionLabel(piece, sectionId) {
  const section = sectionById(piece, sectionId);
  return `${section.label}${section.measureRange ? ` · ${section.measureRange}` : ""}`;
}
