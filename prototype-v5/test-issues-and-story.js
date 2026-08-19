// v5 採点検証：現在課題の可変性、事業計画小説の主提案条件分岐
//
// オーナー指示(2026-08-18追記分)の必須確認項目のうち、次の2点を検証する。
//   - 同じタイプでも課題回答で課題結果が変わる
//   - 小説主提案の適合・非適合が条件どおりに分かれる
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

  console.log('\n=== 事業計画小説の主提案条件 ===');
  const cases = [
    { name: '適合(計画書＋お客様)', input: { planStatus: 'plan', audience: 'お客様', urgentPrimaryIssue: false }, expect: true },
    { name: '適合(構想メモ＋社員)', input: { planStatus: 'memo', audience: '社員', urgentPrimaryIssue: false }, expect: true },
    { name: '不適合(制作材料なし)', input: { planStatus: 'none', audience: 'お客様', urgentPrimaryIssue: false }, expect: false },
    { name: '不適合(届けたい相手なし)', input: { planStatus: 'plan', audience: '', urgentPrimaryIssue: false }, expect: false },
    { name: '不適合(緊急の資金繰り等が主課題)', input: { planStatus: 'plan', audience: '社員', urgentPrimaryIssue: true }, expect: false },
    { name: '適合(事業段階・タイプに依存しない)', input: { planStatus: 'plan', audience: '応援者', urgentPrimaryIssue: false }, expect: true },
    { name: '適合(資料なし・診断で言語化を確認できた)', input: { planStatus: 'none', audience: '社員', urgentPrimaryIssue: false, issues: { 言語化: { status: '確認できた' } } }, expect: true },
    { name: '適合(資料なし・診断で構想整理を確認できた)', input: { planStatus: 'none', audience: '採用候補', urgentPrimaryIssue: false, issues: { 構想整理: { status: '確認できた' } } }, expect: true },
    { name: '不適合(資料なし・課題は参考どまり)', input: { planStatus: 'none', audience: '社員', urgentPrimaryIssue: false, issues: { 言語化: { status: '参考' } } }, expect: false },
    { name: '不適合(資料なし・診断課題あっても届けたい相手なし)', input: { planStatus: 'none', audience: '', urgentPrimaryIssue: false, issues: { 言語化: { status: '確認できた' } } }, expect: false },
    { name: '不適合(資料なし・診断課題あっても緊急課題が優先)', input: { planStatus: 'none', audience: '社員', urgentPrimaryIssue: true, issues: { 言語化: { status: '確認できた' } } }, expect: false },
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

