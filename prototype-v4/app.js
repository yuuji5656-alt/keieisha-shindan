const AXES = ["新しいこと", "長く残すこと", "商品を磨くこと", "人を動かすこと", "市場を見ること", "数字を整えること", "自分の構想", "周りへの役立ち"];
const TYPES = {
  T01:{name:"新しい道をつくる型",tag:"まだない仕事を、最初の形にする。",profile:[3,0,0,1,2,0,1,0],strength:"新しいお客さんの困りごとや、まだ形になっていない機会を見つける場面です。",risk:"案が増えるほど、人とお金が分かれ、途中の仕事が残りやすくなります。",action:"今期に試す案を一つに絞る",actionText:"候補ごとに「誰のため・いつまでに試すか・やめる条件」を3行で書いてください。"},
  T02:{name:"回る仕組みをつくる型",tag:"自分がいなくても、続く形に整える。",profile:[0,3,0,1,0,3,0,0],strength:"人の頑張りだけに頼らず、同じ成果が続くように手順や数字を整える場面です。",risk:"整えることを急ぐと、現場の声や新しい試みを小さくしてしまうことがあります。",action:"止まりやすい仕事を一つ選ぶ",actionText:"自分がいないと止まる仕事を一つだけ挙げ、判断の基準と担当を紙に書きます。"},
  T03:{name:"仲間を増やして進む型",tag:"役割を渡し、チームで前へ進める。",profile:[1,1,0,3,0,1,0,1],strength:"採用、役割分担、責任者づくりなど、多くの人の力を同じ方向へ集める場面です。",risk:"人数を増やすことが目的になると、利益や一人ひとりの納得が見えにくくなります。",action:"次に任せる役割を一つ決める",actionText:"作業ではなく「何を良くする責任か」を一文にして、期限と一緒に渡してください。"},
  T04:{name:"売れる場所を見つける型",tag:"反応を見て、勝ち筋を早くつかむ。",profile:[1,0,1,0,3,1,0,0],strength:"お客さんの反応、売り方、値段、場所を見ながら、小さく試して切り替える場面です。",risk:"目先の反応だけを追うと、商品やお客さんとの長い関係が残りにくくなります。",action:"最近のお客さんに一人だけ聞く",actionText:"「何が決め手でしたか」と聞き、答えを次の売り方に一つだけ反映してください。"},
  T05:{name:"思いを形にする型",tag:"自分が見たい未来を、仕事に変える。",profile:[2,2,1,1,0,0,3,1],strength:"目先の効率だけではなく、実現したい未来を軸に、長く集中する場面です。",risk:"構想が大きいほど、反対意見や数字の確認を後回しにしやすくなります。",action:"変えないことと変えることを分ける",actionText:"守りたい目的を一つ、試して変えてよい方法を一つ、言葉にして並べてください。"},
  T06:{name:"お金の使い方を考える型",tag:"投資と回収から、次の一手を決める。",profile:[1,1,0,0,1,3,0,0],strength:"資金をどこへ使い、いつ回収するかを考え、事業を大きく動かす場面です。",risk:"数字や条件だけを急ぐと、商品を使う人や現場の準備が置き去りになることがあります。",action:"次の投資の条件を一枚にする",actionText:"お金を使う前に「お客さんに起きる変化・回収の目安・やめる条件」を並べます。"},
  T07:{name:"いいものを磨く型",tag:"細かな違いを、信頼に変える。",profile:[0,2,3,0,1,0,1,0],strength:"商品やサービスの細部を見て、実際に受け取る価値を高める場面です。",risk:"納得できるまで出せず、売る・任せる・改善を早く回す時期が遅れやすくなります。",action:"お客さんに見せる日を決める",actionText:"完成を待たず、今週中に一人へ見せて、直す点を一つだけ受け取ってください。"},
  T08:{name:"困りごとを仕事で変える型",tag:"誰かの困りごとを、続く仕事にする。",profile:[1,2,0,1,0,1,1,3],strength:"利益だけでは見過ごされやすい困りごとを見つけ、周りと力を合わせる場面です。",risk:"役に立ちたい思いが強いほど、続けるための値段や優先順位が曖昧になりがちです。",action:"助けたい一人と、続く値段を書く",actionText:"助けたい相手を一人決め、その人に起きてほしい変化と、誰が払うかを一行ずつ書きます。"},
  T09:{name:"言葉で人を集める型",tag:"自分の声を、仲間と機会につなげる。",profile:[1,0,0,3,2,0,2,1],strength:"自分の経験や考えを言葉にし、採用、営業、仲間集めの最初の力にする場面です。",risk:"社長本人に頼るほど、本人がいないと営業や採用が進まない状態になりやすいです。",action:"自分以外が話せる材料を残す",actionText:"お客さんの声、会社の考え、事例のどれか一つを、仲間が使える形で残してください。"},
  T10:{name:"大切なものを残す型",tag:"信用と関係を、次の世代へつなぐ。",profile:[0,3,1,1,0,1,0,3],strength:"社員、取引先、地域との長い関係を守り、会社を続ける土台をつくる場面です。",risk:"関係を壊したくない思いから、変えるべき仕事や赤字を残し続けることがあります。",action:"守ることと、変えることを一つずつ決める",actionText:"絶対に残したい関係を一つ選び、そのために今年変える仕事を一つ決めてください。"}
};

// 同じ種類の質問が続かないよう、経営の短い場面を12個に分けている。
const BASE = [
 {id:"q1",scene:"主力の仕事が安定したとき",q:"来期も利益が出そうです。次に力を入れたいのは？",a:["別の困りごとを探し、新しい仕事を小さく始める","手順を整え、自分がいなくても回るようにする","仲間を増やし、もっと大きなチームで進める","今の商品を、もっと選ばれるものに磨く"],v:[[2,0,0,0,1,0,1,0],[0,2,0,0,0,2,0,0],[1,1,0,2,0,0,0,1],[0,1,2,0,1,0,0,0]]},
 {id:"q2",scene:"売上が急に落ちたとき",q:"最初に何を確かめますか？",a:["お客さんが離れた理由を聞く","今月と来月のお金の動きを見る","現場で同じ困りごとが起きていないか見る","別の売り方や場所を小さく試す"],v:[[0,0,1,0,2,0,0,1],[0,1,0,0,0,3,0,0],[0,1,2,1,0,1,0,1],[2,0,0,0,3,0,0,0]]},
 {id:"q3",scene:"新しい商品を出す前",q:"7割できました。あなたならどうしますか？",a:["少人数に先に見せて、反応を聞く","納得できるまで細かく直してから出す","思いと背景を発信して、待ってくれる人を集める","利益が出る形を計算してから決める"],v:[[1,0,1,0,3,0,0,1],[0,1,3,0,0,0,1,0],[1,0,0,2,1,0,2,0],[0,1,0,0,0,3,0,0]]},
 {id:"q4",scene:"人手が足りなくなったとき",q:"一番先にやることは？",a:["仕事を分けて、任せる人を決める","手順を減らし、少人数でも回るようにする","自分で会社の魅力を伝え、仲間を集める","今の仕事を絞り、新しいやり方を試す"],v:[[0,1,0,3,0,0,0,1],[0,2,0,1,0,2,0,0],[0,0,0,3,1,0,1,0],[2,0,0,0,2,1,0,0]]},
 {id:"q5",scene:"大きな投資の話がきたとき",q:"進めるか決める前に、何を一番見ますか？",a:["お客さんにどんな良さが残るか","回収できる時期と、悪い時の止め方","社員や責任者が無理なく動けるか","自分たちが目指す未来に近づくか"],v:[[0,1,2,0,1,1,1,0],[0,1,0,0,0,3,0,0],[0,1,0,3,0,1,0,1],[1,2,0,0,0,0,3,1]]},
 {id:"q6",scene:"ライバルが安い商品を出したとき",q:"最初の一手は？",a:["お客さんが比べている点を聞く","品質で違いが分かる所を磨く","値段や売り場を変えて、すぐ反応を見る","自分たちらしい価値を守るか考える"],v:[[0,0,1,0,2,0,0,1],[0,1,3,0,0,0,1,0],[1,0,0,0,3,1,0,0],[0,2,1,0,0,0,3,0]]},
 {id:"q7",scene:"社長が1か月いないとき",q:"一番心配なのは？",a:["誰が何を決めるかが曖昧なこと","大事なお客さんとの関係が切れること","自分が話さないと会社の思いが伝わらないこと","新しいチャンスを見逃すこと"],v:[[0,2,0,3,0,1,0,0],[0,3,0,1,0,0,0,3],[0,1,0,2,0,0,3,1],[3,0,0,0,2,0,1,0]]},
 {id:"q8",scene:"会社が話題になったとき",q:"次に一番大事にしたいのは？",a:["注文が増えても、いいものを出し続けること","勢いのある今に、売れる場所を増やすこと","会社の考えを自分の言葉で伝えること","人と仕組みを整え、長く続けること"],v:[[0,1,3,0,1,0,1,0],[1,0,0,0,3,1,0,0],[0,0,0,3,2,0,2,0],[0,3,0,2,0,2,0,1]]},
 {id:"q9",scene:"地域から相談を受けたとき",q:"採算が難しくても必要な仕事だと言われました。",a:["続けられる値段と、役に立った証拠を考える","昔からの関係を守れる方法を探す","別の地域でも成り立つ新しい事業にできるか試す","会社の新しい物語として人に伝える"],v:[[0,2,0,1,0,1,1,3],[0,3,0,1,0,0,0,3],[3,0,0,0,1,1,0,2],[1,1,0,2,1,0,3,1]]},
 {id:"q10",scene:"赤字の仕事を見直すとき",q:"最後に残す判断のものさしは？",a:["数字が戻るまでの期限と、やめる条件","大事なお客さんや社員にどう伝えるか","今後の構想に本当に必要な仕事か","商品としてまだ良くできる余地があるか"],v:[[1,1,0,0,1,3,0,0],[0,3,0,2,0,0,1,2],[2,2,0,0,0,1,3,1],[0,1,3,0,1,0,1,0]]},
 {id:"q11",scene:"大きな成功のあと",q:"次に一番わくわくするのは？",a:["知らない分野で、新しい仕事をつくる","人やお金を使い、会社を大きく動かす","長年思い描いたものを完成させる","会社を次の世代に渡せる形にする"],v:[[3,0,0,1,1,1,2,0],[1,1,0,2,1,3,0,0],[1,2,1,0,0,0,3,1],[0,3,0,1,0,1,0,3]]},
 {id:"q12",scene:"仕事を続ける理由を考えたとき",q:"最後に残したいものに一番近いのは？",a:["まだない選択肢を世の中に増やしたい","自分がいなくても回る、強い会社","誰かが使ってよかったと思える商品","人や地域に残る、長い信用"],v:[[3,1,0,1,1,0,2,1],[0,3,0,1,0,3,0,1],[0,1,3,0,1,0,1,1],[0,3,0,1,0,0,0,3]]}
];

const CHECKS = [
 {id:"c1",q:"いま、一番近い困りごとは？",a:["頭の中に案が多く、何からやるか決めにくい","考えはあるのに、人へうまく伝わらない","お客さんを増やす・売ることが難しい","人・お金・仕事の回し方を整えたい"],score:["構想整理","言語化","営業","組織運営"]},
 {id:"c2",q:"直近3か月で、構想を話した後に「人によって受け取り方が違う」と感じたことは？",a:["ほとんどない","1回あった","2〜3回あった","何度もあった"],score:[null,"言語化","言語化","言語化"],points:[0,1,2,3]},
 {id:"c3",q:"今期、何を一番先に進めるかを、周りへ同じように説明できますか？",a:["誰に何をしてほしいかまで言える","相手は決まっているが、話す内容は曖昧","まだ一つに絞れていない","今は伝える相手がいない"],score:[null,"構想整理","構想整理",null],points:[0,1,3,0]}
];

const state = {idx:0, answers:[], axes:Array(8).fill(0), checks:[], issues:{}, extra:[], name:"あなた", stage:"", audience:""};
const $ = s => document.querySelector(s);
function show(id){ document.querySelectorAll('.screen').forEach(el=>el.classList.remove('active')); $('#'+id).classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
function renderQuestion(){ const questions=[...BASE,...state.extra], x=questions[state.idx]; $('#count').textContent=`${state.idx+1}問目 / ${questions.length}問`; $('#chapter').textContent=state.idx<4?'いつもの決め方':state.idx<8?'仕事が動いたとき':'これからを考えるとき'; $('#bar').style.width=`${(state.idx+1)/questions.length*100}%`; $('#scene').textContent=`場面：${x.scene}`; $('#question').textContent=x.q; $('#talk').textContent=['正解を探さなくて大丈夫。','理想より、いつもの選び方で。','ぱっと近い方を選んでね。'][state.idx%3]; $('#back').hidden=state.idx===0; $('#answers').innerHTML=''; x.a.forEach((label,i)=>{const b=document.createElement('button');b.innerHTML=`<b>${'ABCD'[i]}</b>${label}`;b.onclick=()=>selectAnswer(x,i);$('#answers').appendChild(b)}); }
function selectAnswer(x,i){ state.answers.push({id:x.id,q:x.q,a:x.a[i],vec:x.v[i]}); state.axes=state.axes.map((n,k)=>n+x.v[i][k]); state.idx++; const all=[...BASE,...state.extra]; if(state.idx<all.length){renderQuestion();return;} if(!state.extra.length && needsExtra()) { addExtra(); state.idx=BASE.length; renderQuestion(); return; } startChecks(); }
function undo(){ if(!state.idx)return; state.idx--; const last=state.answers.pop(); state.axes=state.axes.map((n,k)=>n-last.vec[k]); renderQuestion(); }
const AXIS_BASELINE = AXES.map((_, axis) => BASE.reduce((sum, q) => sum + q.v.reduce((s, v) => s + v[axis], 0) / q.v.length, 0));
const TYPE_SPREAD = Object.fromEntries(Object.entries(TYPES).map(([id,t])=>{const weight=t.profile.reduce((sum,p)=>sum+p,0);const variance=BASE.reduce((sum,q)=>{const values=q.v.map(v=>v.reduce((s,n,i)=>s+n*t.profile[i],0)/weight);const mean=values.reduce((s,n)=>s+n,0)/values.length;return sum+values.reduce((s,n)=>s+(n-mean)**2,0)/values.length;},0);return[id,Math.sqrt(variance)||1];}));
// scoreAxes/isNearTie/buildExtraQuestion は state に依存しない純粋関数として切り出し、
// prototype-v4/test-scores.js・prototype-v4/test-type-patterns.js から require('./app.js') で
// 本番と同じ採点ロジックを直接検証できるようにしている（2026-08-18、採点検証のため）。
function scoreAxes(axes){ return Object.entries(TYPES).map(([id,t])=>{const weight=t.profile.reduce((sum,p)=>sum+p,0);const raw=t.profile.reduce((sum,p,i)=>sum+p*(axes[i]-AXIS_BASELINE[i]),0)/weight;return[id,raw/TYPE_SPREAD[id]];}).sort((a,b)=>b[1]-a[1]); }
function typeScores(){ return scoreAxes(state.axes); }
// 各タイプについて、BASE12問で理論上取りうる最大・最小の「raw」(正規化=TYPE_SPREAD除算前の値)と
// 「final」(TYPE_SPREAD除算後、実際の順位付けに使う値)を、各設問ごとの最良/最悪選択肢を貪欲に選んで算出する。
// 12問の raw は「Σ_問 profile・(選択肢-baseline)」の合計を weight で割った値の線形和なので、
// 設問ごとの貪欲選択の合計がそのまま全体の理論最大・最小になる（設問間に相互作用がないため）。
const TYPE_RANGE = Object.fromEntries(Object.entries(TYPES).map(([id,t])=>{
  const weight=t.profile.reduce((s,p)=>s+p,0);
  const baselineDot=t.profile.reduce((s,p,i)=>s+p*AXIS_BASELINE[i],0);
  let maxSum=0,minSum=0;
  BASE.forEach(q=>{const dots=q.v.map(v=>v.reduce((s,n,i)=>s+n*t.profile[i],0));maxSum+=Math.max(...dots);minSum+=Math.min(...dots);});
  const rawMax=(maxSum-baselineDot)/weight, rawMin=(minSum-baselineDot)/weight;
  return [id,{rawMax,rawMin,finalMax:rawMax/TYPE_SPREAD[id],finalMin:rawMin/TYPE_SPREAD[id]}];
}));
// 固定基準の「正規化後5点未満なら混合傾向」は、scoring.md旧モデルの0〜100点表示を前提にした閾値。
// v4のfinal値(raw/TYPE_SPREAD)は理論上の全体レンジがおよそ-5〜+5程度しかなく、この閾値をそのまま
// 適用すると常に「5点未満」＝常に混合傾向・常に追加質問という状態になってしまう(2026-08-18に発見)。
// 順位そのもの(scoreAxesの並び順)は変えず、10タイプ全体で共有する単一の線形換算(0〜100)だけを
// 追加し、この換算後の値に対して固定基準の「5点未満」を適用することで、閾値の意図(僅差だけを
// 混合扱いにする)を保ったまま、実際のスコアの尺度に合わせている。
const SCORE_SCALE_MIN = Math.min(...Object.values(TYPE_RANGE).map(r=>r.finalMin));
const SCORE_SCALE_MAX = Math.max(...Object.values(TYPE_RANGE).map(r=>r.finalMax));
function toDisplayScale(finalValue){ return (finalValue-SCORE_SCALE_MIN)/(SCORE_SCALE_MAX-SCORE_SCALE_MIN)*100; }
function isNearTie(ranks){ return toDisplayScale(ranks[0][1])-toDisplayScale(ranks[1][1]) < 5; }
function needsExtra(){ return isNearTie(typeScores()); }
const EXTRA_MAP = {
  'T01-T04':{scene:'新しい売り方が伸びたあと',q:'半年後に反応が落ちました。どうしたい？',a:['別の場所へすぐ移る','一つの事業として育て直す'],v:[[1,0,0,0,3,0,0,0],[3,1,0,0,1,0,1,0]]},
  'T02-T06':{scene:'成長のためのお金を使うとき',q:'より気持ちが動くのは？',a:['会社の中の仕組みを強くする','外からお金を集め、大きく動かす'],v:[[0,3,0,1,0,3,0,0],[1,1,0,0,1,3,0,0]]},
  'T05-T09':{scene:'大事な話を広めるとき',q:'一番ほしいのは？',a:['構想を本当に形にする仲間','自分の言葉に共感する多くの人'],v:[[1,2,0,1,0,0,3,1],[0,0,0,3,2,0,2,1]]},
  'T08-T10':{scene:'続けるために迷ったとき',q:'最後に守りたいのは？',a:['困っている人に起きる変化','今いる社員や取引先との信用'],v:[[0,1,0,1,0,0,1,3],[0,3,0,1,0,1,0,3]]}
};
function buildExtraQuestion(topTwoIds){ const pair=topTwoIds.join('-'); return EXTRA_MAP[pair]||{scene:'迷ったときの最後の確認',q:'より近いのはどちら？',a:[TYPES[topTwoIds[0]].tag,TYPES[topTwoIds[1]].tag],v:[TYPES[topTwoIds[0]].profile,TYPES[topTwoIds[1]].profile]}; }
function addExtra(){ const r=typeScores().slice(0,2).map(x=>x[0]); const x=buildExtraQuestion(r); state.extra.push({...x,id:'extra'+state.extra.length}); }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AXES, TYPES, BASE, CHECKS, AXIS_BASELINE, TYPE_SPREAD, TYPE_RANGE, SCORE_SCALE_MIN, SCORE_SCALE_MAX, EXTRA_MAP, scoreAxes, isNearTie, toDisplayScale, buildExtraQuestion };
}
function startChecks(){state.checkIndex=0;show('check');renderCheck();}
function renderCheck(){const c=CHECKS[state.checkIndex];$('#checkStep').textContent=`現在の確認 ${state.checkIndex+1} / ${CHECKS.length}`;$('#checkQuestion').textContent=c.q;$('#checkAnswers').innerHTML='';c.a.forEach((label,i)=>{const b=document.createElement('button');b.innerHTML=`<b>${'ABCD'[i]}</b>${label}`;b.onclick=()=>{state.checks[state.checkIndex]={...c,choice:i};applyCheck(c,i);state.checkIndex++;if(state.checkIndex<CHECKS.length)renderCheck();else renderResult();};$('#checkAnswers').appendChild(b)});}
function applyCheck(c,i){const key=c.score[i],p=c.points?c.points[i]:2;if(key){state.issues[key]=(state.issues[key]||0)+p;}}
function removeCheck(c,i){const key=c.score[i],p=c.points?c.points[i]:2;if(key)state.issues[key]-=p;}
function checkBack(){if(!state.checkIndex){show('quiz');state.idx=state.answers.length;renderQuestion();return;}state.checkIndex--;const prior=state.checks[state.checkIndex];removeCheck(prior,prior.choice);state.checks.pop();renderCheck();}
function normalizedAxes(){const max=Math.max(...state.axes,1);return state.axes.map(v=>Math.round(25+(v/max)*70));}
function evidenceFor(main){const profile=TYPES[main].profile;return state.answers.map(a=>({a,match:a.vec.reduce((s,v,i)=>s+v*profile[i],0)})).sort((x,y)=>y.match-x.match).slice(0,3);}
function issueSummary(){const items=Object.entries(state.issues).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);const first=items[0]; if(!first)return {title:'大きな詰まりは、まだはっきりしていません',text:'今は、診断で見えた強みを一つ伸ばす準備の時期かもしれません。次に止まりそうな仕事を一つだけ先回りして整えてみてください。',story:false};const evidenceCount=(first[0]==='言語化'?((state.checks[0].choice===1?1:0)+(state.checks[1].choice>=1?1:0)+(state.checks[2].choice===1?1:0)):(first[0]==='構想整理'?((state.checks[0].choice===0?1:0)+(state.checks[2].choice>=1&&state.checks[2].choice<=2?1:0)):1)); const label=first[0]; const copy={構想整理:'やることを一つに絞り、順番を決めること',言語化:'考えを、相手に同じように伝えること',営業:'お客さんに見つけてもらい、選んでもらうこと',組織運営:'人と仕事の回し方を整えること'}[label]||label;let text=`今回の3つの確認では、「${copy}」が今の課題候補として出ました。`;if(evidenceCount>=2)text+='複数の回答に同じ傾向があったため、優先して見てよさそうです。';else text+='答えは一つだけなので、まずは参考として小さく確かめてください。';const story=(label==='構想整理'||label==='言語化')&&evidenceCount>=2&&['構想','検証','立上げ','転換'].includes(state.stage)&&!!state.audience;return{title:`今、先に整えたいのは\n${copy}`,text,story,label,evidenceCount};}
function renderResult(){const ranks=typeScores(),main=ranks[0][0],t=TYPES[main],second=TYPES[ranks[1][0]],near=isNearTie(ranks),axes=normalizedAxes(),issue=issueSummary();state.result={main,axes,issue};$('#resultName').textContent=state.name;$('#mainType').textContent=t.name;$('#tagline').textContent=t.tag;$('#mix').textContent=near?`「${second.name}」の傾向も近く出ています。いまの会社・局面での混ざり方として見てください。`:'今回の回答では、この傾向が中心に出ています。';$('#axisList').innerHTML=AXES.map((name,i)=>`<span><b>${name}</b><strong>${axes[i]}</strong><small>今回の回答傾向</small></span>`).join('');drawRadar(axes);const ev=evidenceFor(main);$('#reasonIntro').textContent=`「${t.name}」に近い選び方が、次の回答で特に表れていました。`;$('#evidence').innerHTML=ev.map(({a})=>`<article><p>質問：${a.q}</p><b>あなたの回答：${a.a}</b></article>`).join('');$('#strengthTitle').textContent=t.strength;$('#strength').textContent='今回の回答では、このような場面で強みが使われやすい傾向が出ています。';$('#risk').textContent=t.risk;$('#issueTitle').textContent=issue.title;$('#issues').innerHTML=Object.entries(state.issues).filter(([,v])=>v>0).map(([k,v])=>`<span>${k}${v>=3?'（確認できた）':'（参考）'}</span>`).join('')||'<span>今は大きな詰まりなし</span>';$('#issueText').textContent=issue.text;$('#actionTitle').textContent=t.action;$('#actionText').textContent=t.actionText;if(issue.story){$('#storyOffer').hidden=false;$('#otherOffer').hidden=true;$('#storyReason').textContent=`「${issue.label}」が複数の回答で出ていて、${state.audience}へ構想を伝えたい時期でもあります。だから、いきなり商品をすすめるのではなく、まず無料の見本で「物語にすると何が変わるか」を確認してください。`;}else{$('#storyOffer').hidden=true;$('#otherOffer').hidden=false;$('#otherTitle').textContent=issue.label==='営業'?'まずは、お客さんの声を一つ集める':issue.label==='組織運営'?'まずは、任せる仕事を一つ決める':'診断の結果を、今週の行動へ';$('#otherText').textContent='今の回答では、まず足元の課題を小さく確かめる段階です。事業計画小説は、将来の構想を人へ伝える必要が生まれたときの選択肢として、下のページからいつでも読めます。';}show('result');}
function drawRadar(values){const c=$('#radar'),ctx=c.getContext('2d'),w=c.width,h=c.height,cx=w/2,cy=h/2+12,R=164,n=AXES.length;ctx.clearRect(0,0,w,h);ctx.font='600 15px "Yu Gothic",sans-serif';ctx.textAlign='center';for(let ring=1;ring<=4;ring++){ctx.beginPath();AXES.forEach((_,i)=>{const a=-Math.PI/2+i*Math.PI*2/n,r=R*ring/4,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.strokeStyle='#d9d0c0';ctx.stroke()}AXES.forEach((name,i)=>{const a=-Math.PI/2+i*Math.PI*2/n;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);ctx.strokeStyle='#e4ddd1';ctx.stroke();ctx.fillStyle='#234738';ctx.fillText(name,cx+Math.cos(a)*(R+38),cy+Math.sin(a)*(R+30)+5)});ctx.beginPath();values.forEach((v,i)=>{const a=-Math.PI/2+i*Math.PI*2/n,r=R*v/100,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.fillStyle='rgba(211,118,77,.36)';ctx.fill();ctx.strokeStyle='#cf714c';ctx.lineWidth=4;ctx.stroke();}
function share(){const main=TYPES[state.result.main],url=new URL('share-result.html',location.href);url.searchParams.set('type',state.result.main);url.searchParams.set('name',state.name);url.searchParams.set('axes',state.result.axes.join(','));return{url:url.href,text:`私は「${main.name}」でした。${main.tag}\nねこ社長の経営の現在地診断`};}
if (typeof document !== 'undefined') {
$('#startBtn').onclick=()=>show('profile');$('#profileNext').onclick=()=>{state.name=$('#name').value.trim()||'あなた';state.stage=$('#stage').value;state.audience=$('#audience').value;show('quiz');renderQuestion();};$('#back').onclick=undo;$('#checkBack').onclick=checkBack;$('#retry').onclick=()=>location.reload();$('#nativeShare').onclick=async()=>{const d=share();if(navigator.share)await navigator.share({title:'ねこ社長の経営の現在地診断',text:d.text,url:d.url});else copy();};$('#lineShare').onclick=()=>{const d=share();open('https://line.me/R/msg/text/?'+encodeURIComponent(d.text+'\n'+d.url),'_blank');};$('#xShare').onclick=()=>{const d=share();open('https://twitter.com/intent/tweet?text='+encodeURIComponent(d.text)+'&url='+encodeURIComponent(d.url),'_blank');};async function copy(){const d=share();await navigator.clipboard.writeText(d.text+'\n'+d.url);$('#shareStatus').textContent='リンクをコピーしました。';}$('#copyShare').onclick=copy;
}

