// v5 採点検証：現在課題の可変性、事業計画小説の主提案条件分岐
//
// オーナー指示(2026-08-18追記分)の必須確認項目のうち、次の2点を検証する。
//   - 同じタイプでも課題回答で課題結果が変わる
//   - 小説主提案の適合・非適合が条件どおりに分かれる
const { CHECKS, scoreIssues, storyOfferEligible } = require('./data.js');

function main() {
  let allPass = true;

  console.log('=== 課題判定：同じタイプ回答でも、課題確認3問の回答が違えば結果が変わるか ===');
  // c1:構想整理寄り, c2:言語化が多い, c3:相手はいるが曖昧(構想整理+1)
  const caseA = scoreIssues([0, 3, 1]); // 構想整理(c1)+構想整理(c3、1点)=参考のはず / 言語化(c2、3点)
  // c1:言語化寄り, c2:ほとんどない, c3:誰に何をしてほしいか言える(0点)
  const caseB = scoreIssues([1, 0, 0]); // 言語化(c1)のみ、他は0点 → 言語化は根拠1件のみ=参考
  console.log('caseA (c1=構想整理, c2=4回以上→言語化+3, c3=曖昧→構想整理+1):', JSON.stringify(caseA));
  console.log('caseB (c1=言語化, c2=ほとんどない, c3=明確→加点なし):', JSON.stringify(caseB));
  const differs = JSON.stringify(caseA) !== JSON.stringify(caseB);
  console.log(differs ? '→ PASS: 回答が違えば課題結果も変わる' : '→ FAIL: 回答を変えても課題結果が同じ');
  if (!differs) allPass = false;

  console.log('\n=== 課題判定：「確認できた」は異なる質問ID2件以上、1件は「参考」 ===');
  const oneEvidence = scoreIssues([1, 0, 0]); // 言語化はc1のみ(1件)
  const twoEvidence = scoreIssues([1, 1, 0]); // 言語化がc1・c2の2件
  console.log('根拠1件(言語化):', JSON.stringify(oneEvidence.言語化));
  console.log('根拠2件(言語化):', JSON.stringify(twoEvidence.言語化));
  const evidenceRuleOk = oneEvidence.言語化.status === '参考' && twoEvidence.言語化.status === '確認できた';
  console.log(evidenceRuleOk ? '→ PASS: 根拠件数に応じて確認できた/参考が切り替わる' : '→ FAIL');
  if (!evidenceRuleOk) allPass = false;

  console.log('\n=== 事業計画小説の主提案条件 ===');
  const cases = [
    { name: '適合(条件すべて満たす)', input: { issues: { 言語化: { status: '確認できた' } }, stage: '検証', audience: '社員', urgentPrimaryIssue: false }, expect: true },
    { name: '不適合(根拠が参考のみ)', input: { issues: { 言語化: { status: '参考' } }, stage: '検証', audience: '社員', urgentPrimaryIssue: false }, expect: false },
    { name: '不適合(事業段階が対象外)', input: { issues: { 言語化: { status: '確認できた' } }, stage: '安定', audience: '社員', urgentPrimaryIssue: false }, expect: false },
    { name: '不適合(共有相手なし)', input: { issues: { 言語化: { status: '確認できた' } }, stage: '検証', audience: '', urgentPrimaryIssue: false }, expect: false },
    { name: '不適合(緊急の資金繰り等が主課題)', input: { issues: { 言語化: { status: '確認できた' } }, stage: '検証', audience: '社員', urgentPrimaryIssue: true }, expect: false },
    { name: '適合(構想整理が根拠)', input: { issues: { 構想整理: { status: '確認できた' } }, stage: '転換', audience: '出資者・金融機関', urgentPrimaryIssue: false }, expect: true },
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
