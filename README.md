# TFT Advisor - TFT構成アドバイザー

**Patch 17.2b / ランク戦 / Silver〜Platinum 向け**

プレイ中に所持しているチャンピオン・アイテム・オーグメントを入力すると、Sティア構成との相性スコアをリアルタイムで計算し、最適な構成を提示するWebアプリです。

## 機能

- 🦸 **チャンプ選択** - Set 17の全チャンピオンをコスト別に表示・選択
- ⚗️ **アイテム / オーグメント** - 所持アイテムとオーグメントを入力
- 💡 **序盤ヒント** - ステージ・レベルに応じたリアルタイムアドバイス
- 🏆 **構成レコメンド** - スコア順にSティア構成を表示

## 対応構成（S Tier）

| 構成名 | スタイル |
|--------|--------|
| Twisted Fate リロール | Reroll |
| ダークスター カイ＝サ | Carry |
| ダークスター ジン | Carry |
| プライモーディアン | Carry |
| ベルヴェス リロール | Reroll |
| カルマ / ジン | Carry |
| フィオラ / ソナ | Reroll |
| ザヤ / ジン | Carry |
| エズリアル / チョ＝ガス | Carry |
| スターゲイザー TF | Fast 9 |

## 開発・ビルド

```bash
cd app
npm install
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
```

## 実装計画

Issue一覧は [ISSUES.md](ISSUES.md) を参照。

## データソース

MetaTFT (https://www.metatft.com/comps) のSティア構成データを参考に手動で整理。
