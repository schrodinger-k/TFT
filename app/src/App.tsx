import { useMemo, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { calculateScores } from './engine/scorer';
import ChampionPanel from './components/ChampionPanel';
import ItemAugmentPanel from './components/ItemAugmentPanel';
import RecommendPanel from './components/RecommendPanel';
import PhaseBar from './components/PhaseBar';
import compsData from './data/comps.json';
import type { Comp } from './types/comp';

const comps = compsData as Comp[];

export default function App() {
  const { state, toggleChampion, toggleItem, toggleAugment, setLevel, setStage, resetGame } = useGameState();
  const [leftTab, setLeftTab] = useState<'champs'|'gear'>('champs');

  const scores = useMemo(() => calculateScores(comps, state), [state]);
  const top = scores[0];
  const hasHit = top && top.totalScore >= 55;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0f0f2e 0%, #07070f 100%)',
      color: '#e0e0ff',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ====== TOP BAR ====== */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: '56px',
        background: 'linear-gradient(90deg,#0d0d30,#1a0533)',
        borderBottom: '1px solid #2a1f5a',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '0.03em',
            background: 'linear-gradient(135deg,#a78bfa,#fbbf24)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent' }}>
            ✦ TFT Advisor
          </span>
          <span style={{ fontSize: '12px', color: '#6b6b9a', borderLeft: '1px solid #2a2a5a',
            paddingLeft: '12px' }}>
            Patch 17.2b · ランク戦 · Silver〜Platinum · Sティア
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {hasHit && (
            <span style={{
              padding: '4px 14px', borderRadius: '20px',
              background: 'linear-gradient(90deg,#14532d,#166534)',
              border: '1px solid #22c55e55', color: '#86efac',
              fontSize: '13px', fontWeight: 700,
            }}>
              🎯 {top.comp.name} が狙い目！
            </span>
          )}
          <button onClick={resetGame} style={{
            padding: '6px 14px', borderRadius: '6px',
            border: '1px solid #3a2a6a', background: 'transparent',
            color: '#7a6aaa', cursor: 'pointer', fontSize: '12px',
            transition: 'all .15s',
          }}>
            🔄 新しいゲーム
          </button>
        </div>
      </header>

      {/* ====== PHASE BAR ====== */}
      <PhaseBar state={state} onLevelChange={setLevel} onStageChange={setStage} />

      {/* ====== MAIN 2-COLUMN ====== */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ---- LEFT PANEL ---- */}
        <aside style={{
          width: '420px', flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid #1e1e4a',
          background: '#09091e',
        }}>
          {/* タブ切り替え */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #1e1e4a',
            background: '#0a0a20',
          }}>
            {([['champs','🦸 チャンピオン'], ['gear','⚗️ アイテム / オーグメント']] as const).map(([k, label]) => (
              <button key={k} onClick={() => setLeftTab(k)} style={{
                flex: 1, padding: '13px 8px', border: 'none', cursor: 'pointer',
                background: leftTab === k ? '#12124a' : 'transparent',
                color: leftTab === k ? '#a78bfa' : '#555',
                borderBottom: leftTab === k ? '2px solid #7c3aed' : '2px solid transparent',
                fontSize: '13px', fontWeight: leftTab === k ? 700 : 400,
                transition: 'all .15s',
              }}>
                {label}
                {k === 'champs' && state.champions.length > 0 && (
                  <span style={{
                    marginLeft: '6px', padding: '1px 7px',
                    background: '#4a4aff', borderRadius: '12px',
                    fontSize: '11px', color: '#fff',
                  }}>{state.champions.length}</span>
                )}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {leftTab === 'champs'
              ? <ChampionPanel selected={state.champions} onToggle={toggleChampion} />
              : <ItemAugmentPanel
                  selectedItems={state.items}
                  selectedAugments={state.augments}
                  onToggleItem={toggleItem}
                  onToggleAugment={toggleAugment}
                />
            }
          </div>
        </aside>

        {/* ---- RIGHT PANEL ---- */}
        <main style={{
          flex: 1, overflowY: 'auto',
          padding: '20px 24px',
          background: '#080818',
        }}>
          <RecommendPanel scores={scores} playerChampions={state.champions} />
        </main>
      </div>
    </div>
  );
}
