<?php
// =======================================================
// ========== PHP: スプレッドシート連携を想定したデータ構造 ==========
// =======================================================

// 【後でスプシから取得したデータに置き換える部分】
// スプレッドシートの各行が、この配列の要素（店舗データ）に対応すると想定します。
$dataFromSpreadsheet = [
    'name' => "喫茶店 木漏れ日", 
    'content' => "季節のフルーツを使った自家製パイが自慢です。\n静かな空間でゆっくりお過ごしください。", 
    'atmosphere' => "【お店の雰囲気】\n静かで落ち着いた雰囲気", 
    'price' => "【価格帯】\nランチ：1,500円〜", 
    'image_path' => "images/komorebi.jpg",
    // カードクリック時の遷移先URL
    'link_url' => "https://example.com/komorebi" 
];

// データの割り当て
$storeName = $dataFromSpreadsheet['name'];
$storeContent = $dataFromSpreadsheet['content'];
$storeAtmosphere = $dataFromSpreadsheet['atmosphere']; 
$storePrice = $dataFromSpreadsheet['price'];         
$imagePath = $dataFromSpreadsheet['image_path'];
$linkURL = $dataFromSpreadsheet['link_url']; // 遷移先URLを変数に格納

// 画像ファイルが存在しない場合の処理
if (!file_exists($imagePath)) {
    $imagePath = ""; 
}

// =======================================================
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($storeName); ?> - 店舗紹介カード</title>
    
    <style>
        /* 装飾の色定義 */
        :root {
            --ornament-color: #E7B258; /* 金色に近い色 (写真通り) */
            --green-color: #38614B; /* 緑の帯の色 */
            --padding-size: 20px;
        }

        /* 全体の初期設定 */
        body {
            background-color: #f0f0f0;
            display: flex;
            flex-direction: column; 
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: sans-serif;
        }

        .card-container {
            width: 350px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            cursor: pointer; 
        }

        /* 上部の緑の帯 */
        .header-band {
            background-color: var(--green-color); 
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        /* 帯の中の店舗名 */
        .header-band h1 {
            color: #fffbe9;
            font-size: 32px;
            margin: 0;
            padding: 0;
        }

        /* カード本体 */
        .info-card {
            background-color: #fffbe9;
            position: relative;
        }

        /* ------------------------------------- */
        /* SVGによる四隅のオーナメントと縦の枠線 */
        /* ------------------------------------- */
        
        .card-border {
            margin: 0 20px;
            padding: 20px;
            position: relative;
            /* 戻るボタンのスペースを確保するため、下部のパディングを増やす */
            padding-bottom: 55px; 
            background-repeat: no-repeat;
            background-position: 
                top left, top right, bottom left, bottom right;
            background-size: 40px 40px;
            
            border: 1px solid var(--ornament-color); 
            box-shadow: 0 0 0 5px #fffbe9, 
                        0 0 0 6px var(--ornament-color); 
        }

        /* 擬似要素で四隅のオーナメントを配置 (SVGはそのまま) */
        .card-border::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;

            /* 曲線を含む複雑な装飾のSVGコード */
            --svg-ornament: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Cpath d='M30 0 L 0 0 L 0 30 A 20 20 0 0 1 20 50 L 50 50' fill='none' stroke='%23C9A86B' stroke-width='2'/%3E%3Cpath d='M20 20 L 20 50 M50 20 L 20 20' fill='none' stroke='%23C9A86B' stroke-width='1'/%3E%3C/svg%3E");

            background-image: var(--svg-ornament), var(--svg-ornament), var(--svg-ornament), var(--svg-ornament);
            background-repeat: no-repeat;
            background-size: 50px 50px;

            background-position: 
                left 0 top 0, right 0 top 0, left 0 bottom 0, right 0 bottom 0;

            transform-origin: 0 0;
            transform: 
                rotate(0deg) translate(0, 0)
                rotate(90deg) translate(-100%, 0)
                rotate(-90deg) translate(0, -100%)
                rotate(180deg) translate(-100%, -100%);
        }

        /* ------------------------------------- */
        /* コンテンツエリア (デザイン) */
        /* ------------------------------------- */
        
        .photo-area {
            background-color: #e7b258; 
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #333;
            font-size: 20px;
            margin: 20px 0;
            border: 1px solid #E7B258; 
        }
        
        .photo-area img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .content-area {
            text-align: center;
            margin-top: 20px;
        }

        #store-content {
            color: #2b2b2b; 
            text-decoration: underline;
            font-size: 20px;
            font-weight: bold;
            line-height: 1.5;
            white-space: pre-wrap;
            margin-bottom: 15px;
        }
        
        .extra-details {
            text-align: left;
            padding: 0 10px;
            font-size: 16px;
            color: #555;
            line-height: 1.4;
            margin-top: 10px;
            border-top: 1px dashed #ccc;
            padding-top: 15px;
        }

        .extra-details p {
            margin: 5px 0;
            white-space: pre-wrap;
        }
        
        /* 戻るボタンのスタイル (カード内に配置) */
        .back-button {
            /* カードの右下に絶対配置 */
            position: absolute; 
            bottom: 15px; /* 下からの距離 */
            right: 15px; /* 右からの距離 */
            padding: 5px 10px;
            background-color: var(--green-color); /* 緑の帯の色に合わせる */
            color: #fffbe9; /* 白っぽい文字色 */
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            z-index: 20; /* 他の要素の上に表示 */
            transition: background-color 0.3s;
        }

        .back-button:hover {
            background-color: #2b4b39; /* 少し濃い緑 */
        }

    </style>
    </head>
<body>
    <div class="card-container" id="storeCard">
        <div class="header-band">
            <h1 id="store-name"><?php echo htmlspecialchars($storeName); ?></h1>
        </div>

        <div class="info-card">
            
            <div class="card-border">
                
                <div class="photo-area">
                    <?php if (!empty($imagePath)): ?>
                        <img src="<?php echo htmlspecialchars($imagePath); ?>" alt="<?php echo htmlspecialchars($storeName); ?>の写真">
                    <?php else: ?>
                        <p>写真</p>
                    <?php endif; ?>
                </div>

                <div class="content-area">
                    <p id="store-content"><?php echo nl2br(htmlspecialchars($storeContent)); ?></p>
                </div>

                <div class="extra-details">
                    <p><strong><?php echo nl2br(htmlspecialchars($storeAtmosphere)); ?></strong></p>
                    <p><strong><?php echo nl2br(htmlspecialchars($storePrice)); ?></strong></p>
                </div>
                
                <button class="back-button" onclick="history.back()">
                    &larr; 戻る
                </button>
            </div>
        </div>
    </div>
    

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const cardContainer = document.getElementById('storeCard');
            const linkURL = "<?php echo $linkURL; ?>"; 
            
            // クリック機能 (任意のURLへ遷移)
            cardContainer.addEventListener('click', (event) => {
                // ボタンクリック時は遷移しないように除外
                if (event.target.closest('.back-button')) {
                    return; 
                }
                
                if (linkURL && linkURL !== 'https://example.com/komorebi') { 
                    window.location.href = linkURL;
                } else {
                    // デバッグ用: alert('店舗のウェブサイトURLが設定されていません。');
                }
            });

            // 従来のホバーアニメーション
            cardContainer.addEventListener('mouseover', () => {
                cardContainer.style.transform = 'scale(1.02)';
                cardContainer.style.transition = '0.3s';
                cardContainer.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            });

            cardContainer.addEventListener('mouseout', () => {
                cardContainer.style.transform = 'scale(1)';
                cardContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            });
        });
    </script>
    </body>
</html>