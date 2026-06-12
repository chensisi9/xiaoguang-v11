import { importedPdfResources } from "../../content/resources";
import { allCurriculumLessons } from "../../lib/curriculum/allLessons";

export default function ContentLibraryPage() {
  return (
    <main>
      <h1>教材结构库</h1>
      <p>给家长确认 PDF 是否已经转成 DABAI 可调用的结构化信息。</p>
      <section>
        <h2>已导入 PDF</h2>
        <ul>{importedPdfResources.map((item) => <li key={item.id}>{item.fileName} · {item.status}</li>)}</ul>
      </section>
      <section>
        <h2>课程结构</h2>
        {allCurriculumLessons.map((lesson) => (
          <article key={lesson.id}>
            <h3>{lesson.bookName} · {lesson.unit}</h3>
            <p>{lesson.lessonTitle} · {lesson.theme}</p>
            <p>{lesson.knowledgePoints.join("、")}</p>
            <p>{lesson.commonTaskTypes.join("、")}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
