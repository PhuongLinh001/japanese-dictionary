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
