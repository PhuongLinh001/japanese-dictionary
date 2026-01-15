console.log("script.js loaded");

// ===== TAB STATE =====
let currentTab = "vocab";

// ===== TAB SWITCH =====
function setTab(tab) {
  currentTab = tab;
  document.getElementById("result").innerHTML = "";
}

// ===== SEARCH BUTTON =====
function search() {
  const keyword = document.getElementById("searchInput").value.trim();
  if (!keyword) return;

  if (currentTab === "grammar") {
    searchGrammar(keyword);
  } else {
    searchJisho(keyword);
  }
}

// ===== JISHO SEARCH =====
async function searchJisho(keyword) {
  const result = document.getElementById("result");
  result.innerHTML = "⏳ Đang tra...";

  try {
    const res = await fetch(
      `https://kanjiapi.dev/v1/words/${encodeURIComponent(keyword)}`
    );

    if (!res.ok) {
      result.innerHTML = "❌ Không tìm thấy";
      return;
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      result.innerHTML = "❌ Không tìm thấy";
      return;
    }

    result.innerHTML = data.slice(0, 5).map(item => {
      const v = item.variants[0];
      const word = v.written || v.pronounced;
      const reading = v.pronounced;
      const meanings = item.meanings
        .map(m => m.glosses.join(", "))
        .join("; ");

      return `
        <div class="card">
          <h3>${word}</h3>
          <p>📖 ${reading}</p>
          <p>➡️ ${meanings}</p>
          <button onclick="speak('${reading}')">🔊</button>
          <button onclick="saveWord('${word}','${reading}','${meanings}')">⭐</button>
        </div>
      `;
    }).join("");

  } catch (e) {
    console.error(e);
    result.innerHTML = "⚠️ Lỗi mạng";
  }
}

// ===== GRAMMAR DEMO =====
function searchGrammar(keyword) {
  document.getElementById("result").innerHTML =
    "📘 Ngữ pháp demo – chưa triển khai";
}

// ===== KANJI SEARCH =====
async function searchKanji(kanji) {
  const result = document.getElementById("result");
  result.innerHTML = "⏳ Đang tra Hán tự...";

  const res = await fetch(
    `https://billowing-heart-f22ajisho-proxy.zaharamikoo.workers.dev/?keyword=${kanji}`
  );
  const data = await res.json();

  const item = data.data[0];

  result.innerHTML = `
    <h2>${kanji}</h2>
    <p>📖 Cách đọc: ${item.japanese[0].reading}</p>
    <p>📘 Nghĩa: ${item.senses[0].english_definitions.join(", ")}</p>
    <button onclick="speak('${item.japanese[0].reading}')">🔊 Nghe</button>
  `;
}

// ===== SPEAK =====
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  speechSynthesis.speak(utter);
}

// ===== SAVEWORK =====
function saveWord(word, reading, meaning) {
  const list = JSON.parse(localStorage.getItem("savedWords") || "[]");
  list.push({ word, reading, meaning });
  localStorage.setItem("savedWords", JSON.stringify(list));
  alert("⭐ Đã lưu từ");
}

function showSaved() {
  const list = JSON.parse(localStorage.getItem("savedWords") || "[]");
  const result = document.getElementById("result");

  if (list.length === 0) {
    result.innerHTML = "📭 Chưa có từ nào";
    return;
  }

  result.innerHTML = list.map(w => `
    <div class="card">
      <h3>${w.word}</h3>
      <p>${w.reading}</p>
      <p>${w.meaning}</p>
    </div>
  `).join("");
}


