async function loadOfficialStory() {
  const article = document.getElementById("story-start");
  try {
    const response = await fetch("./data/arohas-ch1-ep1.txt?v=2");
    if (!response.ok) throw new Error("原稿を取得できませんでした");
    const source = (await response.text()).replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const blocks = source.split(/\n\s*\n+/).map(block => block.trim()).filter(Boolean);
    const body = blocks.filter(block => {
      const compact = block.replace(/\s/g, "");
      return !["第１章", "浅草橋の話", "第１章浅草橋の話", "第１話", "辞令", "第１話辞令", "あろはす"].includes(compact)
        && !/^段落[０-９0-9]+$/.test(compact)
        && !/^───第１話了───$/.test(compact);
    });

    article.innerHTML = "";
    body.forEach((paragraph, index) => {
      const element = document.createElement("p");
      element.textContent = paragraph.replace(/\n+/g, " ");
      if (index === 0) element.className = "drop-cap";
      article.appendChild(element);
    });
    const ending = document.createElement("p");
    ending.className = "story-ending";
    ending.textContent = "第1話　了";
    article.appendChild(ending);
  } catch (error) {
    article.innerHTML = `<p class="story-load-error">原稿を読み込めませんでした。ページを再読み込みしてください。</p>`;
    console.error(error);
  }
}

loadOfficialStory();

