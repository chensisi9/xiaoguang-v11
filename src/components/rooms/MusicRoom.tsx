import { hayaoMiyazakiMedley } from "../../content/music/hayaoMiyazakiMedley";
import { generateMusicPracticeTask } from "../../lib/generators/generateMusicPracticeTask";
import type { EnergyMode } from "../../types/curriculum";
import type { MusicPracticeLog } from "../../types/music";

export function MusicRoom({
  date,
  weekday,
  energyMode = "normal",
  recentPracticeLogs = []
}: {
  date: string;
  weekday: number;
  energyMode?: EnergyMode;
  recentPracticeLogs?: MusicPracticeLog[];
}) {
  const task = generateMusicPracticeTask({
    date,
    weekday,
    energyMode,
    fixedActivitiesToday: [],
    currentPiece: hayaoMiyazakiMedley,
    recentPracticeLogs
  });
  const section = hayaoMiyazakiMedley.sections.find((item) => item.id === task.sectionId);
  return (
    <section className="card musicRoom">
      <div className="pill">🎵 音乐舱</div>
      <h2>当前曲目：{hayaoMiyazakiMedley.title}</h2>
      <p>当前段落：{section?.label} {section?.measureRange}</p>
      <p>{hayaoMiyazakiMedley.weeklyGoal}</p>
      <article>
        <h3>{task.title}</h3>
        <p>{task.why}</p>
        <ol>{task.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p>大白只听一个点：{task.onePointFocus}</p>
      </article>
    </section>
  );
}
