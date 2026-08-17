// v5 採点検証：10タイプの一貫回答・隣接タイプとの混合回答・4つの指定境界の構成テスト
//
// 暫定的に定義した項目（引き継ぎ文書にも転記）：
//   - 「一貫回答」：対象タイプが選択肢にある問では必ずそれを選ぶ。対象タイプがない問
//     （15問中9問）では、その時点で最も得点が少ない候補（負荷分散）を選び、
//     他タイプが偶然競り合わないようにする。
//   - 「隣接タイプとの混合回答」：固定基準の4境界に含まれる8タイプはその相手を使う。
//     含まれないT03・T07は、types.md「特に混ざりやすい組み合わせ」表の最も直接的な相手
//     （T03↔T09、T07↔T05）を使う。2パターンは「A/B両方が同じ問にある場合にAを優先」
//     「同じくBを優先」の2通り（15問中、T01×T04、T02×T06、T05×T09、T08×T10は
//     いずれもBASEの同一問に同時出現する組が存在するため、優先順位で明確に2パターン作れる）。
//   - 「上位2グループ」：隣接順位間の得点差が1点以内（isNearTieと同じ基準）なら連結してグループ化。
//     先頭2グループの和集合に、想定した2タイプが両方含まれればPASS。
const { BASE, TYPES, scoreTypes, isNearTie, buildExtraQuestion } = require('./data.js');

const OFFICIAL_BOUNDARIES = [['T01', 'T04'], ['T02', 'T06'], ['T05', 'T09'], ['T08', 'T10']];
const ADJACENT_PARTNER = {
  T01: 'T04', T02: 'T06', T03: 'T09', T04: 'T01', T05: 'T09',
  T06: 'T02', T07: 'T05', T08: 'T10', T09: 'T05', T10: 'T08',
};

function buildConsistentLog(typeId) {
  const running = Object.fromEntries(Object.keys(TYPES).map(id => [id, 0]));
  const log = [];
  BASE.forEach(q => {
    let choice;
    if (q.type.includes(typeId)) choice = typeId;
    else choice = q.type.slice().sort((x, y) => running[x] - running[y])[0];
    running[choice]++;
    log.push(choice);
  });
  return log;
}

function buildMixedLog(typeA, typeB, priority) {
  const running = Object.fromEntries(Object.keys(TYPES).map(id => [id, 0]));
  const log = [];
  BASE.forEach(q => {
    const hasA = q.type.includes(typeA), hasB = q.type.includes(typeB);
    let choice;
    if (hasA && hasB) choice = priority === 'A' ? typeA : typeB;
    else if (hasA) choice = typeA;
    else if (hasB) choice = typeB;
    else choice = q.type.slice().sort((x, y) => running[x] - running[y])[0];
    running[choice]++;
    log.push(choice);
  });
  return log;
}

function resolveExtras(baseLog, boostTypes) {
  let log = baseLog.slice();
  const extraLog = [];
  for (let slot = 0; slot < 2; slot++) {
    const ranks = scoreTypes(log);
    if (!isNearTie(ranks)) break;
    const top2 = ranks.slice(0, 2).map(r => r[0]);
    const q = buildExtraQuestion(top2, slot);
    const idx = q.type.findIndex(t => boostTypes.includes(t));
    const choice = idx >= 0 ? q.type[idx] : q.type[0];
    log.push(choice);
    extraLog.push(`[追加質問${slot + 1} ${top2.join('/')}] ${choice}「${q.a[q.type.indexOf(choice)]}」`);
  }
  return { ranks: scoreTypes(log), extraLog };
}

function topGroups(ranks) {
  const groups = [[ranks[0]]];
  for (let i = 1; i < ranks.length; i++) {
    const gap = ranks[i - 1][1] - ranks[i][1];
    if (gap <= 1) groups[groups.length - 1].push(ranks[i]);
    else groups.push([ranks[i]]);
  }
  return groups;
}
function inTop2Groups(ranks, ids) {
  const groups = topGroups(ranks);
  const union = new Set([...(groups[0] || []), ...(groups[1] || [])].map(r => r[0]));
  return ids.every(id => union.has(id));
}

function judgeConsistent(typeId) {
  const base = buildConsistentLog(typeId);
  const { ranks, extraLog } = resolveExtras(base, [typeId]);
  return { typeId, pass: ranks[0][0] === typeId, top3: ranks.slice(0, 3).map(r => `${r[0]}(${r[1]})`), log: base.map((t, i) => `${BASE[i].id}:${t}`).concat(extraLog) };
}
function judgeMixed(typeA, typeB, priority) {
  const base = buildMixedLog(typeA, typeB, priority);
  const { ranks, extraLog } = resolveExtras(base, [typeA, typeB]);
  return { typeA, typeB, priority, pass: inTop2Groups(ranks, [typeA, typeB]), top4: ranks.slice(0, 4).map(r => `${r[0]}(${r[1]})`), log: base.map((t, i) => `${BASE[i].id}:${t}`).concat(extraLog) };
}

function main() {
  let allPass = true;
  const failures = [];

  console.log('=== 10タイプ 一貫回答テスト ===');
  const consistentResults = Object.keys(TYPES).map(judgeConsistent);
  console.table(Object.fromEntries(consistentResults.map(r => [r.typeId, { '実際の上位3': r.top3.join(' / '), '判定': r.pass ? 'PASS' : 'FAIL' }])));
  consistentResults.forEach(r => { if (!r.pass) { allPass = false; failures.push({ 種別: '一貫回答', 想定: r.typeId, 詳細: r }); } });

  console.log('\n=== 10タイプ 隣接タイプとの混合回答テスト（各2パターン） ===');
  const mixedResults = [];
  for (const [typeId, partner] of Object.entries(ADJACENT_PARTNER)) {
    mixedResults.push(judgeMixed(typeId, partner, 'A'));
    mixedResults.push(judgeMixed(typeId, partner, 'B'));
  }
  console.table(Object.fromEntries(mixedResults.map(r => [`${r.typeA}-${r.typeB}:${r.priority}優先`, { '実際の上位4': r.top4.join(' / '), '判定': r.pass ? 'PASS' : 'FAIL' }])));
  mixedResults.forEach(r => { if (!r.pass) { allPass = false; failures.push({ 種別: '混合回答', 想定: `${r.typeA}/${r.typeB}(${r.priority}優先)`, 詳細: r }); } });

  console.log('\n=== 指定4境界の個別検証（一貫×2＋混合×2パターン） ===');
  const boundaryResults = [];
  for (const [a, b] of OFFICIAL_BOUNDARIES) {
    boundaryResults.push({ label: `${a}一貫`, ...judgeConsistent(a) });
    boundaryResults.push({ label: `${b}一貫`, ...judgeConsistent(b) });
    boundaryResults.push({ label: `${a}-${b}混合(A優先)`, ...judgeMixed(a, b, 'A') });
    boundaryResults.push({ label: `${a}-${b}混合(B優先)`, ...judgeMixed(a, b, 'B') });
  }
  console.table(Object.fromEntries(boundaryResults.map(r => [r.label, { '判定': r.pass ? 'PASS' : 'FAIL' }])));
  boundaryResults.forEach(r => { if (!r.pass) { allPass = false; failures.push({ 種別: '境界(固定4件)', 想定: r.label, 詳細: r }); } });

  console.log('\n=== 総合判定 ===');
  console.log(allPass ? 'PASS: 一貫回答・混合回答・4境界すべて基準を満たした' : `FAIL: ${failures.length}件の不合格ケースあり`);

  if (failures.length) {
    console.log('\n=== 失敗ケースの詳細（回答列つき） ===');
    for (const f of failures) {
      console.log(`\n--- ${f.種別}: ${f.想定} ---`);
      if (f.詳細.top3) console.log('実際の上位3:', f.詳細.top3.join(' / '));
      if (f.詳細.top4) console.log('実際の上位4:', f.詳細.top4.join(' / '));
      console.log('回答列:');
      f.詳細.log.forEach(l => console.log('  ' + l));
    }
  }
}

main();
