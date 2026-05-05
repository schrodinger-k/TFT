import { useState } from 'react';
import itemsData from '../data/items.json';
import augmentsData from '../data/augments.json';
import { itemImg, TRAIT_COLORS, TIER_COLORS } from '../engine/imager';
import type { ItemData, AugmentData } from '../types/comp';

interface Props {
  selectedItems: string[];
  selectedAugments: string[];
  onToggleItem: (n: string) => void;
  onToggleAugment: (n: string) => void;
}

// -------- アイテムアイコン --------
function ItemIcon({ item, selected, onToggle }: {
  item: ItemData; selected: boolean; onToggle: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div onClick={onToggle} title={item.nameJa} style={{
      width:'58px', cursor:'pointer',
      display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
    }}>
      <div style={{
        width:'58px', height:'58px', borderRadius:'9px', overflow:'hidden',
        border:`2px solid ${selected ? '#fbbf24' : '#252540'}`,
        boxShadow: selected ? '0 0 14px rgba(251,191,36,0.45)' : 'none',
        background: imgFailed ? '#1a1a2e' : '#111',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all .15s', position:'relative', flexShrink:0,
      }}>
        {imgFailed ? (
          <span style={{
            fontSize:'9px', color: selected ? '#fbbf24' : '#666',
            textAlign:'center', padding:'3px', lineHeight:1.3,
          }}>
            {item.nameJa}
          </span>
        ) : (
          <img
            src={itemImg(item.cdkey)} alt={item.nameJa}
            style={{
              width:'100%', height:'100%', objectFit:'cover',
              filter: selected ? 'none' : 'grayscale(60%) brightness(0.55)',
              transition:'filter .15s',
            }}
            onError={() => setImgFailed(true)}
          />
        )}
        {selected && !imgFailed && (
          <div style={{
            position:'absolute', top:'2px', right:'2px',
            width:'14px', height:'14px', borderRadius:'50%',
            background:'#fbbf24', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'9px', color:'#000', fontWeight:900,
          }}>✓</div>
        )}
      </div>
      <span style={{
        fontSize:'9px', color: selected ? '#fbbf24' : '#555',
        textAlign:'center', maxWidth:'58px',
        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        lineHeight:1.2,
      }}>
        {item.nameJa}
      </span>
    </div>
  );
}

// -------- オーグメントバッジ (画像なし・スタイリッシュ) --------
function AugmentBadge({ aug, selected, disabled, onToggle }: {
  aug: AugmentData; selected: boolean; disabled: boolean; onToggle: () => void;
}) {
  const tc = TRAIT_COLORS[aug.trait] ?? TRAIT_COLORS['General'];
  const tierColor = TIER_COLORS[aug.tier] ?? '#94a3b8';

  return (
    <div
      onClick={() => !disabled && onToggle()}
      title={aug.name}
      style={{
        padding:'6px 10px',
        borderRadius:'8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        border: `1px solid ${selected ? tc.border : '#1e1e4a'}`,
        background: selected ? tc.bg : '#0c0c1e',
        boxShadow: selected ? `0 0 10px ${tc.glow}` : 'none',
        transition:'all .15s',
        display:'flex', alignItems:'center', gap:'6px',
        maxWidth:'100%',
      }}
    >
      {/* ティアインジケーター */}
      <span style={{
        width:'8px', height:'8px', borderRadius:'50%', flexShrink:0,
        background: selected ? tierColor : '#333',
        boxShadow: selected ? `0 0 6px ${tierColor}88` : 'none',
        transition:'all .15s',
      }}/>
      <span style={{
        fontSize:'12px', fontWeight: selected ? 700 : 400,
        color: selected ? tc.text : '#555',
        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        lineHeight:1.3,
      }}>
        {aug.nameJa}
      </span>
      {selected && (
        <span style={{
          fontSize:'9px', color: tierColor, marginLeft:'auto',
          paddingLeft:'4px', flexShrink:0, fontWeight:700,
        }}>
          {aug.tier === 'Crown' ? '♛' : aug.tier === 'Crest' ? '◆' : aug.tier === 'Heart' ? '♥' : '★'}
        </span>
      )}
    </div>
  );
}

export default function ItemAugmentPanel({
  selectedItems, selectedAugments, onToggleItem, onToggleAugment
}: Props) {
  const [augSearch, setAugSearch] = useState('');
  const augList = augmentsData as AugmentData[];

  const filteredAugs = augList.filter(a => {
    const q = augSearch.toLowerCase();
    return a.nameJa.includes(augSearch) || a.name.toLowerCase().includes(q) || a.trait.toLowerCase().includes(q);
  });

  // トレイト別グループ
  const traitGroups = [...new Set(augList.map(a => a.trait))].map(trait => ({
    trait,
    augs: filteredAugs.filter(a => a.trait === trait),
  })).filter(g => g.augs.length > 0);

  return (
    <div style={{ padding:'14px 14px' }}>

      {/* ========== オーグメント ========== */}
      <section style={{ marginBottom:'28px' }}>
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px',
        }}>
          <h3 style={{ margin:0, fontSize:'13px', color:'#a78bfa', fontWeight:700 }}>
            🔮 オーグメント
            <span style={{
              marginLeft:'8px', fontSize:'12px', fontWeight:400,
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

        {/* 選択中オーグメント強調表示 */}
        {selectedAugments.length > 0 && (
          <div style={{
            display:'flex', flexDirection:'column', gap:'4px',
            marginBottom:'12px', padding:'8px',
            background:'#0d0a22', borderRadius:'8px', border:'1px solid #2a1a5a',
          }}>
            {selectedAugments.map(name => {
              const aug = augList.find(a => a.name === name);
              if (!aug) return null;
              return <AugmentBadge key={name} aug={aug} selected onToggle={() => onToggleAugment(name)} disabled={false}/>;
            })}
          </div>
        )}

        <input
          value={augSearch} onChange={e => setAugSearch(e.target.value)}
          placeholder="オーグメント検索（日本語・トレイト名OK）..."
          style={{
            width:'100%', padding:'7px 12px', marginBottom:'10px',
            background:'#0f0f2e', border:'1px solid #2a2a5a',
            borderRadius:'7px', color:'#ccc', fontSize:'13px',
            boxSizing:'border-box',
          }}
        />

        <div style={{ maxHeight:'300px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'12px' }}>
          {traitGroups.map(({ trait, augs }) => {
            const tc = TRAIT_COLORS[trait] ?? TRAIT_COLORS['General'];
            return (
              <div key={trait}>
                <div style={{
                  fontSize:'11px', fontWeight:700, color:tc.text,
                  marginBottom:'5px', paddingLeft:'4px',
                }}>
                  {trait === 'General' ? '⚙️ 汎用' : `✦ ${trait}`}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  {augs.map(aug => (
                    <AugmentBadge
                      key={aug.name} aug={aug}
                      selected={selectedAugments.includes(aug.name)}
                      disabled={!selectedAugments.includes(aug.name) && selectedAugments.length >= 3}
                      onToggle={() => onToggleAugment(aug.name)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== コンポーネントアイテム ========== */}
      <section style={{ marginBottom:'24px' }}>
        <h3 style={{ margin:'0 0 10px', fontSize:'13px', color:'#fbbf24', fontWeight:700 }}>
          🔩 コンポーネント
        </h3>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
          {(itemsData.components as ItemData[]).map(item => (
            <ItemIcon key={item.name} item={item}
              selected={selectedItems.includes(item.name)}
              onToggle={() => onToggleItem(item.name)}
            />
          ))}
        </div>
      </section>

      {/* ========== 完成アイテム ========== */}
      <section>
        <h3 style={{ margin:'0 0 10px', fontSize:'13px', color:'#34d399', fontWeight:700 }}>
          ✨ 完成アイテム
        </h3>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
          {(itemsData.completed as ItemData[]).map(item => (
            <ItemIcon key={item.name} item={item}
              selected={selectedItems.includes(item.name)}
              onToggle={() => onToggleItem(item.name)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
