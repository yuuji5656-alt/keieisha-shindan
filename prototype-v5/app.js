/* v5表示層。採点はすべて data.js の公開関数だけを利用する。 */
const $ = selector => document.querySelector(selector);
const state = {
  index: 0, log: [], choices: [], checks: [], extra: [], questions: [], axisAnswers: [],
  name: "あなた", stage: "", planStatus: "none", audience: "",
  urgentPrimaryIssue: false, resultRanks: [], resultAxes: [], mixedTop: false, tieCount: 1, lowSignal: false
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
  $("#bar").style.width = `${((state.index + 1) / 25) * 100}%`;
  $("#scene").textContent = q.scene || "ふだんの自分について";
  $("#question").textContent = q.q;
  $("#talk").textContent = "考えすぎず、いつもの自分で答えてね。";
  $("#back").hidden = !state.index;
  $("#answers").innerHTML = "";
  q.a.forEach((answerText, answerIndex) => {
    const button = document.createElement("button");
    const hint = q.hints && q.hints[answerIndex];
    if (hint) {
      button.className = "with-hint";
      const word = document.createElement("span");
      word.className = "answer-word";
      word.textContent = answerText;
      const detail = document.createElement("span");
      detail.className = "answer-hint";
      detail.textContent = hint;
      button.append(word, detail);
    } else {
      button.textContent = answerText;
    }
    button.onclick = () => answer(q, answerIndex);
    $("#answers").append(button);
  });
}
function answer(q, answerIndex) {
  const typeId = q.type[answerIndex];
  const answerRecord = { yesType: q.type[0], noType: q.type[2], answerIndex };
  state.log.push(answerRecord);
  if (state.index < state.questions.length) state.axisAnswers.push(answerRecord);
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
  if (state.index < state.questions.length) state.axisAnswers.pop();
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
  const typeResult = classifyTypeResult(state.log);
  const ranks = typeResult.ranks;
  const top = ranks.slice(0, 3);
  const [mainId, secondId] = top.map(row => row[0]);
  const main = TYPES[mainId], second = TYPES[secondId];
  const mainDetail = TYPE_DETAILS[mainId], secondDetail = TYPE_DETAILS[secondId];
  const issues = scoreIssues(state.checks);
  const axes = normalizedAxes(state.log);
  const eligible = storyOfferEligible({ planStatus: state.planStatus, audience: state.audience, urgentPrimaryIssue: state.urgentPrimaryIssue, issues });
  const lowSignal = typeResult.lowSignal;
  const mixedTop = typeResult.mixedTop;
  const tieCount = typeResult.tieCount;
  const tiedIds = mixedTop ? top.slice(0, tieCount).map(row => row[0]) : [mainId];
  const tiedTypes = tiedIds.map(typeId => TYPES[typeId]);
  const tiedDetails = tiedIds.map(typeId => TYPE_DETAILS[typeId]);
  state.resultRanks = top;
  state.resultAxes = axes;
  state.mixedTop = mixedTop;
  state.tieCount = tieCount;
  state.lowSignal = lowSignal;

  $("#resultName").textContent = state.name;
  $("#mainType").textContent = lowSignal ? "まだ一つに絞れません" : tieCount === 3 ? "3つのタイプが同じくらい" : mixedTop ? `${main.name} × ${second.name}` : main.name;
  $("#tagline").textContent = lowSignal ? "今回の回答では、タイプの差が十分に出ませんでした。" : tieCount === 3 ? tiedTypes.map(type => type.name).join("・") : mixedTop ? "二つの考え方を、同じくらい使っています。" : main.tag;
  $("#mix").textContent = lowSignal ? "無理に型を当てはめず、今回は回答の見取り図だけをお返しします。" : mixedTop ? `同点の${tieCount === 3 ? "三つ" : "二つ"}を中心に、上位3つの組み合わせで読み解きます。` : "一つの型で決めつけず、上位3つの組み合わせで読み解きます。";
  $("#topThree").style.display = lowSignal ? "none" : "";
  document.querySelectorAll(".type-specific").forEach(card => { card.hidden = lowSignal; });
  const sameRank = (a, b) => a[1] === b[1];
  const rankLabels = [
    sameRank(top[0], top[1]) ? "同じくらい強い" : "一番近い",
    sameRank(top[0], top[1]) || sameRank(top[1], top[2]) ? "同じくらい強い" : "次に強い",
    sameRank(top[1], top[2]) ? "同じくらい強い" : "もう一つの強み"
  ];
  $("#topThree").innerHTML = top.map(([typeId], index) => `<span><small>${rankLabels[index]}</small><b>${TYPES[typeId].name}</b></span>`).join("");
  $("#combinationTitle").textContent = mixedTop ? tiedTypes.map(type => type.name).join(" × ") : `${main.name} × ${second.name}`;
  $("#combinationText").textContent = mixedTop
    ? `${tiedDetails.map(detail => `「${detail.contribution}」`).join("と")}が、同じくらい出た組み合わせです。`
    : `中心にあるのは「${mainDetail.contribution}」。そこへ「${secondDetail.contribution}」が加わった組み合わせです。`;
  const axisOrder = axes.map((value, index) => ({ value, index })).sort((a, b) => b.value - a.value);
  const axisRange = axisOrder[0].value - axisOrder[axisOrder.length - 1].value;
  $("#axisSummary").textContent = axisRange < 8
    ? "今回は、八つの選び方に大きな差が出ませんでした。"
    : `今回もっとも強く出たのは「${AXES[axisOrder[0].index]}」。一方、「${AXES[axisOrder[axisOrder.length - 1].index]}」は慎重に使う傾向です。`;
  const band = value => value >= 70 ? "強く出た" : value >= 56 ? "やや強い" : value >= 45 ? "中間" : value >= 30 ? "やや控えめ" : "控えめ";
  $("#axisList").innerHTML = AXES.map((axis, index) => `<span><b>${axis}</b><strong>${axes[index]}点</strong><small>${band(axes[index])}</small></span>`).join("");
  drawRadar(axes);
  const historicalIds = tiedIds;
  $("#historicalCards").innerHTML = historicalIds.map(typeId => {
    const person = HISTORICAL_PEOPLE[typeId];
    return `<div class="historical-card"><h2>${person.name}</h2><b>${TYPES[typeId].name}</b><p class="note">${person.bio}</p><p>${person.role}</p><p>${person.reason}</p></div>`;
  }).join("");
  $("#strengthTitle").textContent = mixedTop ? tiedDetails.map(detail => detail.contribution).join("／") : mainDetail.contribution;
  $("#strength").textContent = mixedTop ? tiedTypes.map(type => type.strength).join(" また、") : main.strength;
  $("#risk").textContent = mixedTop ? tiedTypes.map(type => type.risk).join(" また、") : main.risk;
  const itemsPerType = tieCount === 3 ? 1 : 2;
  const fitItems = mixedTop ? tiedDetails.flatMap(detail => detail.fit.slice(0, itemsPerType)) : mainDetail.fit;
  const accidentItems = mixedTop ? tiedDetails.flatMap(detail => detail.accidents.slice(0, itemsPerType)) : mainDetail.accidents;
  $("#fitList").innerHTML = [...new Set(fitItems)].slice(0, 4).map(item => `<li>${item}</li>`).join("");
  $("#accidentList").innerHTML = [...new Set(accidentItems)].slice(0, 4).map(item => `<li>${item}</li>`).join("");
  $("#growthText").textContent = mixedTop ? tiedDetails.map(detail => detail.growthFocus).join(" また、") : mainDetail.growthFocus;
  const compatIds = mixedTop
    ? [...new Set(tiedDetails.flatMap(detail => detail.partners))].filter(id => !tiedIds.includes(id))
    : mainDetail.partners;
  $("#compatTitle").textContent = compatIds.map(id => TYPES[id].name).join(" ／ ");
  $("#compatText").textContent = mixedTop ? tiedDetails.map(detail => detail.partnerReason).join(" また、") : mainDetail.partnerReason;
  const advisorSource = mixedTop ? tiedIds.flatMap(typeId => advisorTeamFor(typeId)) : advisorTeamFor(mainId);
  const advisorCandidates = advisorSource.filter((advisor, index, list) =>
    !historicalIds.includes(advisor.typeId) && list.findIndex(item => item.typeId === advisor.typeId) === index
  );
  Object.keys(TYPES).forEach(typeId => {
    if (!historicalIds.includes(typeId) && !advisorCandidates.some(item => item.typeId === typeId)) {
      advisorCandidates.push({ typeId, why: "あなたとは違う見方を足し、判断が一つに偏るのを防いでくれます。" });
    }
  });
  const advisorTeam = advisorCandidates.slice(0, 3);
  $("#advisorCards").innerHTML = advisorTeam.map(advisor => {
    const person = HISTORICAL_PEOPLE[advisor.typeId];
    return `<article><h3>${person.name}</h3><b>${TYPES[advisor.typeId].name}</b><p class="note">${person.bio}</p><p>${person.role}</p><p>${advisor.why}</p></article>`;
  }).join("");
  $("#perceivedText").textContent = mixedTop ? tiedDetails.map(detail => detail.perceivedAs).join(" また、") : mainDetail.perceivedAs;

  const entries = Object.entries(issues).sort((a, b) => b[1].score - a[1].score);
  const lead = entries[0];
  $("#issues").innerHTML = entries.map(([key, value]) => `<span>${key}（${value.status}）</span>`).join("") || "<span>今は大きな詰まりなし</span>";
  $("#issueTitle").textContent = lead ? `今、先に整えたいのは\n${lead[0]}` : "今、先に整えたいこと";
  $("#issueText").textContent = lead ? `いまは「${lead[0]}」を先に整えると、あなたの強みが仕事で生きやすくなります。` : "今の回答では、大きく止まっていることは見つかりませんでした。";
  $("#actionTitle").textContent = lowSignal ? "迷った質問を一つだけ思い返す" : mixedTop ? `${tieCount === 3 ? "三つ" : "二つ"}の得意を使う場面を分ける` : main.action;
  $("#actionText").textContent = lowSignal
    ? "答えに迷った場面から、今の会社で本当に優先したいことを一つ選んでみてください。"
    : mixedTop
      ? `今週の判断を一つ選び、${tiedTypes.map(type => `「${type.name}として考える部分」`).join("、")}を一行ずつ書いてください。`
      : main.actionText;

  $("#storyOffer").hidden = !eligible;
  $("#otherOffer").hidden = eligible;
  if (eligible) {
    const hasSourceMaterial = ["memo", "plan"].includes(state.planStatus);
    const material = state.planStatus === "plan" ? "事業計画書" : "構想のメモや資料";
    const customerRoute = ["お客様", "応援者"].includes(state.audience);
    const confirmedIssueKeys = ["言語化", "構想整理"].filter(key => issues[key] && issues[key].status === "確認できた");
    const issueClause = confirmedIssueKeys.length
      ? `今回の回答では、異なる質問の根拠から「${confirmedIssueKeys.join("」「")}」の課題が確認できました。`
      : "";
    const readerClause = customerRoute
      ? `${state.audience}に事業を知ってほしい状態です。`
      : `${state.audience}へ伝えたい相手も決まっています。`;
    const bodyClause = hasSourceMaterial
      ? `${material}があり、${readerClause}計画にある店・商品・人の成長を連載へ変え、物語から実際の接点へつなぐ材料があります。`
      : `${readerClause}資料がまだなくても、事業計画小説はその内容を整理しながら物語として形にする方法にもなります。`;
    const stageHook = state.stage && STAGE_STORY_HOOK[state.stage] ? STAGE_STORY_HOOK[state.stage] : "";
    $("#storyReason").textContent = `${issueClause}${bodyClause}${stageHook}`;
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
  // 緊急課題があるときだけは、事業計画小説への言及も控える（funnel-design.mdの「提案しない条件」）。
  $("#otherStoryNote").hidden = eligible || state.urgentPrimaryIssue;
  $("#shareBlock").hidden = lowSignal;
  show("result");
}

function share() {
  const url = new URL("share-result.html", location.href);
  url.searchParams.set("type", state.resultRanks[0][0]);
  url.searchParams.set("second", state.resultRanks[1][0]);
  url.searchParams.set("third", state.resultRanks[2][0]);
  if (state.mixedTop) {
    url.searchParams.set("mixed", "1");
    url.searchParams.set("ties", String(state.tieCount));
  }
  url.searchParams.set("name", state.name);
  url.searchParams.set("axes", state.resultAxes.join(","));
  return {
    text: state.mixedTop
      ? `私は「${state.tieCount === 3 ? "3つのタイプが同じくらい" : `${TYPES[state.resultRanks[0][0]].name} × ${TYPES[state.resultRanks[1][0]].name}`}」でした。\n経営の現在地診断`
      : `私は「${$("#mainType").textContent}」でした。\n2番目は「${TYPES[state.resultRanks[1][0]].name}」。\n経営の現在地診断`,
    url: url.href
  };
}

$("#startBtn").onclick = () => show("profile");
$("#profileNext").onclick = () => {
  state.index = 0;
  state.log = [];
  state.axisAnswers = [];
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


