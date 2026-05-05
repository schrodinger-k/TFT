# Issue #1: S Tier構成データの定義 (Patch 17.2b / Silver-Platinum)

## 概要
MetaTFT の Patch 17.2b / ランク戦 / Silver〜Platinum のSティア構成データを JSON として定義する。

## 対象構成（S Tier 10種）

| # | 構成名 | メインキャリー | スタイル |
|---|--------|--------------|--------|
| 1 | Twisted Fate Reroll | Twisted Fate | Reroll |
| 2 | Dark Star Kai'Sa | Kai'Sa | Carry |
| 3 | Dark Star Jhin | Jhin | Carry |
| 4 | Primordian | Ezreal | Carry |
| 5 | Bel'Veth Reroll | Bel'Veth | Reroll |
| 6 | Karma / Jhin | Jhin | Carry |
| 7 | Fiora / Sona | Fiora | Reroll |
| 8 | Xayah / Jhin | Xayah | Carry |
| 9 | Ezreal / Cho'Gath | Ezreal | Carry |
| 10 | Stargazer TF | Twisted Fate | Fast 9 |

## 各構成に含めるデータ項目
- `id` / `name` / `tier`
- `style`: reroll | carry | fast9
- `units[]`: チャンピオン名・コスト・最終盤面枚数
- `keyEarlyUnits[]`: レベル4〜5で早期に引きたいチャンピオン（トリガー判定用）
- `items{}`: 各キャリーへのBIS（Best-In-Slot）アイテム
- `augments[]`: 相性の良いオーグメント（優先度付き）
- `traits[]`: 必要なトレイト・枚数
- `notes`: 序盤の狙い目テキスト

## ファイル場所
src/data/comps.json

## 完了条件
- 10構成すべてのデータが定義されている
- TypeScript型定義（src/types/comp.ts）が揃っている
- ユニットの日本語名・英語名マッピングが含まれている
