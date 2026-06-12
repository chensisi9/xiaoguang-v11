import { phonicsPlan } from "./phonicsPlan";
import { longmanPlan } from "./longmanPlan";
import { razPlan } from "./razPlan";
import { harryPotterPlan } from "./harryPotterPlan";
import { thinkingSkills } from "./thinkingSkills";
import { writingTemplates } from "./writingTemplates";
import { speakingTemplates } from "./speakingTemplates";
import { phraseChunks } from "./phraseChunks";

export const englishProfile = {
  level: "听读强、口语积极、写作和拼写补洞期",
  phonicsGaps: ["short vowels", "long vowels", "magic e", "blends", "digraphs", "vowel teams", "r-controlled vowels", "suffixes", "syllable division"],
  currentRazLevel: "待爸爸填写",
  currentLongmanUnit: "朗文新思维当前单元",
  currentHpChapter: "Harry Potter当前章节",
  weeklyThinkingSkill: "Why",
  strengths: ["listening", "speaking"],
  weaknesses: ["spelling", "writing", "recitation"]
};

export const englishResources = {
  phonics: phonicsPlan,
  longman: longmanPlan,
  raz: razPlan,
  harryPotter: harryPotterPlan,
  listening: {
    id: "listening",
    icon: "🎧",
    title: "听力输入",
    materials: ["RAZ音频", "Harry Potter有声片段", "英文动画", "TED-Ed", "National Geographic Kids", "运动英语视频"],
    task: "听懂大意，说出1个关键词，再说一句 I heard ___."
  },
  speaking: { id: "speaking", icon: "🎙️", title: "口语表达", templates: speakingTemplates },
  writing: { id: "writing", icon: "✍️", title: "写作小局", templates: writingTemplates },
  thinking: { id: "thinking", icon: "🧠", title: "思维训练", skills: thinkingSkills },
  chunks: { id: "chunks", icon: "🧩", title: "词块背诵", ...phraseChunks }
};

export const weeklyEnglishPlan = {
  monday: "Longman",
  tuesday: "Phonics + RAZ",
  wednesday: "Sports English",
  thursday: "Longman + Writing",
  friday: "Listening + Speaking",
  saturday: "Harry Potter Project",
  sunday: "Review"
};

export const dailyEnglishTask = {
  date: "",
  energyMode: "normal",
  recommendedModule: "Listening + Speaking",
  taskTitle: "今日英语小回合",
  steps: ["自然拼读10分钟", "RAZ/朗文15分钟", "说写5分钟"],
  outputRequirement: "留下1句口头英语 + 3句书面输出。",
  onePointFeedback: "今天只改一个点：because 后面只接一个清楚理由。"
};
