<?php
// server/data/search_spots.php
header('Content-Type: application/json; charset=utf-8');

// 同じフォルダの spots.php を読み込む
require_once __DIR__ . '/spots.php';  // $spots が使えるようになる

// ---- クエリパラメータ取得 ----
$areaParam       = $_GET['area'] ?? '';        // 例: "kyoto"
$genreParam      = $_GET['genre'] ?? '';       // 例: "cafe,pan"
$atmosphereParam = $_GET['atmosphere'] ?? '';  // 例: "wafuu,cool"

// 文字列 → 配列（カンマ区切り対応）
$genreFilters = $genreParam === '' ? [] : array_filter(explode(',', $genreParam));
$atmFilters   = $atmosphereParam === '' ? [] : array_filter(explode(',', $atmosphereParam));

// ---- フィルタ処理 ----
$result = array_values(array_filter($spots, function ($spot) use ($areaParam, $genreFilters, $atmFilters) {
    // area（完全一致 or 指定なし）
    if ($areaParam !== '' && $spot['area'] !== $areaParam) {
        return false;
    }

    // genre（OR 条件）
    if (!empty($genreFilters) && !in_array($spot['genre'], $genreFilters, true)) {
        return false;
    }

    // atmosphere（スポット側は配列なので、どれか1つでも含まれていればOK）
    if (!empty($atmFilters)) {
        $spotAtmos = $spot['atmosphere'] ?? [];
        if (!is_array($spotAtmos)) {
            $spotAtmos = [$spotAtmos];
        }

        $hit = false;
        foreach ($atmFilters as $atm) {
            if (in_array($atm, $spotAtmos, true)) {
                $hit = true;
                break;
            }
        }
        if (!$hit) {
            return false;
        }
    }

    return true;
}));

// ---- JSON を返す ----
echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
