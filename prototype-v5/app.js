/* v5表示層。採点はすべて data.js の公開関数だけを利用する。 */
const $ = selector => document.querySelector(selector);
const state = {
  index: 0, log: [], choices: [], checks: [], extra: [], questions: [],
  name: "あなた", stage: "", planStatus: "none", audience: "",
  urgentPrimaryIssue: false, resultRanks: [], resultAxes: []
};

function show(id) {
  document.querySelectorAll(".screen").forEach(element => element.classList.remove("active"));
  $("#" + id).classList.add("active");
  scrollTo({ top: 0, behavior: "smooth" });
}
function allQuestions() { return [...state.questions, ...state.extra]; }
function renderQuestion() {
  const questions = allQuestions();
  const q = questions[state.index];
  $("#count").textContent = `${state.index + 1}問目 / 全25問`;
  $("#chapter").textContent = "ふだんの自分について";
  $("#bar").style.width = `${((state.index + 1) / questions.length) * 100}%`;
  $("#scene").textContent = state.index < state.questions.length ? "ふだんの自分について" : "もう少しだけ";
  $("#question").textContent = q.q;
  $("#talk").textContent = "考えすぎず、いつもの自分で答えてね。";
  $("#back").hidden = !state.index;
  $("#answers").innerHTML = "";
  q.a.forEach((answerText, answerIndex) => {
    const button = document.createElement("button");
    button.textContent = answerText;
    button.onclick = () => answer(q, answerIndex);
    $("#answers").append(button);
  });
}
function answer(q, answerIndex) {
  const typeId = q.type[answerIndex];
  state.log.push(typeId);
  state.choices.push({ id: q.id || `extra-${state.extra.length}`, scene: q.scene, question: q.q, answer: q.a[answerIndex], typeId });
  state.index += 1;
  if (state.index < allQuestions().length) return renderQuestion();
  // 20問＋現在の確認5問で必ず25問にする。接戦用の追加質問は、
  // 3択に統一した今回の版では出さない（質問数が増えて負担になるため）。
  startChecks();
}
function back() {
  if (!state.index) return;
  state.index -= 1;
  state.log.pop();
  state.choices.pop();
  if (state.index < state.questions.length && state.extra.length) state.extra = [];
  renderQuestion();
}
function startChecks() {
  state.checkIndex = 0;
  show("check");
  renderCheck();
}
function renderCheck() {
  const q = CHECKS[state.checkIndex];
  $("#checkStep").textContent = `今の困りごと ${state.checkIndex + 1} / ${CHECKS.length}`;
  $("#checkQuestion").textContent = q.q;
  $("#checkAnswers").innerHTML = "";
  q.a.forEach((answerText, answerIndex) => {
    const button = document.createElement("button");
    button.textContent = answerText;
    button.onclick = () => {
      state.checks[state.checkIndex] = answerIndex;
      if (++state.checkIndex < CHECKS.length) renderCheck();
      else result();
    };
    $("#checkAnswers").append(button);
  });
}
function checkBack() {
  if (!state.checkIndex) {
    state.index = allQuestions().length;
    show("quiz");
    return back();
  }
  state.checkIndex -= 1;
  state.checks.splice(state.checkIndex, 1);
  renderCheck();
}

function drawRadar(values) {
  const canvas = $("#radar");
  const context = canvas.getContext("2d");
  const width = canvas.width, height = canvas.height;
  const centerX = width / 2, centerY = height / 2 + 12, radius = 164, count = AXES.length;
  context.clearRect(0, 0, width, height);
  context.font = '600 15px "Yu Gothic", sans-serif';
  context.textAlign = "center";
  for (let level = 1; level <= 4; level += 1) {
    context.beginPath();
    AXES.forEach((_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
      const r = radius * level / 4;
      const x = centerX + Math.cos(angle) * r, y = centerY + Math.sin(angle) * r;
      index ? context.lineTo(x, y) : context.moveTo(x, y);
    });
    context.closePath();
    context.strokeStyle = "#d9d0c0";
    context.stroke();
  }
  AXES.forEach((label, index) => {
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
    const r = radius * value / 100;
    const x = centerX + Math.cos(angle) * r, y = centerY + Math.sin(angle) * r;
    index ? context.lineTo(x, y) : context.moveTo(x, y);
  });
  context.closePath();
  context.fillStyle = "rgba(211,118,77,.36)";
  context.fill();
  context.strokeStyle = "#cf714c";
  context.lineWidth = 4;
  context.stroke();
}
function result() {
  const ranks = scoreTypes(state.log);
  const top = ranks.slice(0, 3);
  const [mainId, secondId, thirdId] = top.map(row => row[0]);
  const main = TYPES[mainId], second = TYPES[secondId];
  const mainDetail = TYPE_DETAILS[mainId], secondDetail = TYPE_DETAILS[secondId];
  const historical = HISTORICAL_PEOPLE[mainId];
  const issues = scoreIssues(state.checks);
  const axes = normalizedAxes(state.log.slice(0, state.questions.length));
  const eligible = storyOfferEligible({ planStatus: state.planStatus, audience: state.audience, urgentPrimaryIssue: state.urgentPrimaryIssue });
  state.resultRanks = top;
  state.resultAxes = axes;

  $("#resultName").textContent = state.name;
  $("#mainType").textContent = main.name;
  $("#tagline").textContent = main.tag;
  $("#mix").textContent = "一つの型で決めつけず、上位3つの組み合わせで読み解きます。";
  $("#topThree").innerHTML = top.map(([typeId], index) => `<span><small>${["一番近い", "次に強い", "もう一つの強み"][index]}</small><b>${TYPES[typeId].name}</b></span>`).join("");
  $("#combinationTitle").textContent = `${main.name} × ${second.name}`;
  $("#combinationText").textContent = `「${mainDetail.contribution}」と「${secondDetail.contribution}」の両方が出ています。思いつきを、途中で終わらない仕事へ変えやすい組み合わせです。`;
  $("#axisList").innerHTML = AXES.map((axis, index) => `<span><b>${axis}</b><strong>${axes[index]}</strong><small>100点満点の回答傾向</small></span>`).join("");
  drawRadar(axes);
  $("#historicalName").textContent = historical.name;
  $("#historicalType").textContent = main.name;
  $("#historicalRole").textContent = historical.role;
  $("#historicalReason").textContent = historical.reason;
  $("#strengthTitle").textContent = mainDetail.contribution;
  $("#strength").textContent = main.strength;
  $("#risk").textContent = main.risk;
  $("#fitList").innerHTML = mainDetail.fit.map(item => `<li>${item}</li>`).join("");
  $("#accidentList").innerHTML = mainDetail.accidents.map(item => `<li>${item}</li>`).join("");
  $("#advisorCards").innerHTML = advisorTeamFor(mainId).map(advisor => {
    const person = HISTORICAL_PEOPLE[advisor.typeId];
    return `<article><h3>${person.name}</h3><b>${TYPES[advisor.typeId].name}</b><p>${person.role}</p><p>${advisor.why}</p></article>`;
  }).join("");

  const entries = Object.entries(issues).sort((a, b) => b[1].score - a[1].score);
  const lead = entries[0];
  $("#issues").innerHTML = entries.map(([key, value]) => `<span>${key}（${value.status}）</span>`).join("") || "<span>今は大きな詰まりなし</span>";
  $("#issueTitle").textContent = lead ? `今、先に整えたいのは\n${lead[0]}` : "今、先に整えたいこと";
  $("#issueText").textContent = lead ? `いまは「${lead[0]}」を先に整えると、あなたの強みが仕事で生きやすくなります。` : "今の回答では、大きく止まっていることは見つかりませんでした。";
  $("#actionTitle").textContent = main.action;
  $("#actionText").textContent = main.actionText;

  $("#storyOffer").hidden = !eligible;
  $("#otherOffer").hidden = eligible;
  if (eligible) {
    const material = state.planStatus === "plan" ? "事業計画書" : "構想のメモや資料";
    const customerRoute = ["お客様", "応援者"].includes(state.audience);
    $("#storyReason").textContent = customerRoute
      ? `${material}があり、${state.audience}に事業を知ってほしい状態です。計画にある店・商品・人の成長を連載へ変え、物語から実際の接点へつなぐ材料があります。`
      : `${material}があり、${state.audience}へ伝えたい相手も決まっています。計画の事実を土台に、その人が未来を場面として想像できる物語を設計できます。`;
  } else if (state.urgentPrimaryIssue) {
    $("#otherTitle").textContent = "まずは、緊急対応を優先してください";
    $("#otherText").textContent = "資金繰り・法律・人の問題は、関係者や専門家への相談を先に。落ち着いてから、今週の一歩へ戻れば大丈夫です。";
  } else if (state.planStatus === "none") {
    $("#otherTitle").textContent = "まず、構想を一枚に書いてみる";
    $("#otherText").textContent = "誰に、何を届け、どんな変化を起こしたいか。この3つを一枚に書くと、次に必要な方法を選びやすくなります。";
  } else {
    $("#otherTitle").textContent = "まず、届けたい相手を一人に決める";
    $("#otherText").textContent = "社員、お客様、採用候補など、最初に分かってほしい相手を一人に絞ると、必要な説明や物語が見えてきます。";
  }
  show("result");
}

function share() {
  const url = new URL("share-result.html", location.href);
  url.searchParams.set("type", state.resultRanks[0][0]);
  url.searchParams.set("second", state.resultRanks[1][0]);
  url.searchParams.set("third", state.resultRanks[2][0]);
  url.searchParams.set("name", state.name);
  url.searchParams.set("axes", state.resultAxes.join(","));
  return {
    text: `私は「${$("#mainType").textContent}」でした。\n2番目は「${TYPES[state.resultRanks[1][0]].name}」。\n経営の現在地診断`,
    url: url.href
  };
}

$("#startBtn").onclick = () => show("profile");
$("#profileNext").onclick = () => {
  state.index = 0;
  state.log = [];
  state.choices = [];
  state.checks = [];
  state.extra = [];
  state.name = $("#name").value.trim() || "あなた";
  state.stage = $("#stage").value;
  state.planStatus = $("#planStatus").value;
  state.audience = $("#audience").value;
  state.urgentPrimaryIssue = $("#urgent").value === "yes";
  state.questions = createQuestionSession();
  show("quiz");
  renderQuestion();
};
$("#back").onclick = back;
$("#checkBack").onclick = checkBack;
$("#retry").onclick = () => location.reload();
$("#nativeShare").onclick = () => {
  if (navigator.share) navigator.share(share());
  else $("#shareStatus").textContent = "この端末では、LINE・X・リンクコピーをお使いください。";
};
$("#lineShare").onclick = () => open("https://line.me/R/msg/text/?" + encodeURIComponent(share().text + "\n" + share().url), "_blank");
$("#xShare").onclick = () => open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(share().text) + "&url=" + encodeURIComponent(share().url), "_blank");
$("#copyShare").onclick = async () => {
  await navigator.clipboard.writeText(share().text + "\n" + share().url);
  $("#shareStatus").textContent = "診断結果のリンクをコピーしました。";
};


