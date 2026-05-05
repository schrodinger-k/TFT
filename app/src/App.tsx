import { useMemo, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { calculateScores } from './engine/scorer';
import ChampionSelector from './components/ChampionSelector';
import ItemAugmentSelector from './components/ItemAugmentSelector';
import RecommendationPanel from './components/RecommendationPanel';
import EarlyGameHints from './components/EarlyGameHints';
import compsData from './data/comps.json';
import type { Comp } from './types/comp';

const comps = compsData as Comp[];

type Tab = 'champs' | 'items' | 'hints' | 'result';

const TAB_LABELS: Record<Tab, string> = {
  champs: '🦸 チャンプ',
  items: '⚗️ アイテム',
  hints: '💡 ヒント',
  result: '🏆 結果',
};

export default function App() {
  const { state, toggleChampion, toggleItem, toggleAugment, setLevel, setStage, resetGame } = useGameState();
  const [tab, setTab] = useState<Tab>('champs');

  const scores = useMemo(() => calculateScores(comps, state), [state]);

  const topScore = scores[0]?.totalScore ?? 0;
  const hasGoodMatch = topScore >= 60;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d1a',
      color: '#ffffff',
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      maxWidth: '640px',
      margin: '0 auto',
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0533, #0d1b40)',
        padding: '16px 20px',
        borderBottom: '1px solid #2a2a5a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#c084fc' }}>
            ✦ TFT Advisor
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Patch 17.2b / Silver〜Platinum / Sティア
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {hasGoodMatch && (
            <span style={{
              padding: '4px 10px', background: '#166534', borderRadius: '20px',
              fontSize: '12px', color: '#86efac', fontWeight: 'bold',
            }}>
              🎯 狙い目あり
            </span>
          )}
          <button
            onClick={resetGame}
            style={{
              padding: '6px 12px', borderRadius: '6px', border: '1px solid #444',
              background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '12px',
            }}
          >
            リセット
          </button>
        </div>
      </div>

      {/* ステータスバー */}
      <div style={{
        padding: '8px 20px',
        background: '#111128',
        borderBottom: '1px solid #2a2a4a',
        display: 'flex', gap: '16px', fontSize: '12px',
      }}>
        <span style={{ color: '#4a4aff' }}>
          チャンプ {state.champions.length}体
        </span>
        <span style={{ color: '#f59e0b' }}>
          アイテム {state.items.length}個
        </span>
        <span style={{ color: '#7c3aed' }}>
          オーグメント {state.augments.length}/3
        </span>
        {scores[0] && (
          <span style={{ marginLeft: 'auto', color: '#22c55e', fontWeight: 'bold' }}>
            TOP: {scores[0].comp.name} ({scores[0].totalScore}点)
          </span>
        )}
      </div>

      {/* タブナビ */}
      <div style={{
        display: 'flex', background: '#111128',
        borderBottom: '1px solid #2a2a4a',
      }}>
        {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px 4px', border: 'none', cursor: 'pointer',
              background: tab === t ? '#1a1a3e' : 'transparent',
              color: tab === t ? '#c084fc' : '#666',
              borderBottom: tab === t ? '2px solid #7c3aed' : '2px solid transparent',
              fontSize: '12px', fontWeight: tab === t ? 'bold' : 'normal',
              transition: 'all 0.15s',
            }}
          >
            {TAB_LABELS[t]}
            {t === 'result' && scores[0] && (
              <span style={{
                marginLeft: '4px', padding: '1px 5px',
                background: '#4a4aff', borderRadius: '10px', fontSize: '10px', color: '#fff',
              }}>
                {scores[0].totalScore}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div style={{ minHeight: 'calc(100vh - 200px)' }}>
        {tab === 'champs' && (
          <ChampionSelector selected={state.champions} onToggle={toggleChampion} />
        )}
        {tab === 'items' && (
          <ItemAugmentSelector
            selectedItems={state.items}
            selectedAugments={state.augments}
            onToggleItem={toggleItem}
            onToggleAugment={toggleAugment}
          />
        )}
        {tab === 'hints' && (
          <EarlyGameHints
            state={state}
            scores={scores}
            onLevelChange={setLevel}
            onStageChange={setStage}
          />
        )}
        {tab === 'result' && (
          <RecommendationPanel scores={scores} />
        )}
      </div>

      {/* フッター */}
      <div style={{
        padding: '12px 20px', borderTop: '1px solid #2a2a4a',
        textAlign: 'center', fontSize: '11px', color: '#444',
      }}>
        Data based on MetaTFT · Patch 17.2b · Silver-Platinum
      </div>
    </div>
  );
}
