// photosテーブルの作成
CREATE TABLE photos (
    photo_id INT PRIMARY KEY AUTO_INCREMENT, -- 写真ID (主キー)
    spot_id INT NOT NULL,                     -- スポットID (Spotsテーブルを参照)
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- アップロード日時

    FOREIGN KEY (spot_id) REFERENCES Spots(spot_id)

)
//  スポットに関連する写真を取得・表示するクエリ
SELECT
    photo_id  -- 写真ID
    
FROM
    photos
WHERE
    spot_id = [表示したいスポットのID]; -- スポットIDでフィルタリング

