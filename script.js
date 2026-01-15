// tab hiện tại
let currentTab = "vocab";

// đổi tab
function setTab(tab) {
  currentTab = tab;
  document.getElementById("result").innerHTML = "";
}

// khi bấm nút Tra
function search() {
  const keyword = document.getElementById("searchInput").value.trim();
  if (!keyword) return;

  if (currentTab === "grammar") {
    searchGrammar(keyword);
  } else {
    searchJisho(keyword);
  }
}

// ===== TRA TỪ / HÁN TỰ =====
async function searchJisho(keyword) {
  const result = document.getElementById("result");
  result.innerHTML = "⏳ Đang tra...";

  try {
    const res = await fetch(
      `https://billowing-heart-f22ajisho-proxy.zaharamikoo.workers.dev/?keyword=${encodeURIComponent(keyword)}`
    );

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      result.innerHTML = "❌ Không tìm thấy";
      return;
    }

    const item = data.data[0];
    const word = item.japanese[0].word || item.japanese[0].reading;
    const reading = item.japanese[0].reading;
    const meaning = item.senses[0].english_definitions.join(", ");

    result.innerHTML = `
      <h2>${word}</h2>
      <p><b>Cách đọc:</b> ${reading}</p>
      <p><b>Nghĩa:</b> ${meaning}</p>
    `;
  } catch (e) {
    result.innerHTML = "⚠️ Lỗi gọi API";
    console.error(e);
  }
}

// ===== TRA NGỮ PHÁP (DEMO) =====
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
