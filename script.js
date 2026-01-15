let currentTab = "vocab";

function setTab(tab) {
  currentTab = tab;
  document.getElementById("result").innerHTML = "";
}

async function search() {
  const keyword = document.getElementById("searchInput").value.trim();
  if (!keyword) return;

  if (currentTab === "vocab" || currentTab === "kanji") {
    searchJisho(keyword);
  } else {
    searchGrammar(keyword);
  }
}

async function searchJisho(keyword) {
  const res = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${keyword}`
  );
  const data = await res.json();

  if (data.data.length === 0) {
    document.getElementById("result").innerHTML = "❌ Không tìm thấy";
    return;
  }

  const item = data.data[0];
  const word = item.japanese[0].word || item.japanese[0].reading;
  const reading = item.japanese[0].reading;
  const meaning = item.senses[0].english_definitions.join(", ");

  document.getElementById("result").innerHTML = `
    <h2>${word}</h2>
    <p><b>Cách đọc:</b> ${reading}</p>
    <p><b>Nghĩa:</b> ${meaning}</p>
  `;
}

function searchGrammar(keyword) {
  const grammarDB = [
    {
      pattern: "〜ている",
      meaning: "Diễn tả hành động đang diễn ra",
      example: "日本語を勉強している。"
    },
    {
      pattern: "〜ないでください",
      meaning: "Xin đừng làm gì",
      example: "ここでタバコを吸わないでください。"
    }
  ];

  const found = grammarDB.find(g => g.pattern.includes(keyword));

  if (!found) {
    document.getElementById("result").innerHTML = "❌ Không tìm thấy ngữ pháp";
    return;
  }

  document.getElementById("result").innerHTML = `
    <h2>${found.pattern}</h2>
    <p><b>Ý nghĩa:</b> ${found.meaning}</p>
    <p><b>Ví dụ:</b> ${found.example}</p>
  `;
}
