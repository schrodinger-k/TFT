import type { PlayerState } from '../../types/comp';
import type { CompScore } from '../../types/comp';

interface Props {
  state: PlayerState;
  scores: CompScore[];
  onLevelChange: (level: number) => void;
  onStageChange: (stage: number, round: number) => void;
}

const STAGE_ROUND_OPTIONS = [
  { label: '2-1', stage: 2, round: 1 },
  { label: '2-3', stage: 2, round: 3 },
  { label: '3-1', stage: 3, round: 1 },
  { label: '3-2', stage: 3, round: 2 },
  { label: '4-1', stage: 4, round: 1 },
  { label: '4-2', stage: 4, round: 2 },
  { label: '5-1', stage: 5, round: 1 },
];

export default function EarlyGameHints({ state, scores, onLevelChange, onStageChange }: Props) {
  const topComp = scores[0];

  function getPhaseAdvice(): string {
    const { level, stage } = state;
    if (stage <= 2 || level <= 4) {
      return '序盤：節約しながら構成を探りましょう。リロールより利子（10G）を優先。';
    }
    if (stage === 3 || level <= 6) {
      return 'ステージ3：オーグメントで方向性を決める。スコア上位の構成に絞り始めよう。';
    }
    if (stage === 4 || level <= 7) {
      return 'ステージ4：構成を確定させてアイテムを完成品に。レベル7でユニット8体を目指す。';
    }
    return 'ステージ5以降：レベル8〜9で強ユニットを追加。終盤の入れ替えに備えよう。';
  }

  function getAugmentTiming(): string | null {
    const { stage, round } = state;
    if (stage === 2 && round === 1) return '🔮 オーグメント選択タイミング！構成スコアを参考に選ぼう。';
    if (stage === 3 && round === 2) return '🔮 オーグメント選択タイミング！トップ構成と相性の良いものを。';
    if (stage === 4 && round === 2) return '🔮 最後のオーグメント！ここでキャリーを確定させよう。';
    return null;
  }

  const augmentTip = getAugmentTiming();

  return (
    <div style={{ padding: '12px' }}>
      {/* ステージ・レベル入力 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>現在のステージ</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {STAGE_ROUND_OPTIONS.map(opt => {
              const isActive = state.stage === opt.stage && state.round === opt.round;
              return (
                <button
                  key={opt.label}
                  onClick={() => onStageChange(opt.stage, opt.round)}
                  style={{
                    padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                    background: isActive ? '#4a4aff' : '#2a2a4a',
                    color: '#fff', fontSize: '12px',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ minWidth: '100px' }}>
          <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>現在のレベル: {state.level}</div>
          <input
            type="range" min={3} max={9} value={state.level}
            onChange={e => onLevelChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#4a4aff' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#555' }}>
            <span>3</span><span>9</span>
          </div>
        </div>
      </div>

      {/* オーグメントタイミング */}
      {augmentTip && (
        <div style={{
          padding: '10px 12px', background: '#1a0a2e', borderRadius: '8px',
          border: '1px solid #7c3aed', marginBottom: '10px', color: '#c084fc',
          fontSize: '13px', fontWeight: 'bold',
        }}>
          {augmentTip}
        </div>
      )}

      {/* フェーズアドバイス */}
      <div style={{
        padding: '10px 12px', background: '#0a1628', borderRadius: '8px',
        border: '1px solid #2a4a8a', marginBottom: '10px', color: '#93c5fd',
        fontSize: '13px',
      }}>
        📋 {getPhaseAdvice()}
      </div>

      {/* トップ構成の早期ユニットヒント */}
      {topComp && topComp.totalScore > 0 && (
        <div style={{
          padding: '10px 12px', background: '#0f1a10', borderRadius: '8px',
          border: '1px solid #22c55e44',
        }}>
          <div style={{ color: '#22c55e', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
            🎯 今押さえておきたいユニット（{topComp.comp.name}）
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {topComp.comp.keyEarlyUnits.map(unit => {
              const owned = state.champions.includes(unit);
              return (
                <span
                  key={unit}
                  style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '12px',
                    background: owned ? '#166534' : '#1a1a2e',
                    color: owned ? '#86efac' : '#888',
                    border: `1px solid ${owned ? '#22c55e' : '#333'}`,
                  }}
                >
                  {owned ? '✓ ' : ''}{unit}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
