const typeCopy = {
  T01: { name: "事業開拓型", tagline: "新しい顧客課題を見つけ、事業の形にするとき力が出る経営者です。", description: "既存事業を守るだけでなく、新しい市場や収益の柱を生み出す判断が強く出ています。前例が少ない状況でも仮説を作り、動き始められることが大きな強みです。可能性が多いほど資源が分散しやすいため、今期に検証する一案と中止条件をセットにすると、創造力が事業価値へ変わります。", strengths: ["新しい機会を見つける", "前例がなくても初動を起こす", "複数の事業構造を考える"], risks: ["複数案へ同時に着手する", "既存事業の運営が後回しになる", "構想が頭の中だけに残る"] },
  T02: { name: "仕組み経営型", tagline: "本人が離れても、利益と価値が残る仕組みを作る経営者です。", description: "個人の頑張りより、再現できる工程、数字、権限、収益構造を整える判断が強く出ています。会社を持続可能な事業資産へ変えられる一方、測りやすさを優先しすぎると現場の暗黙知や新しい探索を切り落とすことがあります。例外を拾う場と、小さな試みの枠を残すことが大切です。", strengths: ["業務を標準化する", "採算を数字で捉える", "本人不在でも回る状態を作る"], risks: ["数字だけで判断する", "新しい探索が減る", "現場との心理的距離が開く"] },
  T03: { name: "組織拡大型", tagline: "人を集め、役割を束ね、大きな組織で成果を出す経営者です。", description: "仲間と責任者を増やし、組織全体を前へ動かす判断が強く出ています。採用、配置、目標設定、拠点展開で力を発揮します。一方、人数や拠点数が成果の代わりになると固定費と階層だけが増えます。次の採用が改善する顧客指標と利益指標を先に置くと、統率力が成果へつながります。", strengths: ["人を巻き込む", "責任者を配置する", "多拠点や営業組織を動かす"], risks: ["組織を大きくすることが目的になる", "固定費が先に増える", "会議と階層が増える"] },
  T04: { name: "市場攻略型", tagline: "市場の変化を読み、勝てる場所へ素早く資源を動かす経営者です。", description: "顧客反応、販路、価格、競合の変化を見て打ち手を切り替える判断が強く出ています。小さく試して数字が出た場所へ集中できる機動力が強みです。短期反応だけを追うと資産が残りにくいため、各施策に半年後も残す顧客情報や販売手順を一つ設定すると安定します。", strengths: ["市場変化を早く捉える", "小さく検証する", "勝てない場面から撤退する"], risks: ["流行へ依存する", "短期成果だけを追う", "学びや顧客情報が残らない"] },
  T05: { name: "志実現型", tagline: "実現したい将来像を、会社という形で完成へ近づける経営者です。", description: "目先の効率や評判だけでなく、自分が本当に実現したい構想との一貫性を重視する傾向が出ています。強い意味付けが長期の集中力になります。一方、会社と構想と自分が一体化すると、修正が自己否定に感じられることがあります。変えない目的と、顧客反応に応じて変える方法を分けることが重要です。", strengths: ["大きな構想を描く", "長期に集中する", "一貫した意味を与える"], risks: ["撤退条件を置けない", "反対意見を遠ざける", "構想が他人へ伝わらない"] },
  T06: { name: "資本戦略型", tagline: "調達、投資、買収、売却を組み合わせ、企業価値を動かす経営者です。", description: "資本をどこから集め、どこへ配り、いつ回収するかを重視する判断が強く出ています。時間を買う大型投資や企業取引を扱えることが強みです。調達額や評価額が目的にならないよう、各判断を顧客指標、現場能力、下振れ時の選択肢へ接続することが大切です。", strengths: ["資本を成長へ配分する", "大型の選択肢を扱う", "買収や売却を設計する"], risks: ["現場能力より先に資金を入れる", "次の調達が前提になる", "企業価値が目的化する"] },
  T07: { name: "品質追求型", tagline: "商品やサービスを磨き、顧客へ確かな価値を届ける経営者です。", description: "規模や話題性より、顧客が実際に受け取る品質を高める判断が強く出ています。現場の細部を理解し、長期の信頼につながる違いを作れます。一方で、自分の基準が高いほど任せられず、発売や価格改定が遅れることがあります。品質基準を顧客が分かる言葉と、任せられる検査へ変換することが成長の鍵です。", strengths: ["商品を深く理解する", "品質を継続改善する", "顧客体験を守る"], risks: ["完成まで出さない", "自分で抱え込む", "販売と採算が後回しになる"] },
  T08: { name: "社会使命型", tagline: "解決したい社会課題を、続けられる事業の形へ変える経営者です。", description: "自社の成功だけでなく、受益者や地域に起きる具体的な改善を重視する傾向が出ています。共感を集め、多様な関係者と連携できることが強みです。意義が大きいほど採算の議論を避けないよう、誰の何がどう変わるかと、費用負担者を同時に定義することが大切です。", strengths: ["社会的な意味を作る", "多様な関係者と連携する", "長期の効果を考える"], risks: ["対象を広げすぎる", "採算を後回しにする", "成果が活動量だけになる"] },
  T09: { name: "発信牽引型", tagline: "自分の言葉と信用を旗印に、人と機会を集める経営者です。", description: "自らの経験、考え、物語を発信し、採用や販売へつなげる判断が強く出ています。複雑な構想に顔と声を与え、人を動かせることが強みです。本人を通さないと仕事が進まない状態を避けるため、発信から得た知識や顧客接点を会社へ移す設計が必要です。", strengths: ["言葉で人を動かす", "認知と信用を作る", "採用や営業の初速を出す"], risks: ["本人へ依存する", "発信と実態に差が出る", "社内との温度差が開く"] },
  T10: { name: "永続経営型", tagline: "社員、取引先、地域との信用を守り、会社を次世代へつなぐ経営者です。", description: "短期の売却益や急拡大より、会社が長く存続し、築いた関係が次世代へ続くことを重視する傾向が出ています。不況時にも支えられる信用が強みです。一方、関係を壊したくない思いから改革が遅れることがあります。守る価値と、価値を守るために変える仕組みを分けることが大切です。", strengths: ["長期の信用を築く", "関係者への責任を守る", "次世代への継承を考える"], risks: ["不採算を温存する", "改革の期限を置けない", "後継者の裁量を狭める"] }
};

const issueLabels = ["構想整理", "言語化", "営業", "市場開拓", "組織運営", "財務管理", "商品改善", "採用育成", "資本活用", "継続運営", "特にない"];

const quickQuestionNumbers = [1, 2, 4, 7, 10, 12, 15, 18, 21, 25];
const quickCopy = {
  1: ["次にやること", "今の仕事がうまく回り始めました。次にやりたいことは？", ["新しい仕事を始める", "自分がいなくても回るようにする", "人を増やして会社を大きくする", "今の商品をもっと良くする"]],
  2: ["注文が急に増えたら", "ある売り方で、急に注文が増えました。どうしますか？", ["売れ方を見ながら、すぐ力を入れる", "お金を集めて、一気に増やす", "品質を守れる分だけ売る", "いつもの取引先との約束を優先する"]],
  4: ["取材の依頼", "あなた自身を取材したいと言われました。どうしますか？", ["自分の発信を、採用や営業に生かす", "自分より、会社の実績を紹介してもらう", "自分が目指す未来をしっかり話す", "会社より、解決したい問題を紹介する"]],
  7: ["大きな出資の話", "会社に大きなお金を出したいと言われました。どう考えますか？", ["使い道と返し方まで見えていれば受ける", "人や店を増やせるなら受ける", "まず自分たちで利益が出る形を作る", "会社らしさや信用を守れるかを優先する"]],
  10: ["会社を買いたい人", "あなたの会社を買いたい人が現れました。何を一番考えますか？", ["売ったお金で次の仕事ができるか", "一番良い条件で売れるか", "今売ることが会社にとって得か", "社員や取引先を大切にしてくれるか"]],
  12: ["大切にしたいこと", "大切にしてきた考えと、お客さんの希望がぶつかりました。", ["大切な考えを守る", "より多くの人の役に立つ方を選ぶ", "品質を落とさない方法を探す", "新しい需要かどうか試す"]],
  15: ["10年後", "10年後、どうなっていたら一番うれしいですか？", ["自分の夢が形になっている", "世の中の困りごとが減っている", "自分がいなくても利益が出ている", "次の世代へ会社が続いている"]],
  18: ["赤字の仕事", "赤字が続く仕事があります。どうしますか？", ["期限を決めて直し、だめならやめる", "世の中に必要なら、続けるお金を探す", "売る・まとめる・やめるを数字で決める", "お客さんや社員を守りながら小さく残す"]],
  21: ["意見が割れたら", "大切な会議で意見が真っ二つに割れました。どうしますか？", ["最後に決める人を決め、期限までに決める", "数字と決まりにそって決める", "会社が長く守ってきた約束を大切にする", "自分が目指す未来に近い方を選ぶ"]],
  25: ["最後に残したいもの", "経営者を終えるとき、何を一番残したいですか？", ["長く愛される商品や技術", "世の中を良くする仕組み", "自分の考えに共感する人の輪", "次の世代へ続く会社"]]
};

Object.assign(quickCopy, {
  3: ["自由に使えるお金", "会社で自由に使える1億円ができました。何に使いますか？", ["新しい仕事をいくつか試す", "人を増やし、売る場所を広げる", "ずっと実現したかった夢に使う", "世の中の困りごとを減らす仕事に使う"]],
  5: ["会社を変える案", "後を継ぐ人が、会社を大きく変えたいと言いました。まず何を考えますか？", ["社員や取引先が困らない進め方", "会社全体の利益が良くなるか", "人を伸びる仕事へ移せるか", "今の技術を別の役立て方に変えられるか"]],
  6: ["ライバルの商品", "ライバル会社が新しい商品を出しました。どうしますか？", ["お客さんの反応を見て、売り方を変える", "負けないように商品をもっと良くする", "別の新しい仕事を探す", "自分たちが本当に届けたい価値を考える"]],
  8: ["話が伝わらない", "会社のこれからを社員に話しましたが、伝わりません。どうしますか？", ["例を使って、何度でも話す", "誰が何をするかまで決める", "まず少し売って、結果を見せる", "自分が発信して、仲間を集める"]],
  9: ["地域からの相談", "地域の困りごとを、会社で手伝ってほしいと言われました。", ["役に立ち、仕事としても続く形を探す", "長い付き合いを大切にし、できる範囲で受ける", "ほかの地域でも使える形なら取り組む", "新しい仕事として成り立つか試す"]],
  11: ["人を増やすか", "仕事が増えました。人を雇うか、仕組みに任せるか迷います。", ["任せられる人を雇う", "少ない人数で回る仕組みを作る", "お客さんが一番喜ぶ方を選ぶ", "忙しさが続くか、もう少し見る"]],
  13: ["1か月休むなら", "あなたが1か月、会社を休むことになりました。何を準備しますか？", ["仕事のやり方と数字をまとめる", "誰が決めるかをはっきりさせる", "発信や大切な連絡を準備する", "お客さんや社員へ自分で説明する"]],
  14: ["新しい発信の場", "新しい交流サイトが流行り始めました。どうしますか？", ["少しずつ試し、反応が良い方法を伸ばす", "早く始めて、自分を知ってもらう", "そこで見つかる悩みから新しい仕事を考える", "流行が終わっても残るお客さんの情報を集める"]],
  16: ["利益が減ったら", "売上はあるのに、利益が減ってきました。どうしますか？", ["利益が出る仕事へお金を回す", "大きなお金を使って、仕入れや作り方を変える", "利益が出るお客さんや売り方へしぼる", "責任者を決め、利益を目標にする"]],
  17: ["任せられる人", "とても優秀な商品づくりの責任者が入りました。どうしますか？", ["品質の決め方を教えて、少しずつ任せる", "今の仕事を任せ、自分は次の仕事を探す", "より大きな責任者に育てる", "自分の夢を一緒に形にしてもらう"]],
  19: ["大きな講演", "大勢の前で話す機会が来ました。何を一番伝えますか？", ["自分の言葉で、仲間やお客さんを集める", "自分が作りたい未来", "みんなに知ってほしい社会の問題", "新しい仕事につながる話"]],
  20: ["会社を買うなら", "良さそうな会社を買える話が来ました。何を一番見ますか？", ["買った後、会社の価値を上げられるか", "使ったお金を回収できるか", "新しい仕事を早く始められるか", "良い技術と品質を守れるか"]],
  22: ["強い苦情", "お客さんから強い苦情が来ました。最初に何をしますか？", ["自分で商品と使われ方を確かめる", "検査や仕事のやり方を直す", "自分の言葉で説明する", "ほかのお客さんにも起きているか調べる"]],
  23: ["人が採れない", "なかなか人を採用できません。どうしますか？", ["自分が会社の良さを発信する", "採用と育成の担当者や仕組みを作る", "外の人にも仕事を手伝ってもらう", "長い付き合いの中から人を育てる"]],
  24: ["大成功した後", "今の仕事で大成功しました。次に何をしたいですか？", ["知らない分野で新しい仕事を始める", "いくつかの会社へ投資する", "もっと大きな会社にする", "長年の夢を完成させる"]]
});

const abilityMap = {
  "開拓力": ["T01", "T05"], "組織力": ["T03", "T10"], "販売力": ["T04", "T09"],
  "資金力": ["T02", "T06"], "商品力": ["T07", "T04"], "継続力": ["T08", "T10"]
};


const historicalFigures = {
  T01: { name: "坂本龍馬", mark: "龍", text: "古い枠にとらわれず、人や考えをつなぎながら新しい道を開こうとするところが重なります。" },
  T02: { name: "松下幸之助", mark: "松", text: "個人の力だけに頼らず、人が育ち、仕事が続く仕組みを作ろうとするところが重なります。" },
  T03: { name: "豊臣秀吉", mark: "秀", text: "人を巻き込み、役割を与え、大きな組織を動かして成果へつなげるところが重なります。" },
  T04: { name: "織田信長", mark: "信", text: "変化を早く読み、古いやり方にこだわらず、勝てる方法へ切り替えるところが重なります。" },
  T05: { name: "伊能忠敬", mark: "忠", text: "長く抱いた目標を、時間をかけても自分の手で形にしようとするところが重なります。" },
  T06: { name: "渋沢栄一", mark: "栄", text: "お金と事業を結びつけ、多くの会社や人が動く土台を作ろうとするところが重なります。" },
  T07: { name: "本田宗一郎", mark: "技", text: "現場と商品に深く入り込み、納得できる品質まで磨き続けるところが重なります。" },
  T08: { name: "二宮尊徳", mark: "徳", text: "目の前の暮らしや地域を良くしながら、無理なく続けられる形を考えるところが重なります。" },
  T09: { name: "福沢諭吉", mark: "諭", text: "自分の考えを分かりやすく世に伝え、その言葉で人を動かすところが重なります。" },
  T10: { name: "徳川家康", mark: "康", text: "目先の勢いだけでなく、信用と仕組みを守り、長く続く形を残そうとするところが重なります。" }
};

const numerologyProfiles = {
  1: { name: "自分の道を切り開く人", keyword: "開拓", text: "人の後を追うより、自分で決めて最初の一歩を踏み出す性格です。決断が早い一方、一人で進みすぎることがあります。" },
  2: { name: "人と人をつなぐ人", keyword: "協調", text: "相手の気持ちをよく見て、争いを避けながら関係を整える性格です。気配りができる一方、遠慮しすぎることがあります。" },
  3: { name: "明るさを広げる人", keyword: "表現", text: "感じたことや考えたことを、言葉や形にして人へ伝える性格です。場を明るくする一方、飽きやすさが出ることがあります。" },
  4: { name: "土台をしっかり作る人", keyword: "堅実", text: "順番を守り、決めたことを着実に積み上げる性格です。信頼される一方、急な変更を苦手に感じることがあります。" },
  5: { name: "変化を楽しむ人", keyword: "自由", text: "新しい場所や考えにひかれ、変化の中で力を出す性格です。行動範囲が広い一方、一つに落ち着きにくいことがあります。" },
  6: { name: "身近な人を守る人", keyword: "愛情", text: "家族や仲間を大切にし、困っている人を支えようとする性格です。責任感が強い一方、世話を焼きすぎることがあります。" },
  7: { name: "深く考えて本質を探す人", keyword: "探究", text: "表面だけで判断せず、自分で調べて納得できる答えを探す性格です。専門性が高まる一方、考えを内側に抱えやすいところがあります。" },
  8: { name: "成果を形にする人", keyword: "達成", text: "目標を決め、現実的な結果へつなげようとする性格です。お金や組織を動かせる一方、結果を急ぎすぎることがあります。" },
  9: { name: "広い視点で人を助ける人", keyword: "理想", text: "自分の損得だけでなく、多くの人にとって良い形を考える性格です。視野が広い一方、理想を背負いすぎることがあります。" },
  11: { name: "ひらめきを言葉にする人", keyword: "直感", text: "人がまだ気づいていないことを感じ取り、未来のイメージとして伝える性格です。感性が鋭い一方、気持ちが揺れやすいところがあります。" },
  22: { name: "大きな構想を現実にする人", keyword: "実現", text: "大きな目標を描くだけでなく、人や仕組みを集めて現実へ変えようとする性格です。大きな成果を狙える一方、責任を抱え込みやすいところがあります。" },
  33: { name: "人を包み育てる人", keyword: "奉仕", text: "立場の違う人も受け入れ、安心できる場所を作ろうとする性格です。人を育てられる一方、自分のことを後回しにしやすいところがあります。" }
};

const state = { questions: [], allQuestions: [], scoring: null, answers: [], index: 0, selectedIssues: [], stage: "成長", audience: "社員", mode: "full" };
const $ = id => document.getElementById(id);

function show(id) {
  ["loading", "landing", "profile", "quiz", "issues", "result", "error"].forEach(name => $(name).classList.toggle("hidden", name !== id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cleanInline(text) { return text.replace(/\*\*/g, "").replace(/  $/, "").trim(); }

function parseQuestions(markdown) {
  const output = [];
  const pattern = /## 第(\d+)問：([^\r\n]+)\r?\n\r?\n([\s\S]*?)(?=\r?\n## 第\d+問：|\r?\n## 課題確認用)/g;
  for (const match of markdown.matchAll(pattern)) {
    const lines = match[3].split(/\r?\n/).map(cleanInline).filter(Boolean);
    const firstOption = lines.findIndex(line => /^[A-D]\.\s/.test(line));
    const prompt = lines.slice(0, firstOption).join(" ");
    const options = Object.fromEntries(lines.slice(firstOption).filter(line => /^[A-D]\.\s/.test(line)).map(line => [line[0], line.slice(3).trim()]));
    output.push({ number: Number(match[1]), theme: match[2].trim(), prompt, options });
  }
  if (output.length !== 25 || output.some(item => Object.keys(item.options).length !== 4)) throw new Error("質問データが不完全です");
  return output;
}

async function init() {
  try {
    const [questionsResponse, scoringResponse] = await Promise.all([fetch("../questions.md"), fetch("../skills/keieisha-shindan/data/scoring.json")]);
    if (!questionsResponse.ok || !scoringResponse.ok) throw new Error("データを取得できません");
    state.allQuestions = parseQuestions(await questionsResponse.text());
    state.scoring = await scoringResponse.json();
    if (state.scoring.questions.length !== 25) throw new Error("採点データが不完全です");
    buildIssueOptions();
    bindEvents();
    show("landing");
  } catch (error) {
    console.error(error);
    show("error");
  }
}

function bindEvents() {
  $("quick-start-button").addEventListener("click", () => startMode("full"));
  $("profile-next").addEventListener("click", () => {
    state.userName = $("user-name").value.trim(); state.birthDate = $("birth-date").value;
    state.stage = $("stage").value; state.audience = $("audience").value; renderQuestion(); show("quiz");
  });
  $("back-button").addEventListener("click", () => {
    if (state.index === 0) return show("profile");
    state.index -= 1; renderQuestion();
  });
  $("show-result").addEventListener("click", renderResult);
  $("restart-button").addEventListener("click", reset);
  $("share-button").addEventListener("click", shareResult);
  $("copy-result").addEventListener("click", copyResult);
}

function startMode(mode) {
  state.mode = mode;
  const source = mode === "quick" ? state.allQuestions.filter(question => quickQuestionNumbers.includes(question.number)) : state.allQuestions;
  state.questions = source.map(question => {
    const copy = quickCopy[question.number];
    return { ...question, theme: copy[0], prompt: copy[1], options: Object.fromEntries(["A", "B", "C", "D"].map((key, index) => [key, copy[2][index]])) };
  });
  state.answers = [];
  state.index = 0;
  show("profile");
}

function renderQuestion() {
  const question = state.questions[state.index];
  const total = state.questions.length;
  $("progress-number").textContent = `第${state.index + 1}問／全${total}問`;
  $("progress-percent").textContent = `${Math.round((state.index + 1) / total * 100)}%`;
  $("progress-bar").style.width = `${(state.index + 1) / total * 100}%`;
  $("question-theme").textContent = question.theme;
  $("question-text").textContent = question.prompt;
  $("back-button").style.visibility = "visible";
  $("options").innerHTML = "";
  Object.entries(question.options).forEach(([key, text]) => {
    const button = document.createElement("button");
    button.className = "option";
    button.innerHTML = `<span class="option-key">${key}</span><span>${text}</span>`;
    button.addEventListener("click", () => chooseAnswer(key));
    $("options").appendChild(button);
  });
}

function chooseAnswer(answer) {
  state.answers[state.index] = answer;
  if (state.index < state.questions.length - 1) { state.index += 1; renderQuestion(); }
  else show("issues");
}

function buildIssueOptions() {
  issueLabels.forEach(label => {
    const button = document.createElement("button");
    button.className = "issue-chip"; button.textContent = label; button.type = "button";
    button.addEventListener("click", () => toggleIssue(label, button));
    $("issue-options").appendChild(button);
  });
}

function toggleIssue(label, button) {
  if (label === "特にない") {
    state.selectedIssues = [label];
    [...document.querySelectorAll(".issue-chip")].forEach(chip => chip.classList.toggle("selected", chip === button));
    return;
  }
  state.selectedIssues = state.selectedIssues.filter(value => value !== "特にない");
  const noneButton = [...document.querySelectorAll(".issue-chip")].find(chip => chip.textContent === "特にない");
  noneButton.classList.remove("selected");
  if (state.selectedIssues.includes(label)) { state.selectedIssues = state.selectedIssues.filter(value => value !== label); button.classList.remove("selected"); }
  else if (state.selectedIssues.length < 2) { state.selectedIssues.push(label); button.classList.add("selected"); }
}

function calculateScores() {
  const raw = Object.fromEntries(Object.keys(typeCopy).map(id => [id, 0]));
  const max = Object.fromEntries(Object.keys(typeCopy).map(id => [id, 0]));
  state.questions.forEach((shownQuestion, index) => {
    const question = state.scoring.questions[shownQuestion.number - 1];
    const [main, secondary] = question[state.answers[index]];
    raw[main] += 3; raw[secondary] += 1;
    Object.keys(typeCopy).forEach(id => {
      max[id] += Math.max(...Object.values(question).map(([primary, sub]) => primary === id ? 3 : sub === id ? 1 : 0));
    });
  });
  const normalized = Object.fromEntries(Object.keys(typeCopy).map(id => [id, raw[id] / max[id] * 100]));
  const total = Object.values(normalized).reduce((sum, value) => sum + value, 0);
  const composition = Object.fromEntries(Object.keys(typeCopy).map(id => [id, normalized[id] / total * 100]));
  const ranking = Object.keys(typeCopy).sort((a, b) => normalized[b] - normalized[a]);
  return { raw, normalized, composition, ranking };
}

function renderResult() {
  const scores = calculateScores();
  const mainId = scores.ranking[0];
  const main = typeCopy[mainId];
  $("result-mode-note").textContent = `${state.userName ? `${state.userName}さんの` : "あなたの"}25問の回答から見た結果です`;
  $("main-name").textContent = main.name;
  $("main-tagline").textContent = main.tagline;
  $("result-description").textContent = main.description;
  fillList("strength-list", main.strengths);
  fillList("risk-list", main.risks);
  $("top-three").innerHTML = scores.ranking.slice(0, 3).map((id, index) => `<div class="rank"><span>第${index + 1}傾向</span><strong>${typeCopy[id].name}</strong></div>`).join("");
  $("score-bars").innerHTML = scores.ranking.map(id => `<div class="score-row"><strong>${typeCopy[id].name}</strong><div class="bar-track"><span style="width:${scores.composition[id]}%"></span></div><span>${scores.composition[id].toFixed(1)}%</span></div>`).join("");
  renderAbilities(scores.normalized);
  renderHistoricalMatch(mainId);
  renderBirthPersonality();
  renderIssues();
  renderRecommendation();
  prepareShareLinks(main.name);
  show("result");
}

function renderBirthPersonality() {
  if (!state.birthDate) {
    $("birth-personality").innerHTML = `<p>生年月日が入力されていないため、この項目は表示していません。</p>`;
    return;
  }
  const digits = state.birthDate.replace(/\D/g, "").split("").map(Number);
  const firstTotal = digits.reduce((sum, value) => sum + value, 0);
  let lifePath = firstTotal;
  const steps = [digits.join("＋") + `＝${firstTotal}`];
  while (lifePath > 9 && ![11, 22, 33].includes(lifePath)) {
    const parts = String(lifePath).split("").map(Number);
    const next = parts.reduce((sum, value) => sum + value, 0);
    steps.push(`${parts.join("＋")}＝${next}`);
    lifePath = next;
  }
  const profile = numerologyProfiles[lifePath];
  $("birth-personality").innerHTML = `<div class="nature-result"><div class="nature-symbol">${lifePath}<small>${profile.keyword}</small></div><div class="nature-copy"><p class="nature-method">数秘術の誕生数 ${lifePath}</p><h3>${profile.name}</h3><p>${profile.text}</p><div class="calculation-line">計算：${steps.join(" → ")}</div><small>生年月日の数字を足し、1桁になるまで足します。11・22・33は特別な数字として残します。これは数秘術による性格判断で、25問から出す仕事の判断タイプとは別の項目です。</small></div></div>`;
}

function renderHistoricalMatch(mainId) {
  const figure = historicalFigures[mainId];
  $("historical-match").innerHTML = `<div class="historical-seal">${figure.mark}</div><div class="historical-copy"><h3>${figure.name}</h3><p>${figure.text}</p><small class="historical-note">人物の一面を診断結果に重ねたイメージです。同一人物・同一性格を断定するものではありません。</small></div>`;
}

function renderAbilities(normalized) {
  const baseValues = Object.entries(abilityMap).map(([name, ids]) => {
    let relatedAnswers = 0;
    state.questions.forEach((shownQuestion, index) => {
      const [main, secondary] = state.scoring.questions[shownQuestion.number - 1][state.answers[index]];
      if (ids.includes(main) || ids.includes(secondary)) relatedAnswers += 1;
    });
    return { name, base: ids.reduce((sum, id) => sum + normalized[id], 0) / ids.length, relatedAnswers };
  });
  const average = baseValues.reduce((sum, item) => sum + item.base, 0) / baseValues.length;
  const spread = Math.sqrt(baseValues.reduce((sum, item) => sum + Math.pow(item.base - average, 2), 0) / baseValues.length) || 1;
  const values = baseValues.map(item => ({ ...item, value: Math.max(10, Math.min(95, Math.round(50 + (item.base - average) / spread * 17))) }));
  const topValue = Math.max(...values.map(item => item.value));
  renderAbilityRadar(values);
  const level = value => value >= 75 ? "とても得意" : value >= 60 ? "得意" : value >= 40 ? "標準" : value >= 25 ? "少し苦手" : "後回しにしやすい";
  $("ability-stats").innerHTML = values.map(item => `<div class="ability-stat ${item.value === topValue ? "top" : ""}"><div class="ability-head"><strong>${item.name}</strong><span>${item.value}点</span></div><div class="ability-meter"><span style="width:${item.value}%"></span></div><span class="ability-label">${level(item.value)}</span><p class="ability-reason">25問中${item.relatedAnswers}問で、この力につながる答えを選びました。</p></div>`).join("") + `<p class="ability-guide">あなた自身の6能力の平均を50点として比較しています。75点以上＝とても得意／60〜74点＝得意／40〜59点＝標準／25〜39点＝少し苦手／24点以下＝後回しにしやすい領域</p>`;
}

function renderAbilityRadar(values) {
  const centerX = 180, centerY = 180, radius = 126;
  const point = (index, value = 100) => {
    const angle = -Math.PI / 2 + index * Math.PI / 3;
    const distance = radius * value / 100;
    return [centerX + Math.cos(angle) * distance, centerY + Math.sin(angle) * distance];
  };
  const polygon = amount => values.map((_, index) => point(index, amount).map(number => number.toFixed(1)).join(",")).join(" ");
  const abilityPoints = values.map((item, index) => point(index, item.value));
  const axes = values.map((_, index) => { const [x, y] = point(index); return `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}"/>`; }).join("");
  const dots = abilityPoints.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join("");
  const labels = values.map((item, index) => {
    const [x, y] = point(index, 119);
    const anchor = x < 145 ? "end" : x > 215 ? "start" : "middle";
    return `<text x="${x}" y="${y}" text-anchor="${anchor}"><tspan x="${x}" dy="0">${item.name}</tspan><tspan x="${x}" dy="18" class="radar-score">${item.value}点</tspan></text>`;
  }).join("");
  $("ability-radar").innerHTML = `<div class="radar-result-heading"><span>あなたの能力バランス</span><strong>6能力</strong></div><svg class="radar-chart radar-chart-result" viewBox="0 0 360 360" role="img" aria-label="${values.map(item => `${item.name}${item.value}点`).join("、")}"><g class="radar-grid"><polygon points="${polygon(100)}"/><polygon points="${polygon(75)}"/><polygon points="${polygon(50)}"/><polygon points="${polygon(25)}"/>${axes}</g><polygon class="radar-area" points="${abilityPoints.map(([x, y]) => `${x},${y}`).join(" ")}"/><g class="radar-dots">${dots}</g><g class="radar-labels">${labels}</g></svg><p>外側に広がるほど、その力を使いやすい傾向があります。</p>`;
}

function shareText() {
  const name = $("main-name").textContent;
  const abilities = [...document.querySelectorAll(".ability-stat")].slice(0, 6).map(card => `${card.querySelector("strong").textContent}${card.querySelector(".ability-head span").textContent}`).join("・");
  return `経営者の現在地診断をやってみました。\n私のタイプは「${name}」\n${abilities}\nあなたはどのタイプ？`;
}

function prepareShareLinks() {
  const text = shareText();
  const url = window.location.href.split("#")[0];
  $("line-share").href = `https://line.me/R/msg/text/?${encodeURIComponent(`${text}\n${url}`)}`;
  $("x-share").href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

async function shareResult() {
  const data = { title: "経営者の現在地診断", text: shareText(), url: window.location.href.split("#")[0] };
  if (navigator.share) {
    try { await navigator.share(data); $("share-status").textContent = "共有画面を開きました。"; return; } catch (error) { if (error.name === "AbortError") return; }
  }
  await copyResult();
}

async function copyResult() {
  try { await navigator.clipboard.writeText(`${shareText()}\n${window.location.href.split("#")[0]}`); $("share-status").textContent = "結果をコピーしました。LINEやSNSに貼り付けられます。"; }
  catch { $("share-status").textContent = "コピーできませんでした。LINEまたはXのボタンをお使いください。"; }
}

function fillList(id, items) { $(id).innerHTML = items.map(item => `<li>${item}</li>`).join(""); }

function renderIssues() {
  const selected = state.selectedIssues.filter(issue => issue !== "特にない");
  const communication = Number($("communication-frequency").value);
  const absence = Number($("absence-impact").value);
  if (communication >= 2 && !selected.includes("言語化")) selected.push("言語化");
  if (absence >= 3 && !selected.includes("継続運営")) selected.push("継続運営");
  state.computedIssues = selected;
  if (!selected.length) {
    $("issue-result").innerHTML = `<p>今回の簡易確認では、強い課題は特定されませんでした。タイプ上の注意点と、現在困っていることは別々に扱います。</p>`;
    return;
  }
  $("issue-result").innerHTML = `<div class="issue-tags">${selected.map(issue => `<span class="issue-tag">${issue}</span>`).join("")}</div><p>これはタイプから決めた弱点ではなく、最後の回答から確認した現在の課題候補です。実際の提案前には、具体的な出来事をもう一問確認します。</p>`;
}

function renderRecommendation() {
  const storyFit = state.computedIssues.some(issue => ["構想整理", "言語化"].includes(issue)) && ["構想", "検証", "立上げ", "転換"].includes(state.stage) && state.audience !== "特にいない";
  const issue = state.computedIssues[0] || "頭の中にある構想の共有";
  const audience = state.audience && state.audience !== "特にいない" ? state.audience : "社員や協力者";
  const heading = storyFit
    ? `その事業構想を、${audience}が動ける物語にしませんか？`
    : `あなたの考えは、${audience}に同じ景色として伝わっていますか？`;
  const diagnosis = storyFit
    ? `今回の回答では「${issue}」が現在の課題として表れています。構想そのものが弱いのではなく、頭の中の未来を他人が理解し、行動できる形へ変える部分に改善の余地があります。`
    : `今回の中心課題は「${issue}」です。直接の解決策が事業計画小説とは限りません。ただ、経営者の考えを社員・採用候補・顧客と共有する必要があるなら、構想を物語にする方法が役立つ可能性があります。`;
  $("recommendation").innerHTML = `<p class="eyebrow">診断から見えた次の一歩</p><h2>${heading}</h2><p class="recommendation-diagnosis">${diagnosis}</p><div class="story-bridge"><strong>事業計画小説とは</strong><p>経営者の頭の中にある事業構想を、登場人物の体験を通して第三者が理解できる物語へ変えるものです。事業計画書の代わりではなく、社員への共有、採用、顧客への世界観説明などを助けます。</p></div><div class="recommendation-actions"><a class="button recommendation-link" href="./story-preview.html">実物の第1章・第1話を無料で読む</a><a class="recommendation-sub-link" href="./story-plan.html">事業計画小説の仕組みを見る</a></div><p class="recommendation-note">売り込みではありません。まず実物を読み、自分の事業にも使えそうか確かめてください。</p>`;
}

function reset() {
  state.answers = []; state.index = 0; state.selectedIssues = []; state.computedIssues = [];
  document.querySelectorAll(".issue-chip").forEach(chip => chip.classList.remove("selected"));
  show("landing");
}

init();

