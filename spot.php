<?php
// =========================================================================
// 1. データベース接続設定 (spot_register.php)
// =========================================================================
$host = "localhost";
$user = "your_db_user";     // データベースユーザー名
$pass = "your_db_password"; // データベースパスワード
$dbname = "your_database_name"; // データベース名

$pdo = null;

try {
    // PDOでMySQLに接続
    $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8mb4", $user, $pass);
    // エラーモードを例外に設定
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("データベース接続失敗: " . $e->getMessage());
}

// =========================================================================
// 2. フォーム送信後のデータ処理
// =========================================================================
$message = ""; // ユーザーへのメッセージ

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // フォームから送られたデータを受け取る
    $spot_name = $_POST['spot_name'] ?? '';
    $city_town = $_POST['city_town'] ?? '';
    $genre_id = (int)($_POST['genre_id'] ?? 0);
    $price_range_id = (int)($_POST['price_range_id'] ?? 0);
    $avg_price = (int)($_POST['avg_price'] ?? 0);
    $opening_hours = $_POST['opening_hours'] ?? '';
    $vibe_description = $_POST['vibe_description'] ?? '';
    $main_image_url = $_POST['main_image_url'] ?? '';

    // 必須項目の簡単なチェック
    if ($spot_name && $city_town && $genre_id > 0) {
        try {
            // プリペアドステートメントでSQLインジェクションを防止
            $sql = "
                INSERT INTO Spots (
                    spot_name, prefecture, city_town, genre_id, price_range_id,
                    avg_price, opening_hours, vibe_description, main_image_url
                ) VALUES (
                    :spot_name, '京都府', :city_town, :genre_id, :price_range_id,
                    :avg_price, :opening_hours, :vibe_description, :main_image_url
                )
            ";
            $stmt = $pdo->prepare($sql);

            // パラメータをバインド
            $stmt->bindParam(':spot_name', $spot_name);
            $stmt->bindParam(':city_town', $city_town);
            $stmt->bindParam(':genre_id', $genre_id, PDO::PARAM_INT);
            $stmt->bindParam(':price_range_id', $price_range_id, PDO::PARAM_INT);
            $stmt->bindParam(':avg_price', $avg_price, PDO::PARAM_INT);
            $stmt->bindParam(':opening_hours', $opening_hours);
            $stmt->bindParam(':vibe_description', $vibe_description);
            $stmt->bindParam(':main_image_url', $main_image_url);

            // SQLを実行
            $stmt->execute();

            $message = "🎉 スポット情報「{$spot_name}」を正常に登録しました！";

        } catch (PDOException $e) {
            $message = "登録に失敗しました: " . $e->getMessage();
        }
    } else {
        $message = "エラー: スポット名、市町村、ジャンルは必須項目です。";
    }
}

// =========================================================================
// 3. マスタデータの取得 (フォームの選択肢用)
// =========================================================================

// GenresとPriceRangesのデータを取得する関数 (SQLの実行は最小限に)
function fetchMasterData($pdo, $table, $id_col, $name_col) {
    try {
        $stmt = $pdo->query("SELECT {$id_col}, {$name_col} FROM {$table} ORDER BY {$id_col}");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // エラー時は空の配列を返す
        return [];
    }
}

$genres = fetchMasterData($pdo, 'Genres', 'genre_id', 'genre_name');
$price_ranges = fetchMasterData($pdo, 'PriceRanges', 'price_range_id', 'range_name');

?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>スポット登録フォーム</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        .container { max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"], input[type="number"], select, textarea {
            width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;
        }
        button { padding: 10px 20px; background-color: #ff4567; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .message { padding: 10px; margin-bottom: 20px; border-radius: 4px; background-color: #e0ffe0; color: #008000; border: 1px solid #008000; }
        .error { background-color: #ffe0e0; color: #ff0000; border: 1px solid #ff0000; }
    </style>
</head>
<body>
    <div class="container">
        <h1>新規スポット登録</h1>
        
        <?php if ($message): ?>
            <div class="message <?php echo strpos($message, '失敗') !== false || strpos($message, 'エラー') !== false ? 'error' : ''; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label for="spot_name">店名 *</label>
                <input type="text" id="spot_name" name="spot_name" required>
            </div>
            
            <div class="form-group">
                <label for="city_town">市町村 * (例: 京都市東山区)</label>
                <input type="text" id="city_town" name="city_town" required>
            </div>
            
            <div class="form-group">
                <label for="genre_id">料理ジャンル *</label>
                <select id="genre_id" name="genre_id" required>
                    <option value="">選択してください</option>
                    <?php foreach ($genres as $genre): ?>
                        <option value="<?php echo htmlspecialchars($genre['genre_id']); ?>">
                            <?php echo htmlspecialchars($genre['genre_name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="price_range_id">価格帯</label>
                <select id="price_range_id" name="price_range_id">
                    <option value="">選択してください</option>
                    <?php foreach ($price_ranges as $range): ?>
                        <option value="<?php echo htmlspecialchars($range['price_range_id']); ?>">
                            <?php echo htmlspecialchars($range['range_name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="avg_price">相場価格 (円)</label>
                <input type="number" id="avg_price" name="avg_price" min="0">
            </div>

            <div class="form-group">
                <label for="opening_hours">営業時間 (例: 11:00〜18:00)</label>
                <input type="text" id="opening_hours" name="opening_hours">
            </div>

            <div class="form-group">
                <label for="vibe_description">店の雰囲気 (簡潔に)</label>
                <textarea id="vibe_description" name="vibe_description"></textarea>
            </div>
            
            <div class="form-group">
                <label for="main_image_url">メイン写真のURL</label>
                <input type="text" id="main_image_url" name="main_image_url">
            </div>

            <button type="submit">スポット情報を登録</button>
        </form>
    </div>
</body>
</html>