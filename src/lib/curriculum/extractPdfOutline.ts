import type { LessonContent, Subject } from "../../types/curriculum";

export type PdfOutlineInput = {
  bookName: string;
  subject: Subject;
  grade?: string;
  term?: string;
  sourcePdf: string;
};

export type PdfOutlineDraft = {
  bookName: string;
  subject: Subject;
  grade?: string;
  term?: string;
  sourcePdf: string;
  lessons: Partial<LessonContent>[];
  note: string;
};

export function extractPdfOutline(input: PdfOutlineInput): PdfOutlineDraft {
  return {
    ...input,
    lessons: [],
    note: "当前原型先使用人工/半自动结构化：只提取目录、单元、主题、知识点、能力目标和反馈规则，不展示整页PDF或大段教材原文。"
  };
}
