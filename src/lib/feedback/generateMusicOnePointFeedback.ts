import type { MusicFile, MusicFocusPoint, MusicPracticeLog } from "../../types/music";

const focusText: Record<MusicFocusPoint, { onePoint: string; suggestion: string; nextTask: string }> = {
  rhythm: { onePoint: "今天只听一个点：节奏不要抢。", suggestion: "下一次先听伴奏，再用慢速吹一遍。", nextTask: "继续练当前段，重点听节奏。" },
  breathing: { onePoint: "今天只改一个点：换气提前一点，不要憋到最后。", suggestion: "在乐句结束前做一次小换气。", nextTask: "下次继续当前段，重点是换气。" },
  intonation: { onePoint: "今天只听一个点：有一个音要更稳。", suggestion: "把不稳的音单独慢吹3次。", nextTask: "继续当前段，重点是音准。" },
  smoothness: { onePoint: "今天只改一个点：两个音之间接得再顺一点。", suggestion: "慢速吹，不急着跟伴奏。", nextTask: "继续当前段，重点是连贯。" },
  tempo: { onePoint: "今天只改一个点：速度先稳，不要忽快忽慢。", suggestion: "先慢速，再跟伴奏。", nextTask: "继续当前段，重点是速度稳定。" },
  expression: { onePoint: "今天只听一个点：句尾轻一点，会更像音乐。", suggestion: "把最后一个长音吹轻一点。", nextTask: "下次听一遍自己的录音，找一个好听的地方。" },
  sectionConnection: { onePoint: "今天只改一个点：连接处不要断气。", suggestion: "连接前提前吸一小口气。", nextTask: "继续练两段连接。" }
};

export function generateMusicOnePointFeedback({
  practiceLog,
  onePointFocus,
  userNote,
  recordingFile
}: {
  practiceLog?: Partial<MusicPracticeLog>;
  onePointFocus: MusicFocusPoint;
  userNote?: string;
  recordingFile?: MusicFile;
}) {
  const preset = focusText[onePointFocus] || focusText.smoothness;
  const note = userNote || practiceLog?.note || "";
  const praise = note.includes("顺") || note.includes("稳")
    ? "这段旋律已经比上次更顺了。"
    : recordingFile
      ? "你已经把这一段录下来了。"
      : "你已经完成了今天的口琴小局。";
  return {
    praise,
    onePoint: preset.onePoint,
    suggestion: preset.suggestion,
    nextTask: preset.nextTask
  };
}
