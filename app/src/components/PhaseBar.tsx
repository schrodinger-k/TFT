import type { PlayerState } from '../types/comp';

interface Props {
  state: PlayerState;
  onLevelChange: (n: number) => void;
  onStageChange: (s: number, r: number) => void;
}

const STAGES = [
  { label:'2-1',s:2,r:1},{ label:'2-3',s:2,r:3},
  { label:'3-1',s:3,r:1},{ label:'3-2',s:3,r:2},
  { label:'4-1',s:4,r:1},{ label:'4-2',s:4,r:2},
  { label:'5-1',s:5,r:1},
];

const AUG_STAGES = new Set(['2-1','3-2','4-2']);

function augmentTip(stage: number, round: number): string | null {
  const key = `${stage}-${round}`;
  if (key === '2-1') return '🔮 オーグメント選択！';
  if (key === '3-2') return '🔮 オーグメント2個目！';
  if (key === '4-2') return '🔮 最後のオーグメント！';
  return null;
}

export default function PhaseBar({ state, onLevelChange, onStageChange }: Props) {
  const tip = augmentTip(state.stage, state.round);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '24px',
      padding: '8px 28px', background: '#0b0b22',
      borderBottom: '1px solid #1e1e4a',
      flexShrink: 0, flexWrap: 'wrap',
    }}>
      {/* ステージ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#6b6b9a', fontSize: '12px', whiteSpace: 'nowrap' }}>ステージ</span>
        {STAGES.map(o => {
          const active = state.stage === o.s && state.round === o.r;
          const isAug = AUG_STAGES.has(o.label);
          return (
            <button key={o.label} onClick={() => onStageChange(o.s, o.r)} style={{
              padding: '4px 9px', borderRadius: '5px', border: 'none', cursor: 'pointer',
              background: active ? '#4a4aff' : '#12122e',
              color: active ? '#fff' : isAug ? '#c084fc' : '#888',
              fontSize: '12px', fontWeight: active ? 700 : 400,
              boxShadow: isAug ? '0 0 6px #7c3aed55' : 'none',
            }}>
              {isAug ? '🔮' : ''}{o.label}
            </button>
          );
        })}
      </div>

      {/* レベル */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#6b6b9a', fontSize: '12px' }}>Lv</span>
        {[3,4,5,6,7,8,9].map(lv => (
          <button key={lv} onClick={() => onLevelChange(lv)} style={{
            width: '28px', height: '28px', borderRadius: '50%',
            border: 'none', cursor: 'pointer',
            background: state.level === lv
              ? 'linear-gradient(135deg,#7c3aed,#4a4aff)' : '#12122e',
            color: state.level === lv ? '#fff' : '#666',
            fontSize: '12px', fontWeight: state.level === lv ? 700 : 400,
          }}>
            {lv}
          </button>
        ))}
      </div>

      {/* オーグメントアラート */}
      {tip && (
        <span style={{
          marginLeft: 'auto', padding: '4px 14px',
          background: '#2d1a5e', border: '1px solid #7c3aed',
          borderRadius: '20px', color: '#c084fc',
          fontSize: '12px', fontWeight: 700,
          animation: 'pulse 2s infinite',
        }}>
          {tip}
        </span>
      )}
    </div>
  );
}
