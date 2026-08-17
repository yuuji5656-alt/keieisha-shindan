// prototype-v4 UI（画面表示・進行制御のみ）。
// 採点・タイプ判定・8軸・課題判定・小説提案条件は prototype-v5/data.js に分離し、
// index.html で ../prototype-v5/data.js を app.js より先に読み込むことで、
// TYPES / AXES / BASE / CHECKS / scoreTypes / isNearTie / buildExtraQuestion /
// normalizedAxes / scoreIssues / storyOfferEligible をグローバルに共有している。
// 採点ロジックの単体テストは prototype-v5/test-*.js（require('./data.js')）で行う。
//
// 2026-08-18 v5統合：基本質問12問→15問、タイプ得点は「主タイプ1つに+1」のフラット加算、
// 8軸はタイプ得点と独立に集計、接戦時の追加質問は最大2問（旧v4は最大1問）に変更。

const ISSUE_COPY = {
  構想整理: "やることを一つに絞り、順番を決めること",
  言語化: "考えを、相手に同じように伝えること",
  営業: "お客さんに見つけてもらい、選んでもらうこと",
  組織運営: "人と仕事の回し方を整えること",
};

const state = { idx: 0, answers: [], typeLog: [], extraQuestions: [], checkIndex: 0, checkChoices: [], issues: {}, name: "あなた", stage: "", audience: "" };
const $ = s => document.querySelector(s);
function show(id) { document.querySelectorAll('.screen').forEach(el => el.classList.remove('active')); $('#' + id).classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }

function currentQuestions() { return [...BASE, ...state.extraQuestions]; }

function renderQuestion() {
  const questions = currentQuestions();
  const x = questions[state.idx];
  $('#count').textContent = `${state.idx + 1}問目 / ${questions.length}問`;
  $('#chapter').textContent = state.idx < 5 ? 'いつもの決め方' : state.idx < 10 ? '仕事が動いたとき' : 'これからを考えるとき';
  $('#bar').style.width = `${(state.idx + 1) / questions.length * 100}%`;
  $('#scene').textContent = `場面：${x.scene}`;
  $('#question').textContent = x.q;
  $('#talk').textContent = ['正解を探さなくて大丈夫。', '理想より、いつもの選び方で。', 'ぱっと近い方を選んでね。'][state.idx % 3];
  $('#back').hidden = state.idx === 0;
  $('#answers').innerHTML = '';
  x.a.forEach((label, i) => {
    const b = document.createElement('button');
    b.innerHTML = `<b>${'ABCD'[i]}</b>${label}`;
    b.onclick = () => selectAnswer(x, i);
    $('#answers').appendChild(b);
  });
}

function selectAnswer(x, i) {
  state.answers.push({ id: x.id, q: x.q, a: x.a[i], type: x.type[i] });
  state.typeLog.push(x.type[i]);
  state.idx++;
  const questions = currentQuestions();
  if (state.idx < questions.length) { renderQuestion(); return; }
  // 全ての現時点の質問に回答済み。接戦なら追加質問（最大2問）を出す。
  const ranks = scoreTypes(state.typeLog);
  if (isNearTie(ranks) && state.extraQuestions.length < 2) {
    const top2 = ranks.slice(0, 2).map(r => r[0]);
    const q = buildExtraQuestion(top2, state.extraQuestions.length);
    state.extraQuestions.push({ ...q, id: 'extra' + (state.extraQuestions.length + 1) });
    renderQuestion();
    return;
  }
  startChecks();
}

function undo() {
  if (!state.idx) return;
  state.idx--;
  state.answers.pop();
  state.typeLog.pop();
  // 基本質問の範囲まで戻った場合、既に生成済みの追加質問は前提が変わりうるため作り直す。
  if (state.idx < BASE.length) state.extraQuestions = [];
  renderQuestion();
}

function startChecks() { state.checkIndex = 0; state.checkChoices = []; show('check'); renderCheck(); }
function renderCheck() {
  const c = CHECKS[state.checkIndex];
  $('#checkStep').textContent = `現在の確認 ${state.checkIndex + 1} / ${CHECKS.length}`;
  $('#checkQuestion').textContent = c.q;
  $('#checkAnswers').innerHTML = '';
  c.a.forEach((label, i) => {
    const b = document.createElement('button');
    b.innerHTML = `<b>${'ABCD'[i]}</b>${label}`;
    b.onclick = () => {
      state.checkChoices[state.checkIndex] = i;
      state.checkIndex++;
      if (state.checkIndex < CHECKS.length) renderCheck(); else renderResult();
    };
    $('#checkAnswers').appendChild(b);
  });
}
function checkBack() {
  if (!state.checkIndex) { show('quiz'); undo(); return; }
  state.checkIndex--;
  state.checkChoices.pop();
  renderCheck();
}

function evidenceFor(main) { return state.answers.filter(a => a.type === main).slice(0, 3); }

function issueSummary() {
  const issues = scoreIssues(state.checkChoices);
  state.issues = issues;
  const entries = Object.entries(issues).filter(([, v]) => v.score > 0).sort((a, b) => b[1].score - a[1].score);
  const first = entries[0];
  if (!first) {
    return { title: '大きな詰まりは、まだはっきりしていません', text: '今は、診断で見えた強みを一つ伸ばす準備の時期かもしれません。次に止まりそうな仕事を一つだけ先回りして整えてみてください。', story: false };
  }
  const [label, data] = first;
  const copy = ISSUE_COPY[label] || label;
  let text = `今回の3つの確認では、「${copy}」が今の課題候補として出ました。`;
  text += data.status === '確認できた' ? '複数の回答に同じ傾向があったため、優先して見てよさそうです。' : '答えは一つだけなので、まずは参考として小さく確かめてください。';
  // urgentPrimaryIssue（緊急の資金繰り・法務・人事問題が主課題）は、現在の課題確認3問では
  // 収集していないため常にfalse扱い。この条件を実際に機能させるには専用の設問が必要
  // （引き継ぎ文書の未完了事項に記載）。
  const story = storyOfferEligible({ issues, stage: state.stage, audience: state.audience, urgentPrimaryIssue: false });
  return { title: `今、先に整えたいのは\n${copy}`, text, story, label, status: data.status };
}

function renderResult() {
  const ranks = scoreTypes(state.typeLog);
  const main = ranks[0][0], t = TYPES[main], second = TYPES[ranks[1][0]];
  const near = isNearTie(ranks);
  const axes = normalizedAxes(state.typeLog.slice(0, BASE.length));
  const issue = issueSummary();
  state.result = { main, axes, issue };
  $('#resultName').textContent = state.name;
  $('#mainType').textContent = t.name;
  $('#tagline').textContent = t.tag;
  $('#mix').textContent = near ? `「${second.name}」の傾向も近く出ています。いまの会社・局面での混ざり方として見てください。` : '今回の回答では、この傾向が中心に出ています。';
  $('#axisList').innerHTML = AXES.map((name, i) => `<span><b>${name}</b><strong>${axes[i]}</strong><small>今回の回答傾向</small></span>`).join('');
  drawRadar(axes);
  const ev = evidenceFor(main);
  $('#reasonIntro').textContent = `「${t.name}」に近い選び方が、次の回答で特に表れていました。`;
  $('#evidence').innerHTML = ev.map(a => `<article><p>質問：${a.q}</p><b>あなたの回答：${a.a}</b></article>`).join('');
  $('#strengthTitle').textContent = t.strength;
  $('#strength').textContent = '今回の回答では、このような場面で強みが使われやすい傾向が出ています。';
  $('#risk').textContent = t.risk;
  $('#issueTitle').textContent = issue.title;
  $('#issues').innerHTML = Object.entries(state.issues).filter(([, v]) => v.score > 0).map(([k, v]) => `<span>${k}（${v.status}）</span>`).join('') || '<span>今は大きな詰まりなし</span>';
  $('#issueText').textContent = issue.text;
  $('#actionTitle').textContent = t.action;
  $('#actionText').textContent = t.actionText;
  if (issue.story) {
    $('#storyOffer').hidden = false; $('#otherOffer').hidden = true;
    $('#storyReason').textContent = `「${issue.label}」が複数の回答で出ていて、${state.audience}へ構想を伝えたい時期でもあります。だから、いきなり商品をすすめるのではなく、まず無料の見本で「物語にすると何が変わるか」を確認してください。`;
  } else {
    $('#storyOffer').hidden = true; $('#otherOffer').hidden = false;
    $('#otherTitle').textContent = issue.label === '営業' ? 'まずは、お客さんの声を一つ集める' : issue.label === '組織運営' ? 'まずは、任せる仕事を一つ決める' : '診断の結果を、今週の行動へ';
    $('#otherText').textContent = '今の回答では、まず足元の課題を小さく確かめる段階です。事業計画小説は、将来の構想を人へ伝える必要が生まれたときの選択肢として、下のページからいつでも読めます。';
  }
  show('result');
}

function drawRadar(values) {
  const c = $('#radar'), ctx = c.getContext('2d'), w = c.width, h = c.height, cx = w / 2, cy = h / 2 + 12, R = 164, n = AXES.length;
  ctx.clearRect(0, 0, w, h); ctx.font = '600 15px "Yu Gothic",sans-serif'; ctx.textAlign = 'center';
  for (let ring = 1; ring <= 4; ring++) { ctx.beginPath(); AXES.forEach((_, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / n, r = R * ring / 4, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.strokeStyle = '#d9d0c0'; ctx.stroke(); }
  AXES.forEach((name, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / n; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.strokeStyle = '#e4ddd1'; ctx.stroke(); ctx.fillStyle = '#234738'; ctx.fillText(name, cx + Math.cos(a) * (R + 38), cy + Math.sin(a) * (R + 30) + 5); });
  ctx.beginPath(); values.forEach((v, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / n, r = R * v / 100, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.fillStyle = 'rgba(211,118,77,.36)'; ctx.fill(); ctx.strokeStyle = '#cf714c'; ctx.lineWidth = 4; ctx.stroke();
}

function share() {
  const main = TYPES[state.result.main], url = new URL('share-result.html', location.href);
  url.searchParams.set('type', state.result.main);
  url.searchParams.set('name', state.name);
  url.searchParams.set('axes', state.result.axes.join(','));
  return { url: url.href, text: `私は「${main.name}」でした。${main.tag}\nねこ社長の経営の現在地診断` };
}

if (typeof document !== 'undefined') {
  $('#startBtn').onclick = () => show('profile');
  $('#profileNext').onclick = () => { state.name = $('#name').value.trim() || 'あなた'; state.stage = $('#stage').value; state.audience = $('#audience').value; show('quiz'); renderQuestion(); };
  $('#back').onclick = undo;
  $('#checkBack').onclick = checkBack;
  $('#retry').onclick = () => location.reload();
  $('#nativeShare').onclick = async () => { const d = share(); if (navigator.share) await navigator.share({ title: 'ねこ社長の経営の現在地診断', text: d.text, url: d.url }); else copy(); };
  $('#lineShare').onclick = () => { const d = share(); open('https://line.me/R/msg/text/?' + encodeURIComponent(d.text + '\n' + d.url), '_blank'); };
  $('#xShare').onclick = () => { const d = share(); open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(d.text) + '&url=' + encodeURIComponent(d.url), '_blank'); };
  async function copy() { const d = share(); await navigator.clipboard.writeText(d.text + '\n' + d.url); $('#shareStatus').textContent = 'リンクをコピーしました。'; }
  $('#copyShare').onclick = copy;
}
