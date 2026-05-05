import { useMemo, useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { calculateScores } from './engine/scorer';
import { updateDDVersion } from './engine/imager';
import ChampionPanel from './components/ChampionPanel';
import ItemAugmentPanel from './components/ItemAugmentPanel';
import RecommendPanel from './components/RecommendPanel';
import PhaseBar from './components/PhaseBar';
import compsData from './data/comps.json';
import type { Comp } from './types/comp';

const comps = compsData as Comp[];

type Tab = 'champs' | 'gear';
const TAB_LABELS: Record<Tab, string> = { champs:'🦸 チャンピオン', gear:'⚗️ アイテム / オーグメント' };

export default function App() {
  const { state, toggleChampion, toggleItem, toggleAugment, setLevel, setStage, resetGame } = useGameState();
  const [leftTab, setLeftTab] = useState<Tab>('champs');

  // Data Dragon最新バージョン取得
  useEffect(() => {
    fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(r => r.json())
      .then((v: string[]) => { if (v[0]) updateDDVersion(v[0]); })
      .catch(() => {});
  }, []);

  const scores = useMemo(() => calculateScores(comps, state), [state]);
  const top = scores[0];
  const hasHit = top && top.totalScore >= 55;

  return (
    <div style={{
      display:'flex', flexDirection:'column', minHeight:'100vh',
      background:'radial-gradient(ellipse at top, #0f0f2e 0%, #07070f 100%)',
      color:'#e0e0ff', fontFamily:"'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ヘッダー */}
      <header style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 28px', height:'56px',
        background:'linear-gradient(90deg,#0d0d30,#1a0533)',
        borderBottom:'1px solid #2a1f5a', flexShrink:0,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <span style={{
            fontSize:'22px', fontWeight:900,
            background:'linear-gradient(135deg,#a78bfa,#fbbf24)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>✦ TFT Advisor</span>
          <span style={{ fontSize:'12px', color:'#4a4a7a', borderLeft:'1px solid #2a2a5a', paddingLeft:'12px' }}>
            Patch 17.2b · ランク戦 · Silver〜Platinum · Sティア
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {hasHit && (
            <span style={{
              padding:'4px 14px', borderRadius:'20px',
              background:'linear-gradient(90deg,#14532d,#166534)',
              border:'1px solid #22c55e55', color:'#86efac',
              fontSize:'13px', fontWeight:700,
            }}>🎯 {top.comp.name} が狙い目！</span>
          )}
          <button onClick={resetGame} style={{
            padding:'6px 14px', borderRadius:'6px',
            border:'1px solid #3a2a6a', background:'transparent',
            color:'#7a6aaa', cursor:'pointer', fontSize:'12px',
          }}>🔄 新しいゲーム</button>
        </div>
      </header>

      {/* ステージ・レベルバー */}
      <PhaseBar state={state} onLevelChange={setLevel} onStageChange={setStage} />

      {/* ステータスバー */}
      <div style={{
        display:'flex', gap:'16px', padding:'6px 28px',
        background:'#0a0a1e', borderBottom:'1px solid #1a1a3a',
        fontSize:'12px', flexShrink:0,
      }}>
        <span style={{ color:'#6366f1' }}>チャンプ {state.champions.length}体</span>
        <span style={{ color:'#f59e0b' }}>アイテム {state.items.length}個</span>
        <span style={{ color:'#a855f7' }}>オーグメント {state.augments.length}/3</span>
        {top && top.totalScore > 0 && (
          <span style={{ marginLeft:'auto', color:'#22c55e', fontWeight:700 }}>
            TOP: {top.comp.name}（{top.totalScore}点 / {top.recommendation}）
          </span>
        )}
      </div>

      {/* メイン2カラム */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* 左パネル */}
        <aside style={{
          width:'430px', flexShrink:0, display:'flex', flexDirection:'column',
          borderRight:'1px solid #1e1e4a', background:'#09091e',
        }}>
          {/* タブ */}
          <div style={{ display:'flex', borderBottom:'1px solid #1e1e4a', background:'#0a0a20' }}>
            {(Object.entries(TAB_LABELS) as [Tab, string][]).map(([k, label]) => (
              <button key={k} onClick={() => setLeftTab(k)} style={{
                flex:1, padding:'13px 8px', border:'none', cursor:'pointer',
                background: leftTab===k ? '#12124a' : 'transparent',
                color: leftTab===k ? '#a78bfa' : '#444',
                borderBottom: leftTab===k ? '2px solid #7c3aed' : '2px solid transparent',
                fontSize:'13px', fontWeight: leftTab===k ? 700 : 400,
                transition:'all .15s',
              }}>
                {label}
                {k === 'champs' && state.champions.length > 0 && (
                  <span style={{
                    marginLeft:'6px', padding:'1px 7px',
                    background:'#4a4aff', borderRadius:'12px', fontSize:'11px', color:'#fff',
                  }}>{state.champions.length}</span>
                )}
              </button>
            ))}
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {leftTab === 'champs'
              ? <ChampionPanel selected={state.champions} onToggle={toggleChampion}/>
              : <ItemAugmentPanel
                  selectedItems={state.items} selectedAugments={state.augments}
                  onToggleItem={toggleItem} onToggleAugment={toggleAugment}
                />
            }
          </div>
        </aside>

        {/* 右パネル */}
        <main style={{ flex:1, overflowY:'auto', padding:'20px 24px', background:'#080818' }}>
          <RecommendPanel scores={scores} playerChampions={state.champions}/>
        </main>
      </div>
    </div>
  );
}
