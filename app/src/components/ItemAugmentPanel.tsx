import { useState } from 'react';
import itemsData from '../data/items.json';
import augmentsData from '../data/augments.json';
import { itemImg, augmentImg } from '../engine/imager';
import type { ItemData, AugmentData } from '../types/comp';

interface Props {
  selectedItems: string[];
  selectedAugments: string[];
  onToggleItem: (n: string) => void;
  onToggleAugment: (n: string) => void;
}

function ItemIcon({ item, selected, onToggle }: { item: ItemData; selected: boolean; onToggle: ()=>void }) {
  return (
    <div onClick={onToggle} title={item.name} style={{
      width: '52px', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
    }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '8px',
        border: `2px solid ${selected ? '#fbbf24' : '#2a2a4a'}`,
        boxShadow: selected ? '0 0 12px rgba(251,191,36,0.4)' : 'none',
        overflow: 'hidden', background: '#111',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s',
        position: 'relative',
      }}>
        <img
          src={itemImg(item.icon)} alt={item.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: selected ? 'none' : 'grayscale(60%) brightness(0.6)',
            transition: 'filter .15s',
          }}
          onError={e => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
            const parent = el.parentElement!;
            parent.innerHTML = `<span style="font-size:9px;color:#888;text-align:center;padding:2px;line-height:1.1">${item.name.substring(0,8)}</span>`;
          }}
        />
        {selected && (
          <div style={{
            position: 'absolute', top:'2px', right:'2px',
            width:'14px', height:'14px', borderRadius:'50%',
            background:'#fbbf24', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'9px', color:'#000',
          }}>✓</div>
        )}
      </div>
      <span style={{
        fontSize: '9px', color: selected ? '#fbbf24' : '#555',
        textAlign: 'center', maxWidth: '52px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        lineHeight: 1.2,
      }}>{item.name}</span>
    </div>
  );
}

function AugmentIcon({ aug, selected, disabled, onToggle }: {
  aug: AugmentData; selected: boolean; disabled: boolean; onToggle: ()=>void;
}) {
  return (
    <div onClick={() => !disabled && onToggle()} title={aug.name} style={{
      width: '54px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.35 : 1,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
    }}>
      <div style={{
        width: '54px', height: '54px', borderRadius: '8px',
        border: `2px solid ${selected ? '#c084fc' : '#2a2a4a'}`,
        boxShadow: selected ? '0 0 12px rgba(192,132,252,0.5)' : 'none',
        overflow: 'hidden', background: '#111',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s', position: 'relative',
      }}>
        <img
          src={augmentImg(aug.icon)} alt={aug.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: selected ? 'none' : 'grayscale(60%) brightness(0.6)',
          }}
          onError={e => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
            const p = el.parentElement!;
            p.style.background = selected ? '#2d1a5e' : '#111';
            p.innerHTML = `<span style="font-size:9px;color:${selected?'#c084fc':'#666'};text-align:center;padding:3px;line-height:1.2">${aug.name}</span>`;
          }}
        />
        {selected && (
          <div style={{
            position:'absolute',top:'2px',right:'2px',
            width:'14px',height:'14px',borderRadius:'50%',
            background:'#7c3aed',display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:'9px',color:'#fff',
          }}>✓</div>
        )}
      </div>
      <span style={{
        fontSize: '9px', color: selected ? '#c084fc' : '#555',
        textAlign: 'center', maxWidth: '54px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{aug.name}</span>
    </div>
  );
}

export default function ItemAugmentPanel({ selectedItems, selectedAugments, onToggleItem, onToggleAugment }: Props) {
  const [augSearch, setAugSearch] = useState('');
  const augList = augmentsData as AugmentData[];
  const filtered = augList.filter(a => a.name.toLowerCase().includes(augSearch.toLowerCase()));

  return (
    <div style={{ padding: '14px 14px' }}>
      {/* オーグメント */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '10px',
        }}>
          <h3 style={{ margin:0, fontSize:'13px', color:'#a78bfa', fontWeight:700 }}>
            🔮 オーグメント
            <span style={{
              marginLeft:'8px', fontSize:'12px',
              color: selectedAugments.length === 3 ? '#22c55e' : '#555',
            }}>
              {selectedAugments.length}/3
            </span>
          </h3>
          {selectedAugments.length > 0 && (
            <button onClick={() => selectedAugments.forEach(onToggleAugment)} style={{
              padding:'3px 8px', borderRadius:'5px', border:'none', cursor:'pointer',
              background:'#1a0a2e', color:'#777', fontSize:'11px',
            }}>全解除</button>
          )}
        </div>

        {/* 選択済みオーグメントのプレビュー */}
        {selectedAugments.length > 0 && (
          <div style={{
            display: 'flex', gap: '8px', marginBottom: '10px',
            padding: '8px', background: '#0d0a22', borderRadius: '8px',
            border: '1px solid #2a1a5a',
          }}>
            {selectedAugments.map(name => {
              const aug = augList.find(a => a.name === name);
              if (!aug) return null;
              return <AugmentIcon key={name} aug={aug} selected onToggle={() => onToggleAugment(name)} disabled={false} />;
            })}
          </div>
        )}

        <input
          value={augSearch} onChange={e => setAugSearch(e.target.value)}
          placeholder="オーグメント検索..."
          style={{
            width: '100%', padding: '7px 12px', marginBottom: '10px',
            background: '#0f0f2e', border: '1px solid #2a2a5a',
            borderRadius: '7px', color: '#ccc', fontSize: '13px', outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
          {filtered.map(aug => (
            <AugmentIcon
              key={aug.name} aug={aug}
              selected={selectedAugments.includes(aug.name)}
              disabled={!selectedAugments.includes(aug.name) && selectedAugments.length >= 3}
              onToggle={() => onToggleAugment(aug.name)}
            />
          ))}
        </div>
      </section>

      {/* コンポーネントアイテム */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ margin:'0 0 10px', fontSize:'13px', color:'#fbbf24', fontWeight:700 }}>
          ⚙️ コンポーネントアイテム
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(itemsData.components as ItemData[]).map(item => (
            <ItemIcon
              key={item.name} item={item}
              selected={selectedItems.includes(item.name)}
              onToggle={() => onToggleItem(item.name)}
            />
          ))}
        </div>
      </section>

      {/* 完成アイテム */}
      <section>
        <h3 style={{ margin:'0 0 10px', fontSize:'13px', color:'#34d399', fontWeight:700 }}>
          ✨ 完成アイテム
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(itemsData.completed as ItemData[]).map(item => (
            <ItemIcon
              key={item.name} item={item}
              selected={selectedItems.includes(item.name)}
              onToggle={() => onToggleItem(item.name)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
