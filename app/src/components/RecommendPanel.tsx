import { useState } from 'react';
import type { CompScore } from '../types/comp';
import championsData from '../data/champions.json';
import itemsData from '../data/items.json';
import augmentsData from '../data/augments.json';
import type { Champion, ItemData, AugmentData } from '../types/comp';
import { champImg, champImgFallback, itemImg, COST_COLORS, COST_GLOW, TRAIT_COLORS } from '../engine/imager';

const allChamps  = championsData as Champion[];
const allItems   = [...(itemsData.components as ItemData[]), ...(itemsData.completed as ItemData[])];
const allAugments = augmentsData as AugmentData[];

const champMap: Record<string, Champion>  = Object.fromEntries(allChamps.map(c  => [c.name,  c]));
const itemMap:  Record<string, ItemData>  = Object.fromEntries(allItems.map(i   => [i.name,  i]));
const augMap:   Record<string, AugmentData> = Object.fromEntries(allAugments.map(a => [a.name, a]));

const STYLE_META: Record<string, { label:string; color:string; bg:string }> = {
  reroll: { label:'🔁 リロール', color:'#06b6d4', bg:'#0a2a30' },
  carry:  { label:'⚔️ キャリー', color:'#ef4444', bg:'#2a0a0a' },
  fast9:  { label:'🚀 Fast 9',  color:'#f59e0b', bg:'#2a1a00' },
};

interface Props { scores: CompScore[]; playerChampions: string[] }

export default function RecommendPanel({ scores, playerChampions }: Props) {
  if (scores.every(s => s.totalScore === 0) && playerChampions.length === 0) {
    return (
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        height:'60vh', gap:'12px', textAlign:'center',
      }}>
        <div style={{ fontSize:'48px' }}>🎮</div>
        <div style={{ fontSize:'17px', color:'#444' }}>チャンピオンを選択してください</div>
        <div style={{ fontSize:'13px', color:'#333', lineHeight:1.8 }}>
          所持チャンピオン・アイテム・オーグメントを入力すると<br/>
          Sティア10構成のスコアがリアルタイムで更新されます
        </div>
      </div>
    );
  }

  const top3 = scores.slice(0, 3);
  const rest = scores.slice(3);

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
        <h2 style={{ margin:0, fontSize:'16px', color:'#a78bfa', fontWeight:700 }}>🏆 構成レコメンド</h2>
        <span style={{ fontSize:'12px', color:'#333' }}>Sティア 10構成 · スコア順</span>
      </div>

      <div style={{ display:'grid', gap:'14px' }}>
        {top3.map((s, i) => <CompCard key={s.comp.id} score={s} rank={i+1} highlight={i===0} playerChampions={playerChampions}/>)}
      </div>

      {rest.length > 0 && (
        <details style={{ marginTop:'14px' }}>
          <summary style={{
            cursor:'pointer', color:'#3a3a6a', fontSize:'13px',
            padding:'10px 14px', background:'#0c0c22', borderRadius:'8px',
            border:'1px solid #1e1e4a', listStyle:'none', userSelect:'none',
          }}>
            ▸ 他の構成 ({rest.length}件)
          </summary>
          <div style={{ display:'grid', gap:'10px', marginTop:'10px' }}>
            {rest.map((s, i) => <CompCard key={s.comp.id} score={s} rank={i+4} highlight={false} playerChampions={playerChampions}/>)}
          </div>
        </details>
      )}
    </div>
  );
}

function CompCard({ score, rank, highlight, playerChampions }: {
  score: CompScore; rank: number; highlight: boolean; playerChampions: string[];
}) {
  const { comp, totalScore, championScore, augmentScore, itemScore, matchedEarlyUnits, recommendation } = score;
  const sm = STYLE_META[comp.style];
  const rankColors = ['#ffd700','#c0c0c0','#cd7f32'];
  const recColor = recommendation === '狙い目！' ? '#22c55e'
    : recommendation === '有力な選択肢' ? '#f59e0b' : '#6b7280';

  return (
    <div style={{
      borderRadius:'12px', overflow:'hidden',
      border:`1px solid ${highlight ? '#4a2a8a' : '#1e1e4a'}`,
      background: highlight ? '#111130' : '#0c0c1e',
      boxShadow: highlight ? '0 0 24px rgba(122,70,220,0.12)' : 'none',
    }}>
      {/* ヘッダー */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 18px',
        background: highlight ? 'linear-gradient(90deg,#150d35,#0d0d28)' : '#0e0e22',
        borderBottom:`1px solid ${highlight ? '#2a1a5a' : '#1a1a3a'}`,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{
            width:'32px', height:'32px', borderRadius:'50%', flexShrink:0,
            background: rank <= 3 ? rankColors[rank-1] : '#1a1a3a',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'13px', fontWeight:900, color: rank<=3 ? '#000' : '#555',
            boxShadow: rank===1 ? '0 0 12px rgba(255,215,0,0.4)' : 'none',
          }}>{rank}</div>
          <div>
            <div style={{ fontSize:'17px', fontWeight:800, color:'#e0e0ff', lineHeight:1.2 }}>{comp.name}</div>
            <div style={{ display:'flex', gap:'8px', marginTop:'3px' }}>
              <span style={{ padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:700, background:sm.bg, color:sm.color }}>{sm.label}</span>
              <span style={{ fontSize:'11px', color:'#555' }}>S Tier</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'28px', fontWeight:900, color:recColor, lineHeight:1 }}>{totalScore}</div>
          <div style={{ fontSize:'12px', fontWeight:700, color:recColor, marginTop:'2px' }}>{recommendation}</div>
        </div>
      </div>

      {/* スコアバー */}
      <div style={{ padding:'10px 18px', borderBottom:'1px solid #1a1a3a', display:'flex', gap:'12px' }}>
        {[
          { label:'チャンプ', value:championScore, max:50, color:'#6366f1' },
          { label:'オーグメント', value:augmentScore, max:30, color:'#a855f7' },
          { label:'アイテム', value:itemScore, max:20, color:'#f59e0b' },
        ].map(b => (
          <div key={b.label} style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
              <span style={{ fontSize:'10px', color:'#555' }}>{b.label}</span>
              <span style={{ fontSize:'10px', color:b.color, fontWeight:700 }}>{b.value}</span>
            </div>
            <div style={{ height:'5px', background:'#1a1a3a', borderRadius:'3px', overflow:'hidden' }}>
              <div style={{
                width:`${(b.value/b.max)*100}%`, height:'100%',
                background:`linear-gradient(90deg,${b.color}88,${b.color})`,
                borderRadius:'3px', transition:'width .4s ease',
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* ユニット一覧 */}
      <div style={{ padding:'12px 18px', borderBottom:'1px solid #1a1a3a' }}>
        <div style={{ fontSize:'11px', color:'#333', marginBottom:'8px' }}>最終盤面</div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {comp.units.map(unit => {
            const ch = champMap[unit.name];
            if (!ch) return null;
            const owned = playerChampions.includes(unit.name);
            const isEarly = comp.keyEarlyUnits.includes(unit.name);
            return (
              <div key={unit.name} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' }}>
                <div style={{
                  width:'46px', height:'46px', borderRadius:'7px', overflow:'hidden', position:'relative',
                  border:`2px solid ${unit.isCarry ? '#fbbf24' : owned ? COST_COLORS[ch.cost] : '#252540'}`,
                  boxShadow: unit.isCarry ? '0 0 10px rgba(251,191,36,0.5)'
                    : owned ? `0 0 8px ${COST_GLOW[ch.cost]}` : 'none',
                  background:'#111', opacity: owned ? 1 : 0.4,
                }}>
                  <img src={champImg(ch.ddragon)} alt={ch.nameJa}
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                    onError={e => { e.currentTarget.onerror=null; e.currentTarget.src=champImgFallback(ch.cdkey); }}
                  />
                  {unit.isCarry && (
                    <div style={{
                      position:'absolute', bottom:'1px', right:'1px',
                      fontSize:'7px', background:'#fbbf24', color:'#000',
                      borderRadius:'2px', padding:'0 2px', fontWeight:900, lineHeight:'12px',
                    }}>C</div>
                  )}
                  {isEarly && !unit.isCarry && owned && (
                    <div style={{ position:'absolute', top:'2px', left:'2px', width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e' }}/>
                  )}
                </div>
                <span style={{ fontSize:'8px', color:'#444', textAlign:'center', maxWidth:'46px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {ch.nameJa}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 早期マッチ & ノート */}
      <div style={{ padding:'10px 18px' }}>
        {matchedEarlyUnits.length > 0 && (
          <div style={{
            display:'flex', alignItems:'center', gap:'6px',
            padding:'7px 10px', borderRadius:'7px',
            background:'#0f2a1f', border:'1px solid #22c55e44', marginBottom:'8px',
          }}>
            <span style={{ fontSize:'13px' }}>🎯</span>
            <span style={{ color:'#86efac', fontSize:'12px', fontWeight:600 }}>早期マッチ：</span>
            <span style={{ color:'#4ade80', fontSize:'12px' }}>
              {matchedEarlyUnits.map(n => champMap[n]?.nameJa ?? n).join(' · ')} を所持！
            </span>
          </div>
        )}
        <div style={{ color:'#4a4a7a', fontSize:'12px', lineHeight:1.7 }}>💡 {comp.notes}</div>
      </div>

      {/* BISアイテム・推奨オーグメント（展開） */}
      <details>
        <summary style={{
          cursor:'pointer', padding:'8px 18px', fontSize:'12px', color:'#2a2a5a',
          borderTop:'1px solid #1a1a3a', listStyle:'none', userSelect:'none',
        }}>▸ BISアイテム・推奨オーグメントを見る</summary>
        <div style={{ padding:'12px 18px 16px', borderTop:'1px solid #1a1a3a' }}>
          {/* BISアイテム */}
          <div style={{ marginBottom:'12px' }}>
            <div style={{ fontSize:'11px', color:'#444', marginBottom:'7px' }}>🛡️ BISアイテム</div>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {comp.items.map(entry => {
                const d = itemMap[entry.name];
                const targetCh = champMap[entry.target];
                if (!d) return null;
                const [failed, setFailed] = useState(false);
                return (
                  <div key={entry.name} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' }}>
                    <div style={{
                      width:'44px', height:'44px', borderRadius:'7px', overflow:'hidden',
                      border:'1px solid #252540', background: failed ? '#1a1a2e' : '#111',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      {failed ? (
                        <span style={{ fontSize:'8px', color:'#888', textAlign:'center', padding:'2px', lineHeight:1.2 }}>{d.nameJa}</span>
                      ) : (
                        <img src={itemImg(d.cdkey)} alt={d.nameJa}
                          style={{ width:'100%', height:'100%', objectFit:'cover' }}
                          onError={() => setFailed(true)}
                        />
                      )}
                    </div>
                    <span style={{ fontSize:'8px', color:'#555', maxWidth:'48px', textAlign:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {d.nameJa}
                    </span>
                    {targetCh && (
                      <span style={{ fontSize:'8px', color:'#34d399' }}>→{targetCh.nameJa}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* 推奨オーグメント */}
          <div>
            <div style={{ fontSize:'11px', color:'#444', marginBottom:'7px' }}>🔮 推奨オーグメント（HIGH）</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
              {comp.augments.filter(a => a.priority==='HIGH').map(a => {
                const ad = augMap[a.name];
                if (!ad) return null;
                const tc = TRAIT_COLORS[ad.trait] ?? TRAIT_COLORS['General'];
                return (
                  <div key={a.name} style={{
                    padding:'5px 10px', borderRadius:'6px', fontSize:'12px',
                    background:tc.bg, border:`1px solid ${tc.border}`, color:tc.text,
                    display:'flex', alignItems:'center', gap:'6px',
                  }}>
                    <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:tc.border, flexShrink:0 }}/>
                    {ad.nameJa}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
