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

  const res = await fetch(
    `https://billowing-heart-f22ajisho-proxy.zaharamikoo.workers.dev/?keyword=${encodeURIComponent(keyword)}`
  );
  const data = await res.json();

  if (!data.data || data.data.length === 0) {
    result.innerHTML = "❌ Không tìm thấy";
    return;
  }

  const results = data.data.slice(0, 5);

  result.innerHTML = results.map(item => {
    const jp = item.japanese[0];
    const word = jp.word || jp.reading;
    const reading = jp.reading;
    const meaning = item.senses[0].english_definitions.join(", ");

    return `
      <div class="card">
        <h3>${word}</h3>
        <p>📖 ${reading}</p>
        <p>➡️ ${meaning}</p>
        <button onclick="speak('${reading}')">🔊</button>
        <button onclick="saveWord('${word}','${reading}','${meaning}')">⭐</button>
      </div>
    `;
  }).join("");
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

