import type { MusicPiece } from "../../types/music";

export const hayaoMiyazakiMedley: MusicPiece = {
  id: "hayao-miyazaki-medley",
  title: "宫崎骏组曲",
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
      uploadedAt: "2026-06-13"
    },
    {
      id: "score-castle-page-2",
      name: "天空之城口琴谱 第2页",
      type: "score",
      url: "",
      uploadedAt: "2026-06-13"
    }
  ],
  backingTracks: [
    {
      id: "backing-castle-bb",
      name: "笨笨口琴 - 天空之城 动漫版 笨笨口琴.mp3",
      type: "backingTrack",
      url: "",
      uploadedAt: "2026-06-13"
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
