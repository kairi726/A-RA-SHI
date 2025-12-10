CREATE TABLE Spots (
    spot_id INT PRIMARY KEY AUTO_INCREMENT, -- スポットID (主キー)
    spot_name VARCHAR(255) NOT NULL,        -- 店名 (例: 〇〇カフェ)
    prefecture VARCHAR(50) NOT NULL DEFAULT '京都府', -- 都道府県 (初期は京都に固定)
    city_town VARCHAR(50) NOT NULL,         -- 市町村 (例: 京都市東山区)
    station_name VARCHAR(50),               -- 最寄りの駅名
    genre_id INT,                           -- 料理ジャンルID (Genresテーブルを参照)
    price_range_id INT,                     -- 価格帯ID (PriceRangesテーブルを参照)
    avg_price INT,                          -- 相場価格 (数値)
    opening_hours VARCHAR(255),             -- 営業時間 (例: 11:00～18:00)
    vibe_description TEXT,                  -- 店の雰囲気 (例: 隠れ家、レトロ、開放的)
    main_image_url VARCHAR(255),            -- メイン写真のURL
    is_hidden_gem BOOLEAN DEFAULT FALSE,    -- 隠れた名店フラグ (優位性)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 登録日時
    
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id),
    FOREIGN KEY (price_range_id) REFERENCES PriceRanges(price_range_id)
);
