// 採点検証：10タイプの一貫回答・隣接タイプとの混合回答・4つの指定境界の構成テスト
//
// 「ClaudeCodeへの引き継ぎ_2026-08-18.md」の『採点検証の合格基準（固定）』のうち、
// 次の項目をこのファイルで検証する。
//   - 10タイプそれぞれについて、一貫回答と隣接タイプとの混合回答を最低2パターン作る。
//   - 次の4境界を個別に検証する（新しい道／売れる場所、回る仕組み／お金の使い方、
//     思いを形にする／言葉で人を集める、困りごとを仕事で変える／大切なものを残す）。
//   - 一貫回答が、それぞれ想定タイプを第1位として出す。
//   - 混合回答では、想定した2タイプが同順位を含めて上位2グループ以内に出る。
//
// 暫定的に定義した項目（引き継ぎ文書に数値・方法の定義がないため、このファイルで採用した定義。
// 詳細はClaudeCodeへの引き継ぎ_2026-08-18.mdに転記）：
//
// 1. 「隣接タイプ」の組み合わせ：固定基準にある4境界（T01-T04, T02-T06, T05-T09, T08-T10）で
//    定義済みの8タイプはその相手を使う。境界に含まれないT03・T07は、types.md
//    「特に混ざりやすい組み合わせ」表に載っている最も直接的な相手（T03↔T09、T07↔T05）を使う。
// 2. 「混合回答」の作り方：BASE12問について、各問でintendedタイプのprofileと最も内積が
//    大きい選択肢を選ぶ場合と、もう一方のタイプで同様に選ぶ場合を混ぜる。2パターンとして
//    (a)奇数問=A・偶数問=B の交互(6:6)、(b)前半8問=A・後半4問=B の多数派(8:4) を用いる。
// 3. 「上位2グループ」の定義：scoreAxes()の順位を、隣接する順位同士の表示スケール上の差
//    （app.js の toDisplayScale、固定基準の「正規化後」に相当）が5点未満なら同じグループとして
//    連結してグループ化する。先頭2グループの和集合を「上位2グループ」とする。
// 4. 追加質問（境界質問）が発生した場合の回答：一貫回答では想定タイプのprofileと最も内積が
//    大きい方を選ぶ。混合回答では、2タイプのprofileを足し合わせたベクトルと最も内積が大きい方を選ぶ
//    （どちらか一方に偏らせない、中立的な回答という扱い）。
const { BASE, TYPES, scoreAxes, isNearTie, toDisplayScale, buildExtraQuestion } = require('./app.js');

const OFFICIAL_BOUNDARIES = [
  ['T01', 'T04'],
  ['T02', 'T06'],
  ['T05', 'T09'],
  ['T08', 'T10'],
];

const ADJACENT_PARTNER = {
  T01: 'T04', T02: 'T06', T03: 'T09', T04: 'T01', T05: 'T09',
  T06: 'T02', T07: 'T05', T08: 'T10', T09: 'T05', T10: 'T08',
};

function bestIndex(vectors, profile) {
  let best = -Infinity, bestIdx = 0;
  vectors.forEach((v, i) => { const dot = v.reduce((s, n, k) => s + n * profile[k], 0); if (dot > best) { best = dot; bestIdx = i; } });
  return bestIdx;
}

function consistentAxes(typeId) {
  const profile = TYPES[typeId].profile;
  const axes = Array(8).fill(0);
  const log = [];
  BASE.forEach(q => {
    const idx = bestIndex(q.v, profile);
    for (let i = 0; i < 8; i++) axes[i] += q.v[idx][i];
    log.push(`${q.id}:${'ABCD'[idx]}「${q.a[idx]}」`);
  });
  return { axes, log };
}

function mixedAxes(typeA, typeB, pattern) {
  const profileA = TYPES[typeA].profile, profileB = TYPES[typeB].profile;
  const axes = Array(8).fill(0);
  const log = [];
  BASE.forEach((q, idx) => {
    const useA = pattern === 'alt' ? idx % 2 === 0 : idx < 8;
    const profile = useA ? profileA : profileB;
    const i = bestIndex(q.v, profile);
    for (let k = 0; k < 8; k++) axes[k] += q.v[i][k];
    log.push(`${q.id}:${'ABCD'[i]}「${q.a[i]}」(${useA ? typeA : typeB}側)`);
  });
  return { axes, log };
}

function finalizeRanks(axes, extraPreferenceProfile, log) {
  let ranks = scoreAxes(axes);
  if (isNearTie(ranks)) {
    const top2 = ranks.slice(0, 2).map(r => r[0]);
    const q = buildExtraQuestion(top2);
    const idx = bestIndex(q.v, extraPreferenceProfile);
    const axes2 = axes.slice();
    for (let i = 0; i < 8; i++) axes2[i] += q.v[idx][i];
    log.push(`[追加質問 ${top2.join('/')}] ${'AB'[idx]}「${q.a[idx]}」`);
    ranks = scoreAxes(axes2);
  }
  return ranks;
}

function topGroups(ranks) {
  const groups = [[ranks[0]]];
  for (let i = 1; i < ranks.length; i++) {
    const gap = toDisplayScale(ranks[i - 1][1]) - toDisplayScale(ranks[i][1]);
    if (gap < 5) groups[groups.length - 1].push(ranks[i]);
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
  const { axes, log } = consistentAxes(typeId);
  const ranks = finalizeRanks(axes, TYPES[typeId].profile, log);
  return { typeId, pass: ranks[0][0] === typeId, top3: ranks.slice(0, 3).map(r => `${r[0]}(${r[1].toFixed(2)})`), log };
}

function judgeMixed(typeA, typeB, pattern) {
  const { axes, log } = mixedAxes(typeA, typeB, pattern);
  const combined = TYPES[typeA].profile.map((p, i) => p + TYPES[typeB].profile[i]);
  const ranks = finalizeRanks(axes, combined, log);
  return { typeA, typeB, pattern, pass: inTop2Groups(ranks, [typeA, typeB]), top4: ranks.slice(0, 4).map(r => `${r[0]}(${r[1].toFixed(2)})`), log };
}

function main() {
  let allPass = true;
  const failures = [];

  console.log('=== 10タイプ 一貫回答テスト ===');
  const consistentResults = Object.keys(TYPES).map(judgeConsistent);
  console.table(Object.fromEntries(consistentResults.map(r => [r.typeId, { '想定': r.typeId, '実際の上位3': r.top3.join(' / '), '判定': r.pass ? 'PASS' : 'FAIL' }])));
  consistentResults.forEach(r => { if (!r.pass) { allPass = false; failures.push({ 種別: '一貫回答', 想定: r.typeId, 詳細: r }); } });

  console.log('\n=== 10タイプ 隣接タイプとの混合回答テスト（各2パターン） ===');
  const mixedResults = [];
  for (const [typeId, partner] of Object.entries(ADJACENT_PARTNER)) {
    for (const pattern of ['alt', 'majority']) {
      mixedResults.push(judgeMixed(typeId, partner, pattern));
    }
  }
  console.table(Object.fromEntries(mixedResults.map((r, i) => [`${r.typeA}-${r.typeB}:${r.pattern}`, { '想定2タイプ': `${r.typeA}/${r.typeB}`, 'パターン': r.pattern, '実際の上位4': r.top4.join(' / '), '判定': r.pass ? 'PASS' : 'FAIL' }])));
  mixedResults.forEach(r => { if (!r.pass) { allPass = false; failures.push({ 種別: '混合回答', 想定: `${r.typeA}/${r.typeB}(${r.pattern})`, 詳細: r }); } });

  console.log('\n=== 指定4境界の個別検証（一貫×2＋混合×2パターン） ===');
  const boundaryResults = [];
  for (const [a, b] of OFFICIAL_BOUNDARIES) {
    boundaryResults.push({ label: `${a}一貫`, ...judgeConsistent(a) });
    boundaryResults.push({ label: `${b}一貫`, ...judgeConsistent(b) });
    boundaryResults.push({ label: `${a}-${b}混合(alt)`, ...judgeMixed(a, b, 'alt') });
    boundaryResults.push({ label: `${a}-${b}混合(majority)`, ...judgeMixed(a, b, 'majority') });
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
