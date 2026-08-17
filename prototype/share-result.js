const params = new URLSearchParams(location.search);
const type = (params.get("type") || "診断結果").slice(0, 30);
const tagline = (params.get("tagline") || "経営者としての力の使い方を表した結果です。").slice(0, 160);
const allowedNames = ["構想力", "行動力", "販売力", "組織力", "財務力", "継続力"];
const received = (params.get("abilities") || "").split(",").map(value => {
  const [name, score] = value.split(":");
  return { name, value: Math.max(0, Math.min(100, Number(score) || 0)) };
}).filter(item => allowedNames.includes(item.name));
const abilities = allowedNames.map(name => received.find(item => item.name === name) || { name, value: 50 });

document.getElementById("shared-type").textContent = type;
document.getElementById("shared-tagline").textContent = tagline;
document.title = `${type}｜経営者の現在地診断`;

const centerX = 180, centerY = 180, radius = 126;
const point = (index, value = 100) => {
  const angle = -Math.PI / 2 + index * Math.PI / 3;
  const distance = radius * value / 100;
  return [centerX + Math.cos(angle) * distance, centerY + Math.sin(angle) * distance];
};
const polygon = amount => abilities.map((_, index) => point(index, amount).join(",")).join(" ");
const values = abilities.map((item, index) => point(index, item.value));
const axes = abilities.map((_, index) => { const [x,y] = point(index); return `<line x1="180" y1="180" x2="${x}" y2="${y}"/>`; }).join("");
const labels = abilities.map((item,index) => { const [x,y] = point(index,119); const anchor=x<145?"end":x>215?"start":"middle"; return `<text x="${x}" y="${y}" text-anchor="${anchor}"><tspan x="${x}">${item.name}</tspan><tspan x="${x}" dy="18" class="radar-score">${item.value}点</tspan></text>`; }).join("");
document.getElementById("shared-radar").innerHTML = `<svg class="radar-chart radar-chart-result" viewBox="0 0 360 360" role="img"><g class="radar-grid"><polygon points="${polygon(100)}"/><polygon points="${polygon(75)}"/><polygon points="${polygon(50)}"/><polygon points="${polygon(25)}"/>${axes}</g><polygon class="radar-area" points="${values.map(value=>value.join(",")).join(" ")}"/><g class="radar-dots">${values.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4"/>`).join("")}</g><g class="radar-labels">${labels}</g></svg>`;
document.getElementById("shared-abilities").innerHTML = abilities.map(item => `<div><span>${item.name}</span><strong>${item.value}点</strong></div>`).join("");

