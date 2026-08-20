// v5 採点検証：現在課題の可変性、事業計画小説の提案表示条件
//
// オーナー指示(2026-08-18追記分)の必須確認項目のうち、次の2点を検証する。
//   - 同じタイプでも課題回答で課題結果が変わる
//   - 小説の提案表示・非表示が条件どおりに分かれる（2026-08-20改訂：
//     緊急課題以外は必ず見せる方式に変更。詳細はstoryOfferEligible参照）
const { CHECKS, scoreIssues, storyOfferEligible } = require('./data.js');

function main() {
  let allPass = true;

  console.log('=== 課題判定：最後の5問の回答が違えば結果が変わるか ===');
  const caseA = scoreIssues([0, 2, 2, 2, 0]); // 構想整理が2つ
  const caseB = scoreIssues([2, 0, 2, 2, 2]); // 言語化が1つ
  console.log('caseA (構想整理):', JSON.stringify(caseA));
  console.log('caseB (言語化):', JSON.stringify(caseB));
  const differs = JSON.stringify(caseA) !== JSON.stringify(caseB);
  console.log(differs ? '→ PASS: 回答が違えば課題結果も変わる' : '→ FAIL: 回答を変えても課題結果が同じ');
  if (!differs) allPass = false;

  console.log('\n=== 課題判定：「確認できた」は異なる質問ID2件以上、1件は「参考」 ===');
  const oneEvidence = scoreIssues([0, 2, 2, 2, 2]);
  const twoEvidence = scoreIssues([0, 2, 2, 2, 0]);
  console.log('根拠1件(構想整理):', JSON.stringify(oneEvidence.構想整理));
  console.log('根拠2件(構想整理):', JSON.stringify(twoEvidence.構想整理));
  const evidenceRuleOk = oneEvidence.構想整理.status === '参考' && twoEvidence.構想整理.status === '確認できた';
  console.log(evidenceRuleOk ? '→ PASS: 根拠件数に応じて確認できた/参考が切り替わる' : '→ FAIL');
  if (!evidenceRuleOk) allPass = false;

  console.log('\n=== 事業計画小説の提案を見せるか（2026-08-20改訂：緊急課題以外は必ず見せる） ===');
  // 制作材料・届けたい相手の有無は、提案を見せる/見せないの判定には使わない
  // （storyReasonの文面をapp.js側で個別化するだけ）。見せない例外は
  // 緊急課題があるときだけ（専門家相談を優先するため）。
  const cases = [
    { name: '見せる(緊急課題なし。資料・相手の有無は問わない)', input: { urgentPrimaryIssue: false }, expect: true },
    { name: '見せない(緊急の資金繰り等が主課題)', input: { urgentPrimaryIssue: true }, expect: false },
  ];
  const rows = {};
  cases.forEach(c => {
    const result = storyOfferEligible(c.input);
    const pass = result === c.expect;
    if (!pass) allPass = false;
    rows[c.name] = { '期待': c.expect, '結果': result, '判定': pass ? 'PASS' : 'FAIL' };
  });
  console.table(rows);

  console.log('\n=== 総合判定 ===');
  console.log(allPass ? 'PASS' : 'FAIL');
}

main();

