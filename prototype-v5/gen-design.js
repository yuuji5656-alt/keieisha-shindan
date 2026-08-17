// 10タイプ×15問×4択で、各タイプがちょうど6回ずつ「主タイプ」になる組合せを生成する。
// できるだけペアの共起回数も均等になるよう、ランダム再試行+貪欲選択で探索する。
const TYPES = Array.from({length:10}, (_,i)=>i); // 0..9

function tryBuild(seedRandom) {
  const remaining = Array(10).fill(6); // 各タイプの残り出現回数
  const pairCount = Array.from({length:10},()=>Array(10).fill(0));
  const blocks = [];
  for (let q = 0; q < 15; q++) {
    // このブロックで選ぶ4タイプを、残り回数が多いものを優先しつつランダム性を持たせて選ぶ
    const candidates = TYPES.filter(t => remaining[t] > 0);
    if (candidates.length < 4) return null;
    // スコア: 残り回数(多いほど優先) - 既に選んだ3つとのペア共起回数(多いほど避ける)
    const chosen = [];
    const pool = candidates.slice();
    for (let k = 0; k < 4; k++) {
      // 残っているpoolから、remaining降順、既選択とのpair共起合計昇順、僅かなランダムでソート
      pool.sort((a,b) => {
        const pairA = chosen.reduce((s,c)=>s+pairCount[c][a],0);
        const pairB = chosen.reduce((s,c)=>s+pairCount[c][b],0);
        if (pairA !== pairB) return pairA - pairB;
        if (remaining[b] !== remaining[a]) return remaining[b]-remaining[a];
        return seedRandom() - 0.5;
      });
      const pick = pool[0];
      chosen.push(pick);
      pool.splice(pool.indexOf(pick), 1);
    }
    chosen.forEach(t => remaining[t]--);
    for (let i=0;i<4;i++) for (let j=0;j<4;j++) if (i!==j) pairCount[chosen[i]][chosen[j]]++;
    blocks.push(chosen.slice().sort((a,b)=>a-b));
  }
  if (remaining.some(r => r !== 0)) return null;
  return { blocks, pairCount };
}

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let best = null, bestSpread = Infinity;
for (let trial = 0; trial < 20000; trial++) {
  const rand = mulberry32(trial * 2654435761 + 1);
  const result = tryBuild(rand);
  if (!result) continue;
  const counts = result.pairCount.flatMap((row,i)=>row.filter((_,j)=>j>i));
  const max = Math.max(...counts), min = Math.min(...counts);
  const spread = max - min;
  if (spread < bestSpread) { bestSpread = spread; best = result; }
  if (spread === 0) break;
}

if (!best) { console.log('FAILED to build'); process.exit(1); }

console.log('pair count spread (max-min):', bestSpread);
console.log('blocks:');
best.blocks.forEach((b,i)=>console.log(`Q${i+1}:`, b.map(t=>'T'+String(t+1).padStart(2,'0')).join(',')));

const counts = Array(10).fill(0);
best.blocks.forEach(b => b.forEach(t => counts[t]++));
console.log('counts per type:', counts);

console.log('\nJSON:');
console.log(JSON.stringify(best.blocks));
