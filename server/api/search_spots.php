<?php
// server/api/search_spots.php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../data/spots.php';

// GET パラメータ取得
$area       = $_GET['area'] ?? '';
$genre      = $_GET['genre'] ?? '';
$atmosphere = $_GET['atmosphere'] ?? '';

// フィルタリング
$results = array_filter($spots, function ($spot) use ($area, $genre, $atmosphere) {
    if ($area !== '' && $spot['area'] !== $area) {
        return false;
    }

    if ($genre !== '' && $spot['genre'] !== $genre) {
        return false;
    }

    if ($atmosphere !== '') {
        // atmosphere は配列なので in_array で判定
        if (!in_array($atmosphere, $spot['atmosphere'], true)) {
            return false;
        }
    }

    return true;
});

// インデックスを振り直し
$results = array_values($results);

// JSON で返す
echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
