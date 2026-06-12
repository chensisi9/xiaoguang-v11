export const phonicsPlan = {
  id: "phonics",
  icon: "🔤",
  title: "自然拼读补洞",
  cadence: "每次10分钟",
  purpose: ["看词能读", "听音能拼", "提升拼写", "降低背单词痛苦"],
  units: [
    { id: "short-vowels", title: "short vowels", task: "读 cat, pen, sit, hop, cup；听音写1个词。", output: "说：I can read ___." },
    { id: "long-vowels", title: "long vowels", task: "比较 cap/cape, bit/bite；圈长元音。", output: "说：The long sound is ___." },
    { id: "magic-e", title: "magic e", task: "找 magic e 怎么改变前面的元音。", output: "说：Magic e changes ___." },
    { id: "blends", title: "blends", task: "读 bl, cl, br, st, tr 开头的词。", output: "说3个 blends 词。" },
    { id: "digraphs", title: "digraphs", task: "读 sh, ch, th, wh；听音选1组。", output: "说：I hear ___." },
    { id: "vowel-teams", title: "vowel teams", task: "读 ai, ee, oa, ay；每组1个词。", output: "说：The team is ___." },
    { id: "r-controlled", title: "r-controlled vowels", task: "读 ar, er, ir, or, ur；听音分类。", output: "说：The r sound is ___." },
    { id: "suffixes", title: "suffixes", task: "看 -s, -ed, -ing 怎么接在词尾。", output: "说：I add ___ to ___." },
    { id: "syllable-division", title: "syllable division", task: "把 longer words 拆成两拍读。", output: "说：This word has ___ beats." }
  ]
};
