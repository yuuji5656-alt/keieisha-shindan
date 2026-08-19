const {
  TYPES, PAIR_BANK, createQuestionSession,
  scoreTypes, classifyTypeResult, normalizedAxes
} = require('./data.js');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const typeIds = Object.keys(TYPES);

function answerFor(question, mode) {
  if (mode === 'yes') return { yesType: question.type[0], noType: question.type[2], answerIndex: 0 };
  if (mode === 'no') return { yesType: question.type[0], noType: question.type[2], answerIndex: 2 };
  return { yesType: question.type[0], noType: question.type[2], answerIndex: 1 };
}

function targetAnswers(questions, targetId) {
  return questions.map(question => {
    const answerIndex = question.type[0] === targetId ? 0 : question.type[2] === targetId ? 2 : 1;
    return { yesType: question.type[0], noType: question.type[2], answerIndex };
  });
}

console.log('=== 質問プールと出題公平性 ===');
assert(PAIR_BANK.length === 20, '比較の組数が20ではない');
assert(PAIR_BANK.reduce((sum, pair) => sum + pair.items.length, 0) === 100, '質問展開が100ではない');
const uniqueQuestions = new Set();
for (const pair of PAIR_BANK) {
  assert(pair.items.length === 5, '1組5場面ではない');
  for (const item of pair.items) {
    assert(item.scene && item.a && item.b, '場面・比較文が不足している');
    const key = `${item.scene}|${item.a}|${item.b}`;
    assert(!uniqueQuestions.has(key), `重複質問: ${key}`);
    uniqueQuestions.add(key);
  }
}
for (const id of typeIds) {
  assert(PAIR_BANK.filter(pair => pair.types[0] === id).length === 2, `${id}の「はい」側が2回ではない`);
  assert(PAIR_BANK.filter(pair => pair.types[1] === id).length === 2, `${id}の「いいえ」側が2回ではない`);
}
const seenSessionQuestions = new Set();
for (let n = 0; n < 5000; n += 1) {
  const questions = createQuestionSession();
  assert(questions.length === 20, '性格質問が20問ではない');
  questions.forEach(question => seenSessionQuestions.add(question.id));
  for (const id of typeIds) {
    const appearances = questions.filter(q => q.type[0] === id || q.type[2] === id).length;
    assert(appearances === 4, `${id}の登場数が4ではない: ${appearances}`);
  }
}
assert(seenSessionQuestions.size === 100, `実際の出題で100展開が回っていない: ${seenSessionQuestions.size}`);
console.log('PASS: 異なる100場面、毎回20問、各タイプ4回、回答方向も2回ずつ');

console.log('\n=== 10タイプの一貫回答 ===');
for (const id of typeIds) {
  for (let n = 0; n < 100; n += 1) {
    const ranks = scoreTypes(targetAnswers(createQuestionSession(), id));
    assert(ranks[0][0] === id && ranks[0][1] === 8, `${id}一貫回答が1位にならない`);
    assert(!classifyTypeResult(targetAnswers(createQuestionSession(), id)).lowSignal, `${id}一貫回答が判定不能になる`);
  }
}
console.log('PASS: 10タイプ×100回');

console.log('\n=== 回答癖と本番順位処理 ===');
const allYesQuestions = createQuestionSession();
const allYesRanks = scoreTypes(allYesQuestions.map(q => answerFor(q, 'yes')));
assert(allYesRanks.every(row => row[1] === 0 && row[2] === 2 && row[3] === 16), '全部はいが全タイプ同点にならない');
assert(classifyTypeResult(allYesQuestions.map(q => answerFor(q, 'yes'))).lowSignal, '全部はいが判定不能にならない');
const allNoRanks = scoreTypes(allYesQuestions.map(q => answerFor(q, 'no')));
assert(allNoRanks.every(row => row[1] === 0 && row[2] === 2 && row[3] === 16), '全部いいえが全タイプ同点にならない');
assert(classifyTypeResult(allYesQuestions.map(q => answerFor(q, 'no'))).lowSignal, '全部いいえが判定不能にならない');
assert(classifyTypeResult(allYesQuestions.map(q => answerFor(q, 'neutral'))).lowSignal, '全部中立が判定不能にならない');
console.log('PASS: 全部はい・全部いいえは特定タイプへ寄せず、判定不能にできる');

const randomCounts = Object.fromEntries(typeIds.map(id => [id, 0]));
const trials = 100000;
let unresolved = 0;
let mixedResults = 0;
let tripleMixed = 0, broadTies = 0;
for (let n = 0; n < trials; n += 1) {
  const questions = createQuestionSession();
  const answers = questions.map(q => ({
    yesType: q.type[0], noType: q.type[2], answerIndex: Math.floor(Math.random() * 3)
  }));
  const ranks = scoreTypes(answers);
  const tied = ranks[0][1] === ranks[1][1] && ranks[0][2] === ranks[1][2] && ranks[0][3] === ranks[1][3];
  if (tied) unresolved += 1;
  else randomCounts[ranks[0][0]] += 1;
  const classified = classifyTypeResult(answers);
  if (classified.mixedTop) mixedResults += 1;
  if (!classified.lowSignal && classified.tieCount === 3) tripleMixed += 1;
  if (classified.tieCount > 3) {
    broadTies += 1;
    assert(classified.lowSignal, '4タイプ以上同点を無理に確定した');
  }
}
for (const id of typeIds) {
  const rate = randomCounts[id] / (trials - unresolved) * 100;
  assert(rate >= 8.5 && rate <= 11.5, `本番順位処理で${id}に偏った: ${rate.toFixed(2)}%`);
}
assert(unresolved / trials < 0.06, `未解消同点が多い: ${(unresolved / trials * 100).toFixed(2)}%`);
assert(mixedResults / trials >= 0.25 && mixedResults / trials <= 0.5, `主得点同点を混合表示できていない: ${(mixedResults / trials * 100).toFixed(2)}%`);
assert(tripleMixed > 0 && broadTies > 0, '3タイプ同点または4タイプ以上同点の分岐を通せていない');
console.table(Object.fromEntries(typeIds.map(id => [id, `${(randomCounts[id] / (trials - unresolved) * 100).toFixed(2)}%`])));
console.log(`PASS: 本番順位は公平、未解消同点 ${(unresolved / trials * 100).toFixed(2)}%、混合表示 ${(mixedResults / trials * 100).toFixed(2)}%、3タイプ同点と4タイプ以上同点も分岐`);

console.log('\n=== パラメーターの特徴 ===');
const neutral = createQuestionSession().map(q => answerFor(q, 'neutral'));
assert(normalizedAxes(neutral).every(value => value === 50), '全て中立が50点にならない');
let flatCount = 0, extremeCount = 0;
const strongestCounts = Array(8).fill(0), highCounts = Array(8).fill(0);
for (let n = 0; n < 20000; n += 1) {
  const questions = createQuestionSession();
  const answers = questions.map(q => ({
    yesType: q.type[0], noType: q.type[2], answerIndex: Math.floor(Math.random() * 3)
  }));
  const axes = normalizedAxes(answers);
  if (Math.max(...axes) - Math.min(...axes) < 8) flatCount += 1;
  if (axes.some(value => value >= 90 || value <= 10)) extremeCount += 1;
  const maximum = Math.max(...axes);
  const strongest = axes.map((value, index) => value === maximum ? index : -1).filter(index => index >= 0);
  strongest.forEach(index => { strongestCounts[index] += 1 / strongest.length; });
  axes.forEach((value, index) => { if (value >= 70) highCounts[index] += 1; });
}
assert(flatCount / 20000 < 0.05, `特徴が出ない回答が多い: ${flatCount}`);
assert(extremeCount / 20000 < 0.15, `極端な点数が多い: ${extremeCount}`);
strongestCounts.forEach((count, index) => {
  const rate = count / 20000;
  assert(rate >= 0.09 && rate <= 0.16, `最強軸の出現が偏った axis${index}: ${(rate * 100).toFixed(2)}%`);
});
highCounts.forEach((count, index) => {
  const rate = count / 20000;
  assert(rate >= 0.05 && rate <= 0.15, `70点以上の出現が偏った axis${index}: ${(rate * 100).toFixed(2)}%`);
});
console.log(`PASS: 平坦 ${(flatCount / 200).toFixed(2)}%、極端 ${(extremeCount / 200).toFixed(2)}%、8軸の出現幅も均等`);

console.log('\n総合: PASS');
