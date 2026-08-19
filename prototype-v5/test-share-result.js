// 共有ページの通常・2タイプ同点・3タイプ同点表示を、DOMの最小代役で確認する。
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync(require.resolve('./share-result.js'), 'utf8');

function render(search) {
  const elements = new Map();
  const context = {
    beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, stroke() {}, fill() {}, fillText() {}
  };
  const document = {
    title: '',
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, selector === '#radar'
          ? { width: 620, height: 470, getContext: () => context }
          : { textContent: '', innerHTML: '' });
      }
      return elements.get(selector);
    }
  };
  vm.runInNewContext(source, {
    document,
    location: { search },
    URLSearchParams,
    Math
  });
  return { document, elements };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const normal = render('?type=T01&second=T02&third=T03&axes=50,55,60,65,50,45,40,35');
assert(normal.elements.get('#type').textContent === '始める人タイプ', '通常結果の主タイプが違う');
assert(!normal.elements.get('#sharedTopThree').innerHTML.includes('同じくらい強い'), '通常結果を同点表示した');

const doubleTie = render('?type=T01&second=T02&third=T03&mixed=1&ties=2&axes=50,55,60,65,50,45,40,35');
assert(doubleTie.elements.get('#type').textContent.includes('始める人タイプ × 整える人タイプ'), '2タイプ同点の見出しが違う');
assert((doubleTie.elements.get('#sharedTopThree').innerHTML.match(/同じくらい強い/g) || []).length === 2, '2タイプ同点の人数が違う');

const tripleTie = render('?type=T01&second=T02&third=T03&mixed=1&ties=3&axes=50,55,60,65,50,45,40,35');
assert(tripleTie.elements.get('#type').textContent === '3つのタイプが同じくらい', '3タイプ同点の見出しが違う');
assert((tripleTie.elements.get('#sharedTopThree').innerHTML.match(/同じくらい強い/g) || []).length === 3, '3タイプ同点の人数が違う');
assert(tripleTie.elements.get('#sharedCombination').textContent.includes('人を動かす人タイプ'), '3タイプ目が組み合わせから抜けた');

console.log('PASS: 共有ページの通常・2タイプ同点・3タイプ同点表示');
