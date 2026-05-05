# Issue #2: スコアリングエンジンの実装

## 概要
現在の所持チャンピオン・アイテム・オーグメントをもとに、各S Tier構成との相性スコアを計算するエンジン。

## スコア計算ロジック

### 1. チャンピオンスコア (最大50点)
- 所持ユニットが構成の keyEarlyUnits に含まれる → +15点/体
- 所持ユニットが構成の units に含まれる → +5点/体
- キャリーが2枚以上いる → +10点ボーナス

### 2. オーグメントスコア (最大30点)
- 構成の推奨オーグメントと一致 → +15点/個 (優先度HIGH)
- 構成の推奨オーグメントと一致 → +8点/個 (優先度MEDIUM)
- 関連トレイトエンブレム → +10点

### 3. アイテムスコア (最大20点)
- キャリーのBISアイテムコンポーネントを所持 → +5点/個
- BISフルアイテム完成 → +10点/個

## API設計
```
calculateScores(playerState: PlayerState): CompScore[]

interface PlayerState {
  champions: string[]     // 所持チャンピオン名リスト
  items: string[]         // 所持アイテム名リスト
  augments: string[]      // 取得オーグメント名リスト (最大3個)
}

interface CompScore {
  comp: Comp
  totalScore: number      // 0〜100
  championScore: number
  augmentScore: number
  itemScore: number
  matchedEarlyUnits: string[]   // マッチした早期ユニット
  recommendation: string        // "狙い目！" | "選択肢" | "要検討"
}
```

## ファイル場所
src/engine/scorer.ts

## 完了条件
- 全スコアの合計が正規化されている（0〜100）
- 同点時は augmentScore → championScore の優先順位でソート
- 単体テストが用意されている
