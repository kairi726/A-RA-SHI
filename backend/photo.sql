<?php

// ===================================================================
// 2. POST送信（登録処理）
// ===================================================================
$message = "";
$uploaded_image_url = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $spot_name = $_POST["spot_name"] ?? "";
    $city_town = $_POST["city_town"] ?? "";
    $genre_id = (int)($_POST["genre_id"] ?? 0);
    $price_range_id = (int)($_POST["price_range_id"] ?? 0);
    $avg_price = (int)($_POST["avg_price"] ?? 0);
    $opening_hours = $_POST["opening_hours"] ?? "";
    $vibe_description = $_POST["vibe_description"] ?? "";

    // -------------------------------
    // ★ 写真アップロード処理
    // -------------------------------
    $image_url = null;

    if (isset($_FILES["main_image"]) && $_FILES["main_image"]["error"] === UPLOAD_ERR_OK) {

        $upload_dir = "uploads/";

        // フォルダがなければ作る
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        // ユニークなファイル名を生成
        $unique_name = uniqid() . "_" . basename($_FILES["main_image"]["name"]);
        $upload_path = $upload_dir . $unique_name;

        // ファイル保存
        if (move_uploaded_file($_FILES["main_image"]["tmp_name"], $upload_path)) {
            $image_url = $upload_path; // DBに保存されるパス
            $uploaded_image_url = $image_url; // 登録後にプレビュー用
        }
    }

    // -------------------------------
    // 必須項目チェック
    // -------------------------------
    if ($spot_name && $city_town && $genre_id > 0) {

        try {
            $sql = "
                INSERT INTO Spots (
                    spot_name, prefecture, city_town, genre_id, price_range_id,
                    avg_price, opening_hours, vibe_description, main_image_url
                )
                VALUES (
                    :spot_name, '京都府', :city_town, :genre_id, :price_range_id,
                    :avg_price, :opening_hours, :vibe_description, :main_image_url
                )
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(":spot_name", $spot_name);
            $stmt->bindParam(":city_town", $city_town);
            $stmt->bindParam(":genre_id", $genre_id, PDO::PARAM_INT);
            $stmt->bindParam(":price_range_id", $price_range_id, PDO::PARAM_INT);
            $stmt->bindParam(":avg_price", $avg_price, PDO::PARAM_INT);
            $stmt->bindParam(":opening_hours", $opening_hours);
            $stmt->bindParam(":vibe_description", $vibe_description);
            $stmt->bindParam(":main_image_url", $image_url);

            $stmt->execute();

            $message = "🎉 スポット「{$spot_name}」が登録されました！";

        } catch (PDOException $e) {
            $message = "登録失敗: " . $e->getMessage();
        }

    } else {
        $message = "スポット名、市町村、ジャンルは必須です。";
    }
}

// ===================================================================
// 3. マスタデータ取得
// ===================================================================
function fetchMasterData($pdo, $table, $id_col, $name_col)
{
    try {
        $stmt = $pdo->query("SELECT {$id_col}, {$name_col} FROM {$table}");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch {
        return [];
    }
}

$genres = fetchMasterData($pdo, "Genres", "genre_id", "genre_name");
$price_ranges = fetchMasterData($pdo, "PriceRanges", "price_range_id", "range_name");

?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>スポット登録フォーム</title>
<style>
body { font-family: sans-serif; padding: 20px; }
.container { width: 600px; margin: auto; }
.preview { margin-top: 10px; }
.preview img { width: 200px; border-radius: 10px; }
</style>
</head>
<body>

<div class="container">
    <h1>新規スポット登録</h1>

    <?php if ($message): ?>
        <p><?= htmlspecialchars($message) ?></p>
    <?php endif; ?>

    <!-- 登録後に画像をプレビュー表示 -->
    <?php if ($uploaded_image_url): ?>
        <div class="preview">
            <p>アップロードされた画像：</p>
            <img src="<?= htmlspecialchars($uploaded_image_url) ?>" alt="uploaded image">
        </div>
    <?php endif; ?>

    <form method="POST" enctype="multipart/form-data">

        <label>店名 *</label>
        <input type="text" name="spot_name" required>

        <label>市町村 *</label>
        <input type="text" name="city_town" required>

        <label>料理ジャンル *</label>
        <select name="genre_id" required>
            <option value="">選択</option>
            <?php foreach ($genres as $g): ?>
                <option value="<?= $g['genre_id'] ?>"><?= htmlspecialchars($g['genre_name']) ?></option>
            <?php endforeach; ?>
        </select>

        <label>価格帯</label>
        <select name="price_range_id">
            <option value="">選択</option>
            <?php foreach ($price_ranges as $p): ?>
                <option value="<?= $p['price_range_id'] ?>"><?= htmlspecialchars($p['range_name']) ?></option>
            <?php endforeach; ?>
        </select>

        <label>相場価格</label>
        <input type="number" name="avg_price">

        <label>営業時間</label>
        <input type="text" name="opening_hours">

        <label>店の雰囲気</label>
        <textarea name="vibe_description"></textarea>

        <label>メイン写真（アップロード）</label>
        <input type="file" name="main_image" accept="image/*">

        <button type="submit">登録する</button>
    </form>
</div>

</body>
</html>
