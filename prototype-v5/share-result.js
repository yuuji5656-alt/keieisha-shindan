const types = {
  T01: ["始める人タイプ", "まだない仕事を、最初の形にする。"],
  T02: ["整える人タイプ", "自分がいなくても、続く形に整える。"],
  T03: ["人を動かす人タイプ", "役割を渡し、チームで前へ進める。"],
  T04: ["売る人タイプ", "反応を見て、勝ち筋を早くつかむ。"],
  T05: ["夢を形にする人タイプ", "自分が見たい未来を、仕事に変える。"],
  T06: ["お金を見る人タイプ", "投資と回収から、次の一手を決める。"],
  T07: ["いいものを作る人タイプ", "細かな違いを、信頼に変える。"],
  T08: ["困りごとを解く人タイプ", "誰かの困りごとを、続く仕事にする。"],
  T09: ["言葉で伝える人タイプ", "自分の声を、仲間と機会につなげる。"],
  T10: ["守り続ける人タイプ", "信用と関係を、次の世代へつなぐ。"]
};
const axes = ["新しいこと", "長く残すこと", "商品を磨くこと", "人を動かすこと", "市場を見ること", "数字を整えること", "自分の構想", "周りへの役立ち"];
const params = new URLSearchParams(location.search);
const ids = [params.get("type") || "T01", params.get("second") || "T02", params.get("third") || "T03"].map(id => types[id] ? id : "T01");
const data = types[ids[0]];
const mixed = params.get("mixed") === "1";
const tieCount = mixed ? Math.max(2, Math.min(3, Number(params.get("ties")) || 2)) : 1;
const name = params.get("name") || "あなた";
const values = (params.get("axes") || "65,55,60,55,60,55,60,55").split(",").map(Number);
const resultName = tieCount === 3 ? "3つのタイプが同じくらい" : mixed ? `${types[ids[0]][0]} × ${types[ids[1]][0]}` : data[0];
document.title = `${name}さんは「${resultName}」｜経営の現在地診断`;
document.querySelector("#owner").textContent = `${name}さんの診断結果`;
document.querySelector("#type").textContent = resultName;
document.querySelector("#tag").textContent = tieCount === 3 ? ids.slice(0, 3).map(id => types[id][0]).join("・") : mixed ? "二つの考え方を、同じくらい使う組み合わせ。" : data[1];
const standardLabels = ["一番近い", "次に強い", "もう一つの強み"];
const sharedLabels = mixed ? ids.map((_, index) => index < tieCount ? "同じくらい強い" : standardLabels[index]) : standardLabels;
document.querySelector("#sharedTopThree").innerHTML = ids.map((id, index) => `<span><small>${sharedLabels[index]}</small><b>${types[id][0]}</b></span>`).join("");
document.querySelector("#sharedCombination").textContent = ids.slice(0, Math.max(2, tieCount)).map(id => types[id][0]).join(" × ");

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


