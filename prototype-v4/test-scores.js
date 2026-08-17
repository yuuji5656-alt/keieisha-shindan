const fs = require('fs');
const source = fs.readFileSync(__dirname + '/app.js', 'utf8');
const data = new Function(source.slice(0, source.indexOf('const state')) + '; return { BASE, TYPES };')();
const counts = Object.fromEntries(Object.keys(data.TYPES).map(k => [k, 0]));
const baseline = Array(8).fill(0).map((_, axis) => data.BASE.reduce((sum, q) => sum + q.v.reduce((s, v) => s + v[axis], 0) / q.v.length, 0));
const spread = Object.fromEntries(Object.entries(data.TYPES).map(([id,t])=>{const weight=t.profile.reduce((sum,p)=>sum+p,0);const variance=data.BASE.reduce((sum,q)=>{const vals=q.v.map(v=>v.reduce((s,n,i)=>s+n*t.profile[i],0)/weight);const mean=vals.reduce((s,n)=>s+n,0)/vals.length;return sum+vals.reduce((s,n)=>s+(n-mean)**2,0)/vals.length;},0);return[id,Math.sqrt(variance)||1];}));
for (let n = 0; n < 200000; n++) {
  const axes = Array(8).fill(0);
  for (const q of data.BASE) {
    const v = q.v[Math.floor(Math.random() * q.v.length)];
    for (let i = 0; i < axes.length; i++) axes[i] += v[i];
  }
  const rank = Object.entries(data.TYPES).map(([id, t]) => [id, t.profile.reduce((sum, p, i) => sum + p * (axes[i] - baseline[i]), 0) / t.profile.reduce((sum,p) => sum + p, 0) / spread[id]]).sort((a, b) => b[1] - a[1]);
  counts[rank[0][0]]++;
}
console.table(Object.fromEntries(Object.entries(counts).map(([k,v]) => [k, (v / 2000).toFixed(1) + '%'])));

