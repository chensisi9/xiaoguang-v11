import type { GeneratedLearningTask } from "../../types/curriculum";

export function SubjectTaskCard({ task }: { task: GeneratedLearningTask }) {
  return (
    <section className="card subjectTaskCard">
      <div className="pill">{task.sourceLessons.join(" + ")}</div>
      <h2>{task.title}</h2>
      <p>{task.why}</p>
      <ol>{task.taskSteps.map((step) => <li key={step}>{step}</li>)}</ol>
      <div>{task.outputRequirement}</div>
      <div>{task.onePointFocus}</div>
    </section>
  );
}
