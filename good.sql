CREATE TABLE Likes (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    spot_id INT NOT NULL,                   -- どのスポットに
    user_identifier VARCHAR(100) NOT NULL,  -- 誰が (例: 匿名ユーザーID、セッションIDなど)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (spot_id) REFERENCES Spots(spot_id),
    UNIQUE (spot_id, user_identifier) -- 同じユーザーが同じスポットに複数「いいね」できないように
);