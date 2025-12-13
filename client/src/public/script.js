// client/src/public/script.js

// ボタンのON/OFFと hidden input 更新
function toggleBtn(type, el) {
  el.classList.toggle("active");

  const groupId = type === "genre" ? "genreGroup" : "atmosphereGroup";
  const hiddenId = type === "genre" ? "genreInput" : "atmosphereInput";

  const group = document.getElementById(groupId);
  const hidden = document.getElementById(hiddenId);

  // active になっているボタンの data-value を全部集める
  const selected = Array.from(group.querySelectorAll(".pill-btn.active"))
    .map((btn) => btn.dataset.value);

  // 「和モダン」だけ backend のキーに合わせて変換
  const normalized = selected.map((v) =>
    v === "wamodern" ? "wafuu_modern" : v
  );

  // カンマ区切りで hidden に入れる（例: "cafe,pan"）
  hidden.value = normalized.join(",");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // ページ内送信を止める

    const area = document.getElementById("areaSelect").value;
    const genre = document.getElementById("genreInput").value;
    const atmosphere = document.getElementById("atmosphereInput").value;

    // URLパラメータを組み立てる
    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (genre) params.set("genre", genre);
    if (atmosphere) params.set("atmosphere", atmosphere);

    // result.html に遷移して、result.js 側で表示をやる
    window.location.href = `result.html?${params.toString()}`;
  });
});
