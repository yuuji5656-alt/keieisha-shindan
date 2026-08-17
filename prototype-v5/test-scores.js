// v5 採点検証：ランダム分布 + 配点公平性
//
// 「ClaudeCodeへの引き継ぎ_2026-08-18.md」の固定基準のうち、
// ランダム10万回以上・各タイプ5〜15%、および配点公平性（v5では「10タイプの理論最大が
// 完全に同一であること」に強化された、オーナー指示2026-08-18追記分）を検証する。
//
// 暫定的に定義した項目：
//   - ランダム回答で複数タイプが同点1位になった場合の「1位」の決め方：
//     v5は0〜6点の狭い整数レンジのため、15問を等確率で答えると同点1位が頻発する。
//     同点の場合は、同点集合の中から等確率でランダムに1つを「1位」として集計する
//     （特定タイプを優遇/冷遇しない、公平な集計のため）。
const { BASE, TYPES, scoreTypes } = require('./data.js');

const TRIALS = 300000;

function randomTrialDistribution(trials) {
  const counts = Object.fromEntries(Object.keys(TYPES).map(k => [k, 0]));
  for (let n = 0; n < trials; n++) {
    const log = BASE.map(q => q.type[Math.floor(Math.random() * q.type.length)]);
    const ranks = scoreTypes(log);
    const topScore = ranks[0][1];
    const tied = ranks.filter(r => r[1] === topScore).map(r => r[0]);
    const winner = tied[Math.floor(Math.random() * tied.length)];
    counts[winner]++;
  }
  return counts;
}

function main() {
  console.log(`=== ランダム等確率分布（${TRIALS.toLocaleString()}回、同点1位はランダムで按分） ===`);
  const counts = randomTrialDistribution(TRIALS);
  const rows = {};
  let distPass = true;
  const fails = [];
  for (const [id, c] of Object.entries(counts)) {
    const pct = (c / TRIALS) * 100;
    const ok = pct >= 5 && pct <= 15;
    if (!ok) { distPass = false; fails.push(`${id}: ${pct.toFixed(2)}%`); }
    rows[id] = { '名称': TYPES[id].name, '出現回数': c, '出現率': pct.toFixed(2) + '%', '判定(5〜15%)': ok ? 'PASS' : 'FAIL' };
  }
  console.table(rows);
  console.log(distPass ? '→ 分布テスト: PASS' : `→ 分布テスト: FAIL（${fails.join(', ')}）`);

  console.log('\n=== 配点公平性（正規化前の理論上の最大獲得点） ===');
  const maxPerType = Object.fromEntries(Object.keys(TYPES).map(id => [id, BASE.filter(q => q.type.includes(id)).length]));
  console.table(Object.fromEntries(Object.entries(maxPerType).map(([id, max]) => [id, { '名称': TYPES[id].name, '基本設問での出現回数(=理論最大点)': max }])));
  const values = Object.values(maxPerType);
  const allSame = values.every(v => v === values[0]);
  console.log(allSame
    ? `→ 配点公平性テスト: PASS（10タイプ全て理論最大点 ${values[0]} で完全に同一）`
    : `→ 配点公平性テスト: FAIL（理論最大点が不均等: ${JSON.stringify(maxPerType)}）`);

  console.log('\n=== 総合判定 ===');
  console.log(`分布テスト: ${distPass ? 'PASS' : 'FAIL'}`);
  console.log(`配点公平性テスト: ${allSame ? 'PASS' : 'FAIL'}`);
}

main();
