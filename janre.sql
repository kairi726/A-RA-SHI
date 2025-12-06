-- 料理ジャンル
CREATE TABLE Genres (
    genre_id INT PRIMARY KEY AUTO_INCREMENT,
    genre_name VARCHAR(50) NOT NULL UNIQUE -- 例: カフェ、イタリアン、和食
);

-- 価格帯
CREATE TABLE PriceRanges (
    price_range_id INT PRIMARY KEY AUTO_INCREMENT,
    range_name VARCHAR(50) NOT NULL UNIQUE, -- 例: 〜1000円, 1000円〜2000円, 2000円〜
    min_price INT,                          -- 最小金額 (検索用)
    max_price INT                           -- 最大金額 (検索用)
);

