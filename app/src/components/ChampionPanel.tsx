import { useState } from 'react';
import championsData from '../data/champions.json';
import { champImg, champImgFallback, COST_COLORS, COST_GLOW } from '../engine/imager';
import type { Champion } from '../types/comp';

const champions = championsData as Champion[];

interface Props { selected: string[]; onToggle: (name: string) => void }

export default function ChampionPanel({ selected, onToggle }: Props) {
  const [search, setSearch] = useState('');
  const [costFilter, setCostFilter] = useState<number|null>(null);

  const filtered = champions.filter(c => {
    const q = search.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.nameJa.includes(search))
      && (costFilter === null || c.cost === costFilter);
  });
  const byCost = [1,2,3,4,5].map(cost => ({
    cost, champs: filtered.filter(c => c.cost === cost)
  })).filter(g => g.champs.length > 0);

  return (
    <div style={{ padding: '12px 14px' }}>
      {/* 検索 + コストフィルター */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'14px', flexWrap:'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="名前で検索（日本語OK）..."
          style={{
            flex:1, minWidth:'110px', padding:'7px 12px',
            background:'#0f0f2e', border:'1px solid #2a2a5a',
            borderRadius:'7px', color:'#ccc', fontSize:'13px',
          }}
        />
        <div style={{ display:'flex', gap:'4px' }}>
          {[null,1,2,3,4,5].map(cost => (
            <button key={cost??'all'} onClick={() => setCostFilter(cost)} style={{
              padding:'6px 9px', borderRadius:'6px', border:'none', cursor:'pointer',
              background: costFilter===cost ? '#1a1a5a' : '#0f0f2e',
              color: cost ? COST_COLORS[cost] : '#ccc',
              fontSize:'12px', fontWeight:700,
              outline: costFilter===cost ? `1px solid ${cost ? COST_COLORS[cost]:'#4a4aff'}` : 'none',
            }}>{cost ?? '全'}</button>
          ))}
        </div>
      </div>

      {/* 選択中チャンプ */}
      {selected.length > 0 && (
        <div style={{
          display:'flex', flexWrap:'wrap', gap:'4px',
          marginBottom:'14px', padding:'8px 10px',
          background:'#0d0d28', borderRadius:'8px', border:'1px solid #2a2a5a',
        }}>
          {selected.map(name => {
            const ch = champions.find(c => c.name === name);
            if (!ch) return null;
            return (
              <div key={name} title={ch.nameJa} onClick={() => onToggle(name)} style={{
                width:'32px', height:'32px', borderRadius:'5px', overflow:'hidden',
                cursor:'pointer', border:`2px solid ${COST_COLORS[ch.cost]}`,
                flexShrink:0, position:'relative',
              }}>
                <img src={champImg(ch.ddragon)} alt={ch.nameJa}
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  onError={e => {
                    const img = e.currentTarget;
                    img.onerror = null;
                    img.src = champImgFallback(ch.cdkey);
                  }}
                />
              </div>
            );
          })}
          <button onClick={() => selected.forEach(onToggle)} style={{
            padding:'4px 8px', borderRadius:'6px', border:'none', cursor:'pointer',
            background:'#1a0a2e', color:'#777', fontSize:'11px', alignSelf:'center',
          }}>全解除</button>
        </div>
      )}

      {/* コスト別グリッド */}
      {byCost.map(({ cost, champs }) => (
        <div key={cost} style={{ marginBottom:'16px' }}>
          <div style={{
            fontSize:'12px', fontWeight:700, color:COST_COLORS[cost],
            marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px',
          }}>
            <span style={{
              display:'inline-block', width:'8px', height:'8px', borderRadius:'50%',
              background:COST_COLORS[cost], boxShadow:`0 0 6px ${COST_GLOW[cost]}`,
            }}/>
            {cost}コスト
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
            {champs.map(ch => <ChampTile key={ch.name} ch={ch} selected={selected.includes(ch.name)} onToggle={onToggle}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChampTile({ ch, selected, onToggle }: { ch:Champion; selected:boolean; onToggle:(n:string)=>void }) {
  const color = COST_COLORS[ch.cost];
  const glow  = COST_GLOW[ch.cost];
  return (
    <div onClick={() => onToggle(ch.name)} style={{
      width:'70px', cursor:'pointer', userSelect:'none',
      display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
    }}>
      <div style={{
        width:'70px', height:'70px', borderRadius:'10px', overflow:'hidden',
        border:`2px solid ${selected ? color : '#2a2a4a'}`,
        boxShadow: selected ? `0 0 16px ${glow}` : 'none',
        position:'relative', background:'#111', transition:'all .15s',
      }}>
        <img
          src={champImg(ch.ddragon)} alt={ch.nameJa}
          style={{
            width:'100%', height:'100%', objectFit:'cover', display:'block',
            filter: selected ? 'none' : 'grayscale(70%) brightness(0.55)',
            transition:'filter .15s',
          }}
          onError={e => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = champImgFallback(ch.cdkey);
          }}
        />
        {selected && (
          <div style={{
            position:'absolute', top:'3px', right:'3px',
            width:'16px', height:'16px', borderRadius:'50%',
            background:color, display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'10px', color:'#000', fontWeight:900,
          }}>✓</div>
        )}
      </div>
      <span style={{
        fontSize:'10px', textAlign:'center', lineHeight:1.2,
        color: selected ? color : '#555', fontWeight: selected ? 700 : 400,
        maxWidth:'70px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
      }}>
        {ch.nameJa}
      </span>
    </div>
  );
}
