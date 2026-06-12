export type UserProfile = {
  name?: string;
  age?: number;
  goals?: string[];
  interests?: string[];
  preferences?: string[];
};

export type DailyDabaiLine = {
  greeting: string;
  memory: string;
  encouragement: string;
  action: string;
  fullLine: string;
};

export type RoomPhrase = {
  memory: string;
  encouragement: string;
  action: string;
  fullLine: string;
};

export type DabaiPhraseBank = {
  greetingPhrases: string[];
  memoryPhrases: string[];
  encouragementPhrases: string[];
  actionPhrases: string[];
};

const poeticGreetingPairs: Array<[string, string]> = [
  ["春眠不觉晓", "八宝，今天慢慢启动"],
  ["海日生残夜", "新的一天，大白上线"],
  ["会当凌绝顶", "今天不用登顶，先迈一步"],
  ["长风破浪会有时", "今天先把小船推下水"],
  ["欲穷千里目", "先把眼前这一步看清楚"],
  ["天生我材必有用", "今天也有你的用武之地"],
  ["山重水复疑无路", "卡住也没关系，大白陪你找路"],
  ["竹杖芒鞋轻胜马", "今天轻装上阵"],
  ["小荷才露尖尖角", "冒出一点点就很好"],
  ["明月松间照", "先让心里亮一点"],
  ["清泉石上流", "今天慢慢流动"],
  ["行到水穷处", "换个角度看看"],
  ["坐看云起时", "先不急着用力"],
  ["星垂平野阔", "大白陪你看远一点"],
  ["大漠孤烟直", "今天走一条清楚的线"],
  ["月涌大江流", "一点点也会往前"],
  ["野旷天低树", "先把眼前的路看清"],
  ["江清月近人", "今天靠近自己一点"],
  ["白日依山尽", "收好昨天，打开今天"],
  ["黄河入海流", "小步也会到远方"],
  ["青山遮不住", "路还在，大白也在"],
  ["毕竟东流去", "今天让它自然前进"],
  ["潮平两岸阔", "现在适合开船"],
  ["风正一帆悬", "先选一个方向"],
  ["山随平野尽", "远方会慢慢展开"],
  ["江入大荒流", "今天去看更大的世界"],
  ["云破月来花弄影", "有光了，我们开始"],
  ["一蓑烟雨任平生", "今天稳一点就好"],
  ["疏影横斜水清浅", "先看清一个小点"],
  ["暗香浮动月黄昏", "安静开始也很好"],
  ["等闲识得东风面", "今天有一点新风"],
  ["万紫千红总是春", "每个入口都可以开始"],
  ["九万里风鹏正举", "今天先展开一点翅膀"],
  ["少年心事当拿云", "先拿眼前这一格"],
  ["天街小雨润如酥", "轻轻启动也算数"],
  ["草色遥看近却无", "先靠近一点看"],
  ["千里莺啼绿映红", "今天基地灯亮了"],
  ["沾衣欲湿杏花雨", "温柔一点也能开始"],
  ["吹面不寒杨柳风", "今天的风不重"],
  ["明月出天山", "大白陪你开舱"]
];

export const greetingPhrases: string[] = poeticGreetingPairs.flatMap(([line, note]) => [
  `${line}。${note}。`,
  `${line}。八宝，${note.replace(/^今天/, "今天也")}。`
]);

export const sportsMemory: string[] = [
  "网球场上的你，和书桌前的你，是同一个正在变强的你。",
  "球拍会记住练过的动作，大脑也会。",
  "身体动起来以后，思路常常会亮一点。",
  "有网球训练的日子，身体已经在路上。",
  "挥拍不需要很狠，一个动作准一点就够。",
  "运动不是选修项，它是成长主线。",
  "学习体育双不误，这句话大白收好了。",
  "户外的风，会帮身体重新开机。",
  "球场给你的耐心，书桌也用得上。",
  "身体舒服一点，学习也会轻一点。",
  "你的反应力，来自一次次小练习。",
  "不舒服时休息，也是照顾身体的本领。",
  "眼睛看远处，脑子也会松一点。",
  "如果已经安排了训练，就不再叠加。",
  "真正的身体成长，常常从轻松活动开始。"
];

export const englishMemory: string[] = [
  "英语不是作业，它是你以后打开世界的一把钥匙。",
  "未来想去更大的世界，今天先说一句就够。",
  "一句完整英语，就是向远方靠近一点。",
  "你可以先用中文想，再慢慢变成英文。",
  "开口比完美更重要。",
  "世界地图不是挂在墙上，它也可以在嘴里展开。",
  "英语探索舱不考试，只带你出发。",
  "你喜欢远方，大白会把英语变成路。",
  "今天一个词说清楚，也算上路。",
  "英文句子短一点，也可以很有力量。",
  "你以后会遇见更大的世界，现在先练一扇门。",
  "英语主线不用很重，但每天可以亮一点。",
  "敢说第一句，后面的句子才会来。",
  "把网球、学校和今天的心情说成英文，就很好。",
  "远方不是一下到达的，是一句一句靠近的。"
];

export const learningMemory: string[] = [
  "你讲清楚一道题，比糊涂刷十道更重要。",
  "数学适合你当小教练，先把思路说出来。",
  "语文可以先说，再慢慢写下来。",
  "你喜欢自己发现答案，大白会留一点空间。",
  "一个错因，是下一步的地图。",
  "今天学习小局只抓一个点。",
  "你不是不懂，只是有时需要换个入口。",
  "题目变小以后，就容易靠近。",
  "会解释，说明你真的在掌控。",
  "学习不是堆很多，是看清一点。",
  "先把题读慢，很多陷阱会自己露出来。",
  "你适合用讲清楚来变强。",
  "大白不急着给答案，先听你的思路。",
  "今天做少一点，也可以做准一点。",
  "你的脑子喜欢策略，我们就用策略开局。"
];

export const emotionMemory: string[] = [
  "你不是不想成长，只是不喜欢被催着长大。",
  "有时不想启动，也可以从低电量模式开始。",
  "大白会先听你说完，再给下一步。",
  "状态不满格，也可以选择一个轻入口。",
  "不想学的时候，先说一句也算开门。",
  "你有自己的想法，大白会把它当回事。",
  "今天如果心里有点堵，我们先让事情变小。",
  "不需要马上证明什么。",
  "大白在这里，不催，也不比较。",
  "你可以把烦说出来，不用先整理好。",
  "真正的开始，可以很小声。",
  "低电量不是问题，只是换一种走法。",
  "今天先保护一点启动感。",
  "你不需要被推着走，可以自己选门。",
  "大白会在旁边，不抢你的方向盘。"
];

export const fatherSonMemory: string[] = [
  "你和爸爸说过，学习体育双不误。",
  "爸爸看重你的成长，大白帮你把路变轻一点。",
  "家里的期待可以很大，今天的动作可以很小。",
  "学习和身体都在长，这件事大白记着。",
  "你和爸爸的共识，不是压力，是方向。",
  "网球课和学习小局，可以在同一天安静共存。",
  "今天身体动过了，学习就做精一点。",
  "如果当天课外班很满，就把任务变轻。",
  "成长不是只看书桌，也看球场和路上。",
  "爸爸想看见的是你慢慢长本领。",
  "大白会帮你把大目标拆小。",
  "今天不用把所有期待一次做完。",
  "一个稳定节奏，比一阵猛冲更适合你。",
  "身体、表达和学习，都是同一条成长线。",
  "大白收好这句：学习体育双不误。"
];

export const worldMemory: string[] = [
  "你喜欢地图和远方，今天就从一个小入口出发。",
  "世界很大，入口可以很小。",
  "探索不是跑很远，是多看懂一点。",
  "一张地图，一句英语，一次好奇心，都算出发。",
  "未来的远方，不是一口气跑到的。",
  "你喜欢酷一点的东西，大白把基地灯打开。",
  "科技感不是装饰，是让选择更清楚。",
  "今天的基地有五扇门。",
  "远方在等你，但不用急着到。",
  "每次开口，地图上就亮一个点。",
  "你的好奇心，是很好的发动机。",
  "想去世界，就先认识今天的一句话。",
  "大白会把远方变成可以练的小步骤。",
  "世界不只在书里，也在你说出的句子里。",
  "今天先向远方打个招呼。"
];

export const musicMemory: string[] = [
  "口琴需要慢一点，像风穿过小孔。",
  "音乐舱不比快，只听一个小节变清楚。",
  "吹准一小段，比急着吹完更好。",
  "声音会告诉你哪里需要慢下来。",
  "音乐也在练呼吸。",
  "口琴里的气息，和运动里的节奏很像。",
  "今天一小段旋律就够。",
  "听见自己的声音，也是一种成长。",
  "音乐舱适合安静修理一点点。",
  "慢一点，音会更稳。",
  "练口琴不是补债，是和声音打招呼。",
  "一个小节清楚了，后面会跟上。",
  "今天让口琴轻轻上线。",
  "声音不需要完美，先让它出来。",
  "大白会听见你练过的痕迹。"
];

export const expressionMemory: string[] = [
  "你的表达很有力量，先说出来就好。",
  "你适合被当成有想法的人。",
  "说清楚，是你很重要的能力。",
  "讲给大白听，比憋在脑子里轻。",
  "一句自己的话，常常比标准答案更有用。",
  "你可以先讲大概，再慢慢变准确。",
  "表达不是背答案，是把想法带出来。",
  "你的观点值得被听完。",
  "大白会先接住你的话。",
  "说慢一点，想法会更清楚。",
  "你当小教练的时候，记得特别稳。",
  "把过程讲出来，数学就会变亮。",
  "语文先说画面，字就容易跟上。",
  "英语先说短句，世界就近一点。",
  "今天让一个想法出来透透气。"
];

export const memoryPhrases: string[] = [
  ...sportsMemory,
  ...englishMemory,
  ...learningMemory,
  ...emotionMemory,
  ...fatherSonMemory,
  ...worldMemory,
  ...musicMemory,
  ...expressionMemory
];

export const encouragementPhrases: string[] = [
  "今天不需要爆发，只要重新上场。",
  "呼吸稳一点，下一步就会出现。",
  "球还没落地，我们就还有机会。",
  "风大也没关系，飞行本来就会摇晃。",
  "真正的成长，是今天多看清一点。",
  "能量不满也可以开始。",
  "这一球先接住，后面再调整。",
  "别急着成为最强，先成为今天在场的人。",
  "训练不是惩罚，是给未来充电。",
  "天空很远，第一步就在脚下。",
  "先把呼吸调回来。",
  "今天的球，先稳稳接住。",
  "风会经过，脚下还在。",
  "再来一次，可以轻一点。",
  "小小的进步，也会发光。",
  "今天的你，不用演得很厉害。",
  "跳起来之前，先站稳。",
  "球场会等你下一拍。",
  "低电量也有低电量的打法。",
  "先把身体和心叫回来。",
  "像分析一场球，先看清一个点。",
  "记录下来，下一次就更清楚。",
  "一步一步，路会自己展开。",
  "今天只修一个动作。",
  "别急着反击，先看球路。",
  "能看见问题，就是进步开始。",
  "小队不需要吵，节奏会回来。",
  "再轻轻试一次。",
  "今天不是冲刺，是回到场上。",
  "你已经在路上了。",
  "飞行会摇晃，但风也会托住你。",
  "温柔一点，也能有勇气。",
  "远方很亮，不用一口气抵达。",
  "云层厚的时候，先走脚下。",
  "身体动起来，心也会松一点。",
  "把声音放出来，世界会近一点。",
  "今天先让心里有风。",
  "不急着穿过天空，先抬头看看。",
  "你和远方之间，差一句开始。",
  "慢慢来，光会找到缝隙。",
  "像练呼吸一样，先稳住节奏。",
  "守住一个小动作，就很好。",
  "训练日也可以很安静。",
  "今天只把刀磨亮一点点。",
  "别把自己逼太紧。",
  "呼吸一稳，手也会稳。",
  "现在先保护节奏。",
  "一点点累，也可以一点点走。",
  "把力气留给最关键的一步。",
  "今天的守护，是照顾好自己。",
  "重新上场不需要很响。",
  "球场上的答案，常常在下一拍。",
  "投出去之前，先看篮筐。",
  "手感会回来，先摸到球。",
  "今天先做一次漂亮的准备动作。",
  "暂停一下，不代表离开球场。",
  "把这一球传出去。",
  "脚步动起来，脑子会跟上。",
  "今天的练习，不需要观众。",
  "你在场上，就有下一回合。",
  "跳跃从弯膝开始。",
  "再来一球，可以轻轻来。",
  "团队不在身边，大白也能陪练。",
  "看见球路，比用力更重要。",
  "今天先把高度留给下一次。",
  "小小起跳，也是在练天空。",
  "接住一个点，节奏就回来了。",
  "不用每一球都漂亮。",
  "你可以先把球垫起来。",
  "今天的目标，是别让自己太重。",
  "能量像云一样，会慢慢聚回来。",
  "修炼有时只是认真吃饭喝水。",
  "先把气蓄一点。",
  "小小突破，也值得收好。",
  "今天不变身也可以练。",
  "能量条不满，动作也能开始。",
  "先把一件事做稳。",
  "成长不是爆炸，是一点点发亮。",
  "今天练基本功。",
  "慢慢聚气，慢慢出发。",
  "少年感不是大喊，是愿意再试。",
  "今天的路，先走一格。",
  "跌一下也不用演坚强。",
  "把鞋带系好，就能重新出发。",
  "这一次只看脚下。",
  "你不用赢全场。",
  "先把心放回身体里。",
  "明亮不是一直高兴，是还愿意看看。",
  "风、球、呼吸，都可以帮你回来。",
  "今天也有一个小小的入口。",
  "把难题当成训练模拟。",
  "先跑一遍最小版本。",
  "观察、记录、调整。",
  "聪明的打法，是省力一点。",
  "先选低风险的一步。",
  "今天做一次小测试。",
  "数据会告诉我们下一步。",
  "不要急着判断自己。",
  "把回合缩短，胜算会清楚。",
  "先让系统启动。",
  "少年不需要一直燃烧。",
  "安静前进，也很酷。",
  "今天只保留一束光。",
  "把世界调小一点。",
  "一个动作，一个呼吸。",
  "大白在旁边看着路线。",
  "你可以慢慢变强。",
  "今天的勇气，是轻轻开始。",
  "下一步不用很大。",
  "先把自己带回基地。",
  "这不是考试，这是一次练习。",
  "今天先和自己站在一起。",
  "把手伸出去，就有一点风。",
  "我们从不那么难的地方开始。",
  "做一点，心里就会亮一点。",
  "先开机，再升级。",
  "今天不追求满分，只追求清楚。",
  "大白陪你把声音调低一点。",
  "稳住，路还在。",
  "小小一拍，也算回到节奏。"
];

export const actionPhrases: string[] = [
  "先看局势，再选房间。",
  "今天不用大战，先拿下一格。",
  "像下棋一样，先走最稳的一步。",
  "别急着赢全场，先把这一球接住。",
  "如果世界有点乱，就先整理桌面。",
  "先做最小版本，聪明人都这样开局。",
  "今天的策略：少想一点，多开始一点。",
  "先试一次，数据会告诉我们下一步。",
  "大将不慌，先稳住阵脚。",
  "积跬步，至千里。今天只要一小步。",
  "先选一个房间。",
  "先从最轻的一项开始。",
  "想动一动，就去身体舱。",
  "想去远方，就去英语探索。",
  "想安静一下，可以来聊天。",
  "如果有点累，就选低电量模式。",
  "先把今天调成简单模式。",
  "选一扇门，不选全部。",
  "先打开地图，再决定路线。",
  "从最稳的落点开始。",
  "先问一个小问题。",
  "把大任务切成一小块。",
  "先完成一个可见动作。",
  "今天先走A计划。",
  "如果A计划卡住，就换B计划。",
  "像指挥一支小队，先派一个侦察兵。",
  "先做一遍模拟。",
  "不急着下结论，先收集线索。",
  "先把题目读慢。",
  "先把球拍拿稳。",
  "先说一句英文。",
  "先让身体上线。",
  "先吹一小段口琴。",
  "先跟大白说一句。",
  "先把桌面清出一块。",
  "先喝水，再开局。",
  "先看窗外十秒。",
  "先选低压入口。",
  "先做一个不用太多力气的版本。",
  "先把第一步写出来。",
  "今日策略：小步快试。",
  "今日策略：看清再动。",
  "今日策略：保留体力。",
  "今日策略：先稳住。",
  "今日策略：只改一个点。",
  "今日策略：让身体和脑子都在线。",
  "今日策略：用英语开一扇门。",
  "今日策略：把声音放出来。",
  "今日策略：别堆，先选。",
  "今日策略：轻装上阵。",
  "像安静的指挥官，先看全图。",
  "像训练模拟，先跑最小回合。",
  "像网球回合，先把球送过去。",
  "像三国布阵，先守住中路。",
  "像侦察任务，先找一个线索。",
  "像科学实验，先试一次。",
  "像地图探索，先点亮一站。",
  "像口琴练习，先慢一点。",
  "像球场热身，先活动起来。",
  "像清晨开窗，先让空气进来。",
  "先别解释全部，先说第一句。",
  "先别找完美，先找入口。",
  "先别急着评价，先做记录。",
  "先别用力过猛，先保持节奏。",
  "先别展开全图，先看一格。",
  "先别把事情想大，先把它做小。",
  "先别冲刺，先热身。",
  "先别担心后面，先处理眼前。",
  "先别追求漂亮，先追求清楚。",
  "先别开太多窗口，先点一个按钮。",
  "可以先试试。",
  "今天只做一点。",
  "先开个头。",
  "低电量也可以。",
  "大白陪你。",
  "先把最小版本做出来。",
  "先从一句话开始。",
  "先把一个动作做慢。",
  "先把一个词读清。",
  "先把一个错因圈住。",
  "太阳很亮的时候，就先走阴凉处。",
  "世界有点荒诞时，就先系好鞋带。",
  "漂亮话先放一边，先做一点真动作。",
  "清醒的人不慌，先做小事。",
  "生活不总讲道理，基地可以讲节奏。",
  "先用幽默把难度调低。",
  "今天的严肃额度已经够了，先轻一点。",
  "如果脑子像抽屉，先关上一个。",
  "先把问题放到桌面上。",
  "先给自己一个可执行的命令。",
  "知己知彼，先知道自己今天的电量。",
  "不谋全局，先看这一格。",
  "稳中求进，先稳。",
  "兵贵神速，今天贵在开始。",
  "小胜可收，大白负责记录。",
  "先胜在不慌。",
  "阵脚稳了，下一步会出现。",
  "先守一分，再看机会。",
  "把复杂事交给明天一点。",
  "先让今天有个清楚开头。",
  "先打开身体舱也可以。",
  "先打开英语探索也可以。",
  "先打开学习小局也可以。",
  "先打开音乐舱也可以。",
  "先打开聊天也可以。",
  "先选最顺眼的门。",
  "今天就用轻量路线。",
  "先把一件事收进基地。",
  "下一步，等开始后再说。",
  "走一小步，地图会更新。",
  "先把频道切到安静。",
  "先做一件两分钟的事。",
  "先给今天起个小标题。",
  "先把路线画短一点。",
  "先收集一个证据。",
  "先把问题变成一句话。",
  "先开一局训练模拟。",
  "先让呼吸当队长。",
  "先把声音放到桌上。",
  "先从最像游戏的一步开始。"
];

export const bodyPhrases: string[] = [...sportsMemory.slice(0, 10), ...encouragementPhrases.slice(0, 10)];
export const englishPhrases: string[] = [...englishMemory.slice(0, 10), ...encouragementPhrases.slice(30, 40)];

export const dabaiPhrases: DabaiPhraseBank = {
  greetingPhrases,
  memoryPhrases,
  encouragementPhrases,
  actionPhrases
};

export function getSeededRandom(date: string | Date, salt = 0): () => number {
  const value = date instanceof Date ? date.toISOString().slice(0, 10) : String(date || new Date().toISOString().slice(0, 10));
  let seed = 0;
  for (let index = 0; index < value.length; index += 1) seed = (seed * 31 + value.charCodeAt(index)) >>> 0;
  seed = (seed + salt * 2654435761) >>> 0;
  seed ^= seed >>> 16;
  seed = Math.imul(seed, 2246822507) >>> 0;
  seed ^= seed >>> 13;
  seed = Math.imul(seed, 3266489909) >>> 0;
  seed ^= seed >>> 16;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function dateKey(date: string | Date): string {
  return date instanceof Date ? date.toISOString().slice(0, 10) : String(date || new Date().toISOString().slice(0, 10)).slice(0, 10);
}

function previousDateKey(date: string | Date, offset = 1): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey(date));
  if (!match) return "";
  const value = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  value.setUTCDate(value.getUTCDate() - offset);
  return value.toISOString().slice(0, 10);
}

function pickIndex(list: string[], date: string | Date, salt: number): number {
  const random = getSeededRandom(date, salt);
  return Math.floor(random() * list.length) % list.length;
}

function pickValueAvoidingPrevious(list: string[], date: string | Date, salt: number, depth = 3): string {
  if (!list.length) return "";
  let index = pickIndex(list, date, salt);
  if (depth <= 0) return list[index];
  const previousKey = previousDateKey(date);
  if (!previousKey) return list[index];
  const previousValue = pickValueAvoidingPrevious(list, previousKey, salt, depth - 1);
  let attempts = 0;
  while (list[index] === previousValue && attempts < list.length) {
    index = (index + 1) % list.length;
    attempts += 1;
  }
  return list[index];
}

function pickAvoidPrevious(list: string[], date: string | Date, salt: number): string {
  return pickValueAvoidingPrevious(list, date, salt, 4);
}

function uniquePhrases(list: string[]): string[] {
  return [...new Set(list.filter(Boolean))];
}

export function seededPhrase(list: string[], seed: number, offset = 0): string {
  if (!list?.length) return "";
  return list[Math.abs(seed + offset) % list.length];
}

function composeDailyDabaiLine(date: string | Date, userProfile: UserProfile = {}, attempt = 0): DailyDabaiLine {
  const goals = userProfile.goals || [];
  const interests = userProfile.interests || [];
  const memoryPool = uniquePhrases([
    ...memoryPhrases,
    ...(goals.includes("学习体育双不误") ? fatherSonMemory : []),
    ...(interests.includes("网球") ? sportsMemory : []),
    ...(goals.includes("未来出国") ? englishMemory : [])
  ]);
  const seedShift = attempt * 17;
  const greeting = pickAvoidPrevious(greetingPhrases, date, 1 + seedShift);
  const memory = pickAvoidPrevious(memoryPool, date, 7 + seedShift);
  const encouragement = pickAvoidPrevious(encouragementPhrases, date, 11 + seedShift);
  const action = pickAvoidPrevious(actionPhrases, date, 13 + seedShift);
  return {
    greeting,
    memory,
    encouragement,
    action,
    fullLine: `${greeting}\n${memory}\n${action}`
  };
}

export function getDailyDabaiLine(date: string | Date, userProfile: UserProfile = {}): DailyDabaiLine {
  const key = dateKey(date);
  const previousKey = previousDateKey(key);
  let line = composeDailyDabaiLine(key, userProfile, 0);
  if (!previousKey) return line;
  const previousLine = composeDailyDabaiLine(previousKey, userProfile, 0);
  let attempt = 1;
  while (line.fullLine === previousLine.fullLine && attempt < 20) {
    line = composeDailyDabaiLine(key, userProfile, attempt);
    attempt += 1;
  }
  return line;
}

export function getRoomPhrase(roomName: string, date: string | Date, userProfile: UserProfile = {}): RoomPhrase {
  const room = String(roomName || "");
  let memoryPool = memoryPhrases;
  let encouragementPool = encouragementPhrases;
  let actionPool = actionPhrases;
  if (room.includes("body") || room.includes("身体") || room.includes("sport")) {
    memoryPool = sportsMemory;
    encouragementPool = encouragementPhrases.slice(0, 30);
    actionPool = actionPhrases.filter((line) => line.includes("身体") || line.includes("球") || line.includes("动作") || line.includes("热身"));
  } else if (room.includes("english") || room.includes("英语")) {
    memoryPool = englishMemory;
    encouragementPool = encouragementPhrases.slice(30, 60);
    actionPool = actionPhrases.filter((line) => line.includes("英语") || line.includes("远方") || line.includes("一句"));
  } else if (room.includes("learning") || room.includes("学习")) {
    memoryPool = learningMemory;
    actionPool = actionPhrases.filter((line) => line.includes("策略") || line.includes("题") || line.includes("一格") || line.includes("线索"));
  } else if (room.includes("music") || room.includes("音乐")) {
    memoryPool = musicMemory;
    encouragementPool = encouragementPhrases.slice(30, 50);
    actionPool = actionPhrases.filter((line) => line.includes("口琴") || line.includes("慢") || line.includes("声音"));
  } else if (room.includes("chat") || room.includes("聊天")) {
    memoryPool = emotionMemory;
    encouragementPool = encouragementPhrases.slice(80, 120);
    actionPool = actionPhrases.filter((line) => line.includes("说") || line.includes("低电量") || line.includes("轻"));
  }
  memoryPool = uniquePhrases(memoryPool);
  encouragementPool = uniquePhrases(encouragementPool);
  if (!actionPool.length) actionPool = actionPhrases;
  actionPool = uniquePhrases(actionPool);
  const memory = pickAvoidPrevious(memoryPool, date, 21);
  const encouragement = pickAvoidPrevious(encouragementPool, date, 23);
  const action = pickAvoidPrevious(actionPool, date, 29);
  return {
    memory,
    encouragement,
    action,
    fullLine: `${memory}\n${encouragement}\n${action}`
  };
}
