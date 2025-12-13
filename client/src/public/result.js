// client/src/public/result.js

document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("shop-list");

  // 1. URLパラメータ取得（search.html から渡される想定）
  const params = new URLSearchParams(location.search);
  const areaParam = params.get("area") || "";
  const genreParam = params.get("genre") || "";          // カンマ区切りOK: "cafe,pan"
  const atmosphereParam = params.get("atmosphere") || ""; // カンマ区切りOK: "wafuu,cool"

  const genreFilters = genreParam ? genreParam.split(",").filter(Boolean) : [];
  const atmFilters = atmosphereParam ? atmosphereParam.split(",").filter(Boolean) : [];

  console.log("[DEBUG] area:", areaParam, "genre:", genreFilters, "atm:", atmFilters);

  // 2. 表示用ラベル
  const atmosphereLabel = {
    wafuu: "和風",
    kakurega: "隠れ家",
    simple: "シンプル",
    cool: "クール",
    cute: "キュート",
    fancy: "ファンシー",
    wafuu_modern: "和モダン",
    youfuu: "洋風",
    gorgeous: "ゴージャス",
    retro: "レトロ",
    "": "指定なし"
  };

  // 3. PHPから移植したSPOTSデータ（フロント側で持つ）
  const SPOTS = [
    {
      id: 1,
      name: "よーじやカフェ",
      area: "kyoto",
      genre: "cafe",
      atmosphere: ["wafuu", "kakurega"],
      address: "京都府京都市右京区嵯峨天龍寺立石町2",
      time: "10:00-18:00",
      cd: "無休",
      price: "¥1,000~1,999",
      pay: "現金、カード、QR決済",
      atm: "",
      photo: "",
      access: "JR「嵯峨嵐山駅」より徒歩約10分　嵐電「嵐山駅」より徒歩約10分",
      url: "https://yojiyacafe.com/shop/sagano/"
    },
    {
      id: 2,
      name: "パンとエスプレッソと嵐山庭園",
      area: "kyoto",
      genre: "pan",
      atmosphere: ["wafuu", "simple"],
      address: "京都府京都市右京区嵯峨天龍寺芒ノ馬場町45-15",
      time: "8:00-18:00",
      cd: "不定休",
      price: "¥1,000~2,000",
      pay: "カード、QR決済、電子マネー不可",
      atm: "",
      photo: "",
      access: "嵐電「嵐山駅」より徒歩約5分　阪急「嵐山駅」から徒歩約15分",
      url: "https://bread-espresso.jp"
    },
    {
      id: 3,
      name: "JAKUCHU CAFE（旧 CAFE CUBE)",
      area: "kyoto",
      genre: "cafe",
      atmosphere: ["youfuu", "cool"],
      address: "京都府京都市左京区岡崎最勝寺町6-3（細見美術館 B2F）",
      time: "10:30-17:00",
      cd: "月曜",
      price: "¥1,000~2,000",
      pay: "現金、カード",
      atm: "",
      photo: "",
      access: "地下鉄「東山駅」徒歩8分",
      url: "https://www.artcube-kyoto.co.jp/cafecube/index.html"
    },
    {
      id: 4,
      name: "茶寮 八翠",
      area: "kyoto",
      genre: "washoku",
      atmosphere: ["wafuu", "gorgeous"],
      address: "京都府京都市右京区嵯峨天龍寺芒ノ馬場町12（翠嵐ラグジュアリーコレクションホテル京都内）",
      time: "11:00-17:00",
      cd: "無休",
      price: "¥2,000",
      pay: "カード、QR決済",
      atm: "",
      photo: "",
      access: "嵐電「嵐山駅」から徒歩6〜7分　JR嵯峨野線「嵯峨嵐山駅」から徒歩約15分",
      url: "https://www.suihotels.com/suiran-kyoto/restaurant/cafe-hassui"
    },
    {
      id: 5,
      name: "きょうとコーヒースタンド 二条小屋",
      area: "kyoto",
      genre: "cafe",
      atmosphere: ["simple", "kakurega"],
      address: "京都府京都市中京区西ノ京職司町67-38",
      time: "11:00-18:00",
      cd: "火曜",
      price: "¥500~1,000",
      pay: "現金",
      atm: "",
      photo: "",
      access: "地下鉄「二条城前駅」徒歩5分",
      url: ""
    },
    {
      id: 6,
      name: "Sweets Cafe KYOTO KEIZO（三条本店）",
      area: "kyoto",
      genre: "cafe",
      atmosphere: ["cute", "fancy"],
      address: "京都府京都市中京区御供町293",
      time: "11:00-18:00",
      cd: "月曜(不定休あり)",
      price: "¥1,000~2,000",
      pay: "現金、カード",
      atm: "",
      photo: "",
      access: "地下鉄「二条城前駅」徒歩6分",
      url: ""
    },
    {
      id: 7,
      name: "和カフェ 季の音（KINO-NE）",
      area: "kyoto",
      genre: "cafe",
      atmosphere: ["wafuu", "wafuu_modern"],
      address: "京都府京都市下京区四条通寺町東入2丁目御旅町35 京都藤井大丸 4F",
      time: "11:00-19:00",
      cd: "不定休",
      price: "¥1,000~1,800",
      pay: "現金、カード、電子マネー",
      atm: "",
      photo: "",
      access: "阪急「京都河原町駅」徒歩1分",
      url: "https://kyoto-kinone.jp"
    },
    {
      id: 8,
      name: "中村藤吉本店",
      area: "uji",
      genre: "cafe",
      atmosphere: ["wafuu", "retro"],
      address: "京都府宇治市宇治壱番10",
      time: "10:00-18:00",
      cd: "無休",
      price: "¥1,000~2,000",
      pay: "現金、カード",
      atm: "",
      photo: "",
      access: "JR「宇治駅」から徒歩約1分　京阪「宇治駅」から徒歩約3分",
      url: "https://tokichi.jp"
    },
    {
      id: 9,
      name: "Walden Woods Kyoto（ウォールデン ウッズ キョウト）",
      area: "kyoto",
      genre: "cafe",
      atmosphere: ["simple", "cool"],
      address: "京都府京都市下京区富小路通高辻上ル筋屋町239-1",
      time: "9:00-18:00",
      cd: "不定休",
      price: "¥600~1,200",
      pay: "現金、カード",
      atm: "",
      photo: "",
      access: "地下鉄「五条駅」徒歩8分",
      url: ""
    },
    {
      id: 10,
      name: "一保堂茶舗 喫茶室 嘉木",
      area: "kyoto",
      genre: "cafe",
      atmosphere: ["wafuu", "simple"],
      address: "京都府京都市東山区一橋野本町44-1（一保堂茶舗 本店併設）",
      time: "10:00-18:00",
      cd: "不定休",
      price: "¥800~1,500",
      pay: "現金、カード",
      atm: "",
      photo: "",
      access: "京阪「神宮丸太町駅」から徒歩約8〜10分　市バス「一保堂前」",
      url: "https://www.ippodo-tea.co.jp/pages/store-kyoto?view=store-detail"
    },
    {
      id: 11,
      name: "西陣 ゑびや",
      area: "kyoto",
      genre: "washoku",
      atmosphere: ["retro", "wafuu"],
      address: "京都府京都市上京区大宮通五辻上ル芝大宮町芝大宮町21",
      time: "11:00-16:00",
      cd: "水曜",
      price: "¥1,000~2,000",
      pay: "現金のみ",
      atm: "",
      photo: "",
      access: "地下鉄烏丸線「今出川駅」徒歩15分　「鞍馬口駅」徒歩17分　「北大路駅」徒歩22分",
      url: ""
    },
    {
      id: 12,
      name: "つくもうどん　塩小路本店",
      area: "kyoto",
      genre: "washoku",
      atmosphere: ["simple"],
      address: "京都府京都市下京区東塩小路町901 JR京都駅構内地下東口",
      time: "7:00-22:00",
      cd: "無休",
      price: "~¥1,000",
      pay: "現金、カード、QR決済",
      atm: "",
      photo: "",
      access: "地下鉄烏丸駅「京都駅」徒歩2分",
      url: "https://ke8w300.gorp.jp/"
    },
    {
      id: 13,
      name: "グリル小宝",
      area: "kyoto",
      genre: "yoshoku",
      atmosphere: ["retro", "youfuu"],
      address: "京都府京都市左京区岡崎北御所町46",
      time: "11:30-20:30",
      cd: "火、水曜",
      price: "¥1,000~2,000",
      pay: "現金、カード、QR決済",
      atm: "",
      photo: "",
      access: "地下鉄東西線「東山駅」徒歩15分",
      url: ""
    },
    {
      id: 14,
      name: "和醸良麺 すがり",
      area: "kyoto",
      genre: "ramen",
      atmosphere: ["kakurega"],
      address: "京都府京都市中京区観音堂町471−1",
      time: "11:30-15:00, 18:00-22:00",
      cd: "年末年始",
      price: "¥1,000~2,000",
      pay: "現金、カード、QR決済",
      atm: "",
      photo: "",
      access: "阪急京都線「烏丸駅」、地下鉄烏丸線「四条駅」徒歩2分",
      url: ""
    },
    {
      id: 15,
      name: "益や酒店",
      area: "kyoto",
      genre: "izakaya",
      atmosphere: ["wafuu", "cool"],
      address: "京都府京都市中京区御幸町通り四条上ル大日町426",
      time: "12,15:00-23:30",
      cd: "不定期",
      price: "¥3,000~4,000",
      pay: "現金、カード、PayPay",
      atm: "",
      photo: "",
      access: "「京都河原町駅」徒歩2分",
      url: "https://masuya.kyoto/"
    },
    {
      id: 16,
      name: "私房菜 すみよし",
      area: "kyoto",
      genre: "chuka",
      atmosphere: ["simple", "youfuu"],
      address: "京都府京都市東山区妙法院前側町420",
      time: "11:30-14:00, 17:30-22:00",
      cd: "火曜",
      price: "¥1,000~6,000",
      pay: "現金、カード",
      atm: "",
      photo: "",
      access: "京阪本線「清水五条駅」徒歩10分、「七条駅」徒歩13分",
      url: "https://kdhx300.gorp.jp/"
    },
    {
      id: 17,
      name: "山本まんぼ",
      area: "kyoto",
      genre: "yoshoku",
      atmosphere: ["retro"],
      address: "京都府京都市下京区小稲荷町61−54",
      time: "10:00-22:00",
      cd: "水曜",
      price: "¥1,000~2,000",
      pay: "現金のみ",
      atm: "",
      photo: "",
      access: "烏丸線「京都駅」徒歩4分",
      url: ""
    },
    {
      id: 18,
      name: "大鵬",
      area: "kyoto",
      genre: "chuka",
      atmosphere: ["retro", "simple"],
      address: "京都府京都市中京区西ノ京星池町149",
      time: "11:30-14:15, 17:30-21:00",
      cd: "火曜",
      price: "¥1,000~6,000",
      pay: "現金、カード",
      atm: "",
      photo: "",
      access: "JR線「二条駅」徒歩3分、地下鉄東西線「二条駅」徒歩1分",
      url: ""
    },
    {
      id: 19,
      name: "麺屋 猪一",
      area: "kyoto",
      genre: "ramen",
      atmosphere: ["simple"],
      address: "京都府京都市下京区恵美須之町寺町通仏光寺下ル542",
      time: "11:00-14:30, 17:30-21:00",
      cd: "不定期",
      price: "¥1,000~3,000",
      pay: "現金、カード、電子マネー、QR決済",
      atm: "",
      photo: "",
      access: "「京都河原町駅」徒歩3分",
      url: ""
    },
    {
      id: 20,
      name: "たま木亭",
      area: "uji",
      genre: "pan",
      atmosphere: ["simple", "kakurega"],
      address: "京都府宇治市五ヶ庄平野57-14",
      time: "8:00-18:45",
      cd: "月、火、水曜",
      price: "¥1,000~2,000",
      pay: "現金のみ",
      atm: "",
      photo: "",
      access: "JR奈良線「黄檗駅」徒歩5分、「京阪黄檗駅」徒歩6分",
      url: "http://www.tamaki-tei.com/"
    }
  ];

  // 4. フィルタリング
  const filtered = SPOTS.filter((spot) => {
    const okArea = !areaParam || spot.area === areaParam;
    const okGenre =
      genreFilters.length === 0 || genreFilters.includes(spot.genre);

    let okAtm = true;
    if (atmFilters.length > 0) {
      const atmos = Array.isArray(spot.atmosphere)
        ? spot.atmosphere
        : [spot.atmosphere];
      okAtm = atmFilters.some((atm) => atmos.includes(atm));
    }

    return okArea && okGenre && okAtm;
  });

  renderShops(filtered);

  function renderShops(shops) {
    if (!shops || shops.length === 0) {
      listEl.innerHTML =
        `<p style="text-align:center; padding:20px;">条件に合うお店が見つかりませんでした。</p>`;
      return;
    }

    listEl.innerHTML = "";

    shops.forEach((spot) => {
      const wrapper = document.createElement("div");
      wrapper.className = "elegant-frame";

      const frame = document.createElement("div");
      frame.className = "fancy-frame";

      const atmosText = (Array.isArray(spot.atmosphere)
        ? spot.atmosphere
        : [spot.atmosphere]
      )
        .map((key) => atmosphereLabel[key] || key)
        .join("・");

      frame.innerHTML = `
        <div>${escapeHtml(spot.name)}</div>
        <div>${escapeHtml(spot.time || "")}</div>
        <div>${escapeHtml(spot.price || "")}</div>
        <div>${escapeHtml(atmosText)}</div>
      `;

      // 🔽 ここを追加：カードクリックで詳細ページへ
      frame.addEventListener("click", () => {
        location.href = `result2.html?id=${spot.id}`;
      });

      wrapper.appendChild(frame);
      listEl.appendChild(wrapper);
    });
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
});
