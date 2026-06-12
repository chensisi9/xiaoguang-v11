import { generateDailyLearningTask } from "../../lib/generators/generateDailyLearningTask";
import type { EnergyMode, Subject } from "../../types/curriculum";
import { SubjectTaskCard } from "./SubjectTaskCard";

export function LearningRoom({
  date,
  subject = "math",
  energyMode = "normal"
}: {
  date: string;
  subject?: Subject | "mixed";
  energyMode?: EnergyMode;
}) {
  const task = generateDailyLearningTask({
    date,
    subject,
    energyMode,
    interestTag: subject === "englishSchool" ? "world" : "tennis"
  });
  return (
    <main>
      <section className="card">
        <div className="pill">📚 学习小局</div>
        <h1>今天大白选了一个小点</h1>
        <p>先选学科，再完成一件小事。</p>
      </section>
      <SubjectTaskCard task={task} />
    </main>
  );
}
