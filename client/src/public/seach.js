// client/src/public/script.js

// ボタンON/OFFして hidden input に値を入れる関数（HTMLの onclick から呼ばれる）
window.toggleBtn = function (type, el) {
  el.classList.toggle("active");

  const groupId = type === "genre" ? "genreGroup" : "atmosphereGroup";
  const inputId = type === "genre" ? "genreInput" : "atmosphereInput";

  const group = document.getElementById(groupId);
  const input = document.getElementById(inputId);
  if (!group || !input) return;

  const selected = Array.from(group.querySelectorAll(".pill-btn.active"))
    .map((btn) => btn.dataset.value)
    .filter(Boolean)
    // HTMLでは "wamodern" だけど、データは "wafuu_modern" なのでここで揃える
    .map((v) => (v === "wamodern" ? "wafuu_modern" : v));

  input.value = selected.join(",");
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // その場で送信せず、手動でページ遷移する

    const area = document.getElementById("areaSelect")?.value || "";
    const genre = document.getElementById("genreInput")?.value || "";
    const atmosphereRaw =
      document.getElementById("atmosphereInput")?.value || "";

    // 念のためここでも "wamodern" → "wafuu_modern" に揃える
    const atmList = atmosphereRaw
      .split(",")
      .filter(Boolean)
      .map((v) => (v === "wamodern" ? "wafuu_modern" : v));
    const atmosphere = atmList.join(",");

    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (genre) params.set("genre", genre);
    if (atmosphere) params.set("atmosphere", atmosphere);

    // 🔽 ここで result.html に画面遷移！
    // search.html と result.html が同じフォルダにある想定
    location.href = `result.html?${params.toString()}`;
  });
});
