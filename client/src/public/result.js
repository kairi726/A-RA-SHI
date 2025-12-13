// result.js

document.addEventListener("DOMContentLoaded", () => {
    const listEl = document.getElementById("shop-list");

    // クエリパラメータ取得（area, genre, atmosphere）
    const params = new URLSearchParams(location.search);
    const area = params.get("area") || "";
    const genre = params.get("genre") || "";
    const atmosphere = params.get("atmosphere") || "";

    // 表示用ラベル（必要なら）
    const areaLabel = {
        kyoto: "京都市",
        uji: "宇治市",
        kizugawa: "木津川市",
        yosano: "与謝野市",
        kameoka: "亀岡市",
        "": "指定なし"
    };

    const genreLabel = {
        cafe: "カフェ",
        washoku: "和食",
        yoshoku: "洋食",
        izakaya: "居酒屋",
        chuka: "中華",
        ramen: "ラーメン",
        italian: "イタリアン",
        pan: "パン",
        "": "指定なし"
    };

    const atmosphereLabel = {
        cool: "クール",
        cute: "キュート",
        retro: "レトロ",
        wafuu: "和風",
        youfuu: "洋風",
        gorgeous: "ゴージャス",
        fancy: "ファンシー",
        simple: "シンプル",
        kakurega: "隠れ家",
        wafuu_modern: "和モダン",
        "": "指定なし"
    };

    // 検索条件をコンソールに出しておく（デバッグ用）
    console.log("area:", area, "genre:", genre, "atmosphere:", atmosphere);

    // API の URL（パスは環境に合わせて調整してね）
    const apiBase = "/server/api/search_spots.php";
    const apiParams = new URLSearchParams();
    if (area) apiParams.set("area", area);
    if (genre) apiParams.set("genre", genre);
    if (atmosphere) apiParams.set("atmosphere", atmosphere);

    const apiUrl = apiBase + "?" + apiParams.toString();

    fetch(apiUrl)
        .then(res => {
            if (!res.ok) {
                throw new Error("ネットワークエラー: " + res.status);
            }
            return res.json();
        })
        .then(data => {
            console.log("API レスポンス:", data);
            renderShops(data);
        })
        .catch(err => {
            console.error(err);
            listEl.innerHTML = `<p style="text-align:center; padding:20px;">エラーが発生しました…</p>`;
        });

    /**
     * 店舗リストを DOM に描画
     * @param {Array} shops
     */
    function renderShops(shops) {
        if (!shops || shops.length === 0) {
            listEl.innerHTML = `<p style="text-align:center; padding:20px;">条件に合うお店が見つかりませんでした。</p>`;
            return;
        }

        // 一旦中身クリア
        listEl.innerHTML = "";

        shops.forEach(spot => {
            const frameWrapper = document.createElement("div");
            frameWrapper.className = "elegant-frame";

            const frame = document.createElement("div");
            frame.className = "fancy-frame";
            frame.dataset.id = spot.id;  // 詳細ページに渡す用

            // 雰囲気は配列なので、文字列に整形
            let atmosText = "";
            if (Array.isArray(spot.atmosphere)) {
                atmosText = spot.atmosphere
                    .map(key => atmosphereLabel[key] || key)
                    .join("・");
            } else if (typeof spot.atmosphere === "string") {
                atmosText = atmosphereLabel[spot.atmosphere] || spot.atmosphere;
            }

            frame.innerHTML = `
                <div>${escapeHtml(spot.name)}</div>
                <div>${escapeHtml(spot.time || "")}</div>
                <div>${escapeHtml(spot.price || "")}</div>
                <div>${escapeHtml(atmosText || "")}</div>
            `;

            // クリックで詳細ページへ遷移（next.html?id=◯◯）
            frame.addEventListener("click", () => {
                // ここは PHP で作るなら next.php?id=◯◯ にしてもOK
                location.href = `next.html?id=${encodeURIComponent(spot.id)}`;
            });

            frameWrapper.appendChild(frame);
            listEl.appendChild(frameWrapper);
        });
    }

    /**
     * 簡易エスケープ（XSS対策）
     */
    function escapeHtml(str) {
        if (str == null) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
});
