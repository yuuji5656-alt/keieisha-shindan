// 採点検証：ランダム分布 + 配点公平性チェック
//
// 「ClaudeCodeへの引き継ぎ_2026-08-18.md」の『採点検証の合格基準（固定）』のうち、
// 次の2項目をこのファイルで検証する。
//   - ランダム回答を10万回以上、各設問の各選択肢を等確率で選んで実行し、
//     各タイプの第1位出現率が5%以上15%以下であること。
//   - 各タイプに寄与する基本設問数・追加設問数・理論上の最大獲得点・
//     正規化前後の計算式を一覧で出し、正規化前の理論上の最大獲得点は、
//     最大タイプと最小タイプの差が最小タイプ基準で10%以内であること
//     （正規化だけで見かけを揃えて合格にしない）。
//
// 「理論上の最大獲得点（正規化前）」の定義（引き継ぎ文書に数値の定義がないため、
// このファイルで採用した暫定定義。詳細はClaudeCodeへの引き継ぎ_2026-08-18.mdに転記）：
//   app.js の scoreAxes() は各タイプについて
//     raw   = Σ_axis profile[axis] * (axes[axis] - AXIS_BASELINE[axis]) / weight
//     final = raw / TYPE_SPREAD[id]   … これを実際の順位付けに使う
//   という二段階の計算を行っている。「正規化」とは TYPE_SPREAD による除算を指すとみなし、
//   「正規化前の理論上の最大獲得点」= raw の理論上の最大値（TYPE_SPREAD除算前）とする。
//   BASE12問の raw は設問ごとの寄与の単純な合計であり、設問間に相互作用がないため、
//   各設問で profile との内積が最大になる選択肢を選び続けた場合の合計が、その型の理論最大値になる。
//   （app.js の TYPE_RANGE がこの値を rawMax として保持している。）
const { BASE, TYPES, EXTRA_MAP, TYPE_RANGE, scoreAxes } = require('./app.js');

const TRIALS = 300000; // 固定基準は「10万回以上」。余裕を持たせ30万回で実施する。

function randomTrialDistribution(trials) {
  const counts = Object.fromEntries(Object.keys(TYPES).map(k => [k, 0]));
  for (let n = 0; n < trials; n++) {
    const axes = Array(8).fill(0);
    for (const q of BASE) {
      const v = q.v[Math.floor(Math.random() * q.v.length)];
      for (let i = 0; i < axes.length; i++) axes[i] += v[i];
    }
    const ranks = scoreAxes(axes);
    counts[ranks[0][0]]++;
  }
  return counts;
}

function basicQuestionCoverage(id) {
  // そのタイプの profile と、各設問の選択肢群との内積が選択肢によって変化する
  // （＝その設問の回答がこのタイプの得点に影響しうる）設問だけを数える。
  const profile = TYPES[id].profile;
  return BASE.filter(q => {
    const dots = q.v.map(v => v.reduce((s, n, i) => s + n * profile[i], 0));
    return Math.max(...dots) !== Math.min(...dots);
  }).length;
}

function extraQuestionCoverage(id) {
  return Object.keys(EXTRA_MAP).filter(pair => pair.split('-').includes(id)).length;
}

function main() {
  console.log(`=== ランダム等確率分布（${TRIALS.toLocaleString()}回） ===`);
  const counts = randomTrialDistribution(TRIALS);
  const distRows = {};
  let distPass = true;
  const distFailures = [];
  for (const [id, c] of Object.entries(counts)) {
    const pct = (c / TRIALS) * 100;
    const ok = pct >= 5 && pct <= 15;
    if (!ok) { distPass = false; distFailures.push(`${id}: ${pct.toFixed(2)}%`); }
    distRows[id] = { '出現回数': c, '出現率': pct.toFixed(2) + '%', '判定(5〜15%)': ok ? 'PASS' : 'FAIL' };
  }
  console.table(distRows);
  console.log(distPass ? '→ 分布テスト: PASS（全タイプ5〜15%以内）' : `→ 分布テスト: FAIL（${distFailures.join(', ')}）`);

  console.log('\n=== タイプ別 寄与設問数・理論上の最大獲得点（正規化前後） ===');
  const table = {};
  for (const id of Object.keys(TYPES)) {
    const r = TYPE_RANGE[id];
    table[id] = {
      '名称': TYPES[id].name,
      '基本設問数(寄与)': `${basicQuestionCoverage(id)}/12`,
      '追加設問数(専用境界)': extraQuestionCoverage(id),
      '理論最大(正規化前 raw)': r.rawMax.toFixed(3),
      '理論最小(正規化前 raw)': r.rawMin.toFixed(3),
      '理論最大(正規化後 final)': r.finalMax.toFixed(3),
      '理論最小(正規化後 final)': r.finalMin.toFixed(3),
    };
  }
  console.table(table);
  console.log('計算式：');
  console.log('  raw(正規化前)   = Σ_axis profile[axis]*(axes[axis]-AXIS_BASELINE[axis]) / weight');
  console.log('  final(正規化後) = raw / TYPE_SPREAD[id]  ← scoreAxes() が実際の順位付けに使う値');
  console.log('  理論最大/最小は、BASE12問それぞれで profile との内積が最大/最小になる選択肢を');
  console.log('  選び続けたときの raw / final の値（設問間の相互作用がないため貪欲選択で厳密に求まる）。');

  const rawMaxes = Object.values(TYPE_RANGE).map(r => r.rawMax);
  const maxOfMax = Math.max(...rawMaxes);
  const minOfMax = Math.min(...rawMaxes);
  const gapPct = ((maxOfMax - minOfMax) / minOfMax) * 100;
  const fairnessPass = gapPct <= 10;
  console.log(`\n=== 配点公平性（正規化前の理論最大点、最大タイプと最小タイプの差／最小タイプ基準） ===`);
  console.log(`最大タイプの理論最大点: ${maxOfMax.toFixed(3)}`);
  console.log(`最小タイプの理論最大点: ${minOfMax.toFixed(3)}`);
  console.log(`差 / 最小タイプ基準: ${gapPct.toFixed(1)}%（固定基準：10%以内）`);
  console.log(fairnessPass ? '→ 配点公平性テスト: PASS' : '→ 配点公平性テスト: FAIL（正規化前の理論最大点が10%を超えて不均等）');

  console.log('\n=== 総合判定 ===');
  console.log(`分布テスト: ${distPass ? 'PASS' : 'FAIL'}`);
  console.log(`配点公平性テスト: ${fairnessPass ? 'PASS' : 'FAIL'}`);
}

main();
