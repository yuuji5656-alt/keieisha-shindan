const types = {
  T01: ["新しい道をつくる型", "まだない仕事を、最初の形にする。"],
  T02: ["回る仕組みをつくる型", "自分がいなくても、続く形に整える。"],
  T03: ["仲間を増やして進む型", "役割を渡し、チームで前へ進める。"],
  T04: ["売れる場所を見つける型", "反応を見て、勝ち筋を早くつかむ。"],
  T05: ["思いを形にする型", "自分が見たい未来を、仕事に変える。"],
  T06: ["お金の使い方を考える型", "投資と回収から、次の一手を決める。"],
  T07: ["いいものを磨く型", "細かな違いを、信頼に変える。"],
  T08: ["困りごとを仕事で変える型", "誰かの困りごとを、続く仕事にする。"],
  T09: ["言葉で人を集める型", "自分の声を、仲間と機会につなげる。"],
  T10: ["大切なものを残す型", "信用と関係を、次の世代へつなぐ。"]
};
const axes = ["新しいこと", "長く残すこと", "商品を磨くこと", "人を動かすこと", "市場を見ること", "数字を整えること", "自分の構想", "周りへの役立ち"];
const params = new URLSearchParams(location.search);
const ids = [params.get("type") || "T01", params.get("second") || "T02", params.get("third") || "T03"].map(id => types[id] ? id : "T01");
const data = types[ids[0]];
const name = params.get("name") || "あなた";
const values = (params.get("axes") || "65,55,60,55,60,55,60,55").split(",").map(Number);
document.title = `${name}さんは「${data[0]}」｜経営の現在地診断`;
document.querySelector("#owner").textContent = `${name}さんの診断結果`;
document.querySelector("#type").textContent = data[0];
document.querySelector("#tag").textContent = data[1];
document.querySelector("#sharedTopThree").innerHTML = ids.map((id, index) => `<span><small>${["中心", "次に強い", "補助"][index]}</small><b>${types[id][0]}</b></span>`).join("");
document.querySelector("#sharedCombination").textContent = `${types[ids[0]][0]} × ${types[ids[1]][0]}`;

const canvas = document.querySelector("#radar");
const context = canvas.getContext("2d");
const width = canvas.width, height = canvas.height;
const centerX = width / 2, centerY = height / 2 + 12, radius = 164, count = axes.length;
context.font = '600 15px "Yu Gothic", sans-serif';
context.textAlign = "center";
for (let level = 1; level <= 4; level += 1) {
  context.beginPath();
  axes.forEach((_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
    const r = radius * level / 4;
    const x = centerX + Math.cos(angle) * r, y = centerY + Math.sin(angle) * r;
    index ? context.lineTo(x, y) : context.moveTo(x, y);
  });
  context.closePath();
  context.strokeStyle = "#d9d0c0";
  context.stroke();
}
axes.forEach((label, index) => {
  const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
  context.beginPath();
  context.moveTo(centerX, centerY);
  context.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
  context.strokeStyle = "#e4ddd1";
  context.stroke();
  context.fillStyle = "#214837";
  context.fillText(label, centerX + Math.cos(angle) * (radius + 38), centerY + Math.sin(angle) * (radius + 30) + 5);
});
context.beginPath();
values.forEach((value, index) => {
  const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
  const r = radius * Math.max(0, Math.min(100, value || 0)) / 100;
  const x = centerX + Math.cos(angle) * r, y = centerY + Math.sin(angle) * r;
  index ? context.lineTo(x, y) : context.moveTo(x, y);
});
context.closePath();
context.fillStyle = "rgba(211,118,77,.36)";
context.fill();
context.strokeStyle = "#cf714c";
context.lineWidth = 4;
context.stroke();

