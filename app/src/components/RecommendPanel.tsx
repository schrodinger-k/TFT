import type { CompScore } from '../types/comp';
import championsData from '../data/champions.json';
import itemsData from '../data/items.json';
import type { Champion, ItemData } from '../types/comp';
import { champImg, itemImg, COST_COLORS, COST_GLOW } from '../engine/imager';

const allChamps = championsData as Champion[];
const allItems = [...(itemsData.components as ItemData[]), ...(itemsData.completed as ItemData[])];

const STYLE_META: Record<string, { label: string; color: string; bg: string }> = {
  reroll: { label: '🔁 リロール', color: '#06b6d4', bg: '#0a2a30' },
  carry:  { label: '⚔️ キャリー', color: '#ef4444', bg: '#2a0a0a' },
  fast9:  { label: '🚀 Fast 9',  color: '#f59e0b', bg: '#2a1a00' },
};

interface Props {
  scores: CompScore[];
  playerChampions: string[];
}

export default function RecommendPanel({ scores, playerChampions }: Props) {
  if (scores.every(s => s.totalScore === 0) && playerChampions.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '60vh', color: '#333', gap: '12px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px' }}>🎮</div>
        <div style={{ fontSize: '18px', color: '#555' }}>チャンピオンを選択してください</div>
        <div style={{ fontSize: '13px', color: '#333' }}>
          所持しているチャンピオン・アイテム・オーグメントを入力すると<br/>
          最適なSティア構成が自動でスコアリングされます
        </div>
      </div>
    );
  }

  const top3 = scores.slice(0, 3);
  const rest = scores.slice(3);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '16px', color: '#a78bfa', fontWeight: 700 }}>
          🏆 構成レコメンド
        </h2>
        <span style={{ fontSize: '12px', color: '#444' }}>Sティア 10構成 · スコア順</span>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {top3.map((s, idx) => <CompCard key={s.comp.id} score={s} rank={idx+1} highlight={idx===0} playerChampions={playerChampions} />)}
      </div>

      {rest.length > 0 && (
        <details style={{ marginTop: '14px' }}>
          <summary style={{
            cursor: 'pointer', color: '#444', fontSize: '13px', padding: '10px 14px',
            background: '#0c0c22', borderRadius: '8px', border: '1px solid #1e1e4a',
            listStyle: 'none', userSelect: 'none',
          }}>
            ▸ 他の構成を見る ({rest.length}件)
          </summary>
          <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
            {rest.map((s, idx) => <CompCard key={s.comp.id} score={s} rank={idx+4} highlight={false} playerChampions={playerChampions} />)}
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
  const style = STYLE_META[comp.style];

  const recColor = recommendation === '狙い目！' ? '#22c55e'
    : recommendation === '有力な選択肢' ? '#f59e0b' : '#6b7280';

  const rankColors = ['#ffd700','#c0c0c0','#cd7f32'];

  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden',
      border: `1px solid ${highlight ? '#4a2a8a' : '#1e1e4a'}`,
      background: highlight ? 'linear-gradient(135deg,#111130,#0d0d28)' : '#0c0c1e',
      boxShadow: highlight ? '0 0 20px rgba(122,70,220,0.15)' : 'none',
      transition: 'all .2s',
    }}>
      {/* カードヘッダー */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        background: highlight ? 'linear-gradient(90deg,#150d35,#0d0d28)' : '#0e0e22',
        borderBottom: `1px solid ${highlight ? '#2a1a5a' : '#1a1a3a'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* ランクバッジ */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: rank <= 3
              ? `radial-gradient(circle,${rankColors[rank-1]},${rankColors[rank-1]}88)`
              : '#1a1a3a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 900,
            color: rank <= 3 ? '#000' : '#555',
            boxShadow: rank === 1 ? '0 0 12px rgba(255,215,0,0.4)' : 'none',
            flexShrink: 0,
          }}>
            {rank}
          </div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#e0e0ff', lineHeight: 1.2 }}>
              {comp.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{
                padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                background: style.bg, color: style.color,
              }}>
                {style.label}
              </span>
              <span style={{ fontSize: '11px', color: '#555' }}>
                S Tier
              </span>
            </div>
          </div>
        </div>

        {/* スコアと推薦 */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '28px', fontWeight: 900,
            color: recColor,
            lineHeight: 1,
          }}>
            {totalScore}
          </div>
          <div style={{
            fontSize: '12px', fontWeight: 700, color: recColor,
            marginTop: '2px',
          }}>
            {recommendation}
          </div>
        </div>
      </div>

      {/* スコアバー */}
      <div style={{ padding: '10px 18px', borderBottom: '1px solid #1a1a3a', display: 'flex', gap: '12px' }}>
        {[
          { label:'チャンプ', value:championScore, max:50, color:'#6366f1' },
          { label:'オーグメント', value:augmentScore, max:30, color:'#a855f7' },
          { label:'アイテム', value:itemScore, max:20, color:'#f59e0b' },
        ].map(b => (
          <div key={b.label} style={{ flex: 1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
              <span style={{ fontSize:'10px', color:'#555' }}>{b.label}</span>
              <span style={{ fontSize:'10px', color: b.color, fontWeight:700 }}>{b.value}</span>
            </div>
            <div style={{ height:'5px', background:'#1a1a3a', borderRadius:'3px', overflow:'hidden' }}>
              <div style={{
                width:`${(b.value/b.max)*100}%`, height:'100%',
                background: `linear-gradient(90deg, ${b.color}88, ${b.color})`,
                borderRadius:'3px', transition:'width .4s ease',
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* ユニット一覧（画像） */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid #1a1a3a' }}>
        <div style={{ fontSize: '11px', color: '#444', marginBottom: '8px' }}>最終盤面</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {comp.units.map(unit => {
            const ch = allChamps.find(c => c.name === unit.name);
            const owned = playerChampions.includes(unit.name);
            const isEarly = comp.keyEarlyUnits.includes(unit.name);
            if (!ch) return null;
            return (
              <div key={unit.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '7px', overflow: 'hidden',
                  border: `2px solid ${unit.isCarry ? '#fbbf24' : owned ? COST_COLORS[ch.cost] : '#2a2a4a'}`,
                  boxShadow: unit.isCarry ? '0 0 10px rgba(251,191,36,0.5)'
                    : owned ? `0 0 8px ${COST_GLOW[ch.cost]}` : 'none',
                  position: 'relative', background: '#111',
                  opacity: owned ? 1 : 0.45,
                }}>
                  <img
                    src={champImg(ch.ddragon)} alt={unit.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => {
                      const el = e.target as HTMLImageElement;
                      el.style.display='none';
                      el.parentElement!.innerHTML=`<span style="font-size:8px;color:#aaa;text-align:center">${unit.name.split(' ').map((w:string)=>w[0]).join('')}</span>`;
                    }}
                  />
                  {unit.isCarry && (
                    <div style={{
                      position:'absolute', bottom:'1px', right:'1px',
                      fontSize:'8px', background:'#fbbf24', color:'#000',
                      borderRadius:'2px', padding:'0 2px', fontWeight:900,
                      lineHeight:'12px',
                    }}>C</div>
                  )}
                  {isEarly && !unit.isCarry && owned && (
                    <div style={{
                      position:'absolute', top:'1px', left:'1px',
                      width:'8px', height:'8px', borderRadius:'50%', background:'#22c55e',
                    }}/>
                  )}
                </div>
                <span style={{ fontSize:'8px', color:'#555', textAlign:'center', maxWidth:'44px',
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {unit.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 早期マッチ & ノート */}
      {(matchedEarlyUnits.length > 0 || true) && (
        <div style={{ padding: '10px 18px' }}>
          {matchedEarlyUnits.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 10px', borderRadius: '7px',
              background: '#0f2a1f', border: '1px solid #22c55e44',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '13px' }}>🎯</span>
              <span style={{ color: '#86efac', fontSize: '12px', fontWeight: 600 }}>
                早期マッチ:
              </span>
              <span style={{ color: '#4ade80', fontSize: '12px' }}>
                {matchedEarlyUnits.join(' · ')} を所持！
              </span>
            </div>
          )}
          <div style={{ color: '#555', fontSize: '12px', lineHeight: 1.6 }}>
            💡 {comp.notes}
          </div>
        </div>
      )}

      {/* BISアイテム展開 */}
      <details>
        <summary style={{
          cursor:'pointer', padding:'8px 18px', fontSize:'12px', color:'#3a3a6a',
          borderTop:'1px solid #1a1a3a', listStyle:'none', userSelect:'none',
          display:'flex', alignItems:'center', gap:'6px',
        }}>
          ▸ BISアイテム・推奨オーグメントを見る
        </summary>
        <div style={{ padding:'10px 18px 14px', borderTop:'1px solid #1a1a3a' }}>
          <div style={{ marginBottom:'10px' }}>
            <div style={{ fontSize:'11px', color:'#555', marginBottom:'6px' }}>BISアイテム</div>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {comp.items.map(item => {
                const d = allItems.find(i => i.name === item.name);
                return (
                  <div key={item.name} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' }}>
                    <div style={{
                      width:'40px', height:'40px', borderRadius:'6px',
                      border:'1px solid #2a2a4a', overflow:'hidden', background:'#111',
                    }}>
                      {d && <img
                        src={itemImg(d.icon)} alt={item.name}
                        style={{ width:'100%', height:'100%', objectFit:'cover' }}
                        onError={e => { (e.target as HTMLImageElement).style.display='none' }}
                      />}
                    </div>
                    <span style={{ fontSize:'9px', color:'#555', maxWidth:'44px',
                      textAlign:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {item.name.split("'")[0].trim()}
                    </span>
                    <span style={{ fontSize:'8px', color:'#34d399' }}>→{item.target.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontSize:'11px', color:'#555', marginBottom:'6px' }}>推奨オーグメント（HIGH）</div>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
              {comp.augments.filter(a => a.priority==='HIGH').map(a => (
                <span key={a.name} style={{
                  padding:'3px 10px', borderRadius:'5px', fontSize:'11px',
                  background:'#1a0a2e', border:'1px solid #4a1a8a', color:'#c084fc',
                }}>
                  {a.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
