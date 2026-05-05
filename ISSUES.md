# TFT Companion App - 実装Issue一覧

Patch 17.2b / ランク戦 / Silver〜Platinum 向け TFT構成アドバイザーの実装計画。

## Issue一覧

| # | タイトル | 優先度 | ステータス |
|---|---------|--------|-----------|
| [#1](.github/ISSUES/issue-01-comp-data.md) | S Tier構成データの定義 | 🔴 高 | 未着手 |
| [#2](.github/ISSUES/issue-02-scoring-engine.md) | スコアリングエンジンの実装 | 🔴 高 | 未着手 |
| [#3](.github/ISSUES/issue-03-champion-selector.md) | チャンピオン選択UIの実装 | 🔴 高 | 未着手 |
| [#4](.github/ISSUES/issue-04-item-augment-selector.md) | アイテム・オーグメント選択UI | 🟡 中 | 未着手 |
| [#5](.github/ISSUES/issue-05-recommendation-display.md) | 構成レコメンド表示UI | 🔴 高 | 未着手 |
| [#6](.github/ISSUES/issue-06-early-game-hints.md) | 序盤ヒントシステム | 🟡 中 | 未着手 |
| [#7](.github/ISSUES/issue-07-state-persistence.md) | ゲーム状態の保存・リセット | 🟢 低 | 未着手 |
| [#8](.github/ISSUES/issue-08-ui-polish.md) | UIポリッシュ・スタイリング | 🟢 低 | 未着手 |

## アーキテクチャ概要

```
src/
├── data/
│   ├── comps.json          # S Tier構成データ（Issue #1）
│   ├── champions.json      # Set 17 全チャンピオン一覧
│   └── items.json          # アイテム・オーグメント一覧
├── types/
│   └── comp.ts             # TypeScript型定義
├── engine/
│   └── scorer.ts           # スコアリングエンジン（Issue #2）
├── hooks/
│   └── useGameState.ts     # ゲーム状態管理（Issue #7）
└── components/
    ├── ChampionSelector/   # Issue #3
    ├── ItemAugmentSelector/ # Issue #4
    ├── RecommendationPanel/ # Issue #5
    └── EarlyGameHints/     # Issue #6
```
