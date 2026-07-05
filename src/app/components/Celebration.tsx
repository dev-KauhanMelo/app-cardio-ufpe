import { useLocation, useNavigate, Navigate } from 'react-router';
import { motion } from 'motion/react';
import Mascot from './Mascot';
import { getPlantStage } from '../../lib/gamification';

type Feeling = 'bem' | 'normal' | 'cansado';

export type CelebrationState = {
  kind: 'exercise' | 'day';
  exerciseName?: string;
  minutes?: number;
  feeling?: Feeling;
  xpAwarded: number;
  streak: number;
  leveledUp: boolean;
  newLevel: number;
  fromExercise?: { type: string; duration: number };
};

const FEELING_EMOJI: Record<Feeling, string> = {
  bem: '😄',
  normal: '😐',
  cansado: '😓',
};

function StatTile({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex-1 rounded-2xl border-2 overflow-hidden bg-surface"
      style={{ borderColor: color }}
    >
      <div className="py-1 text-center" style={{ backgroundColor: color }}>
        <span className="text-[11px] font-black uppercase tracking-wide text-white">{label}</span>
      </div>
      <div className="py-3 px-1 text-center text-[20px] font-extrabold text-ink whitespace-nowrap">
        {value}
      </div>
    </motion.div>
  );
}

export default function Celebration() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CelebrationState | null;

  if (!state) {
    return <Navigate to="/dashboard" replace />;
  }

  const { kind, exerciseName, minutes, feeling, xpAwarded, streak, leveledUp, newLevel, fromExercise } =
    state;
  const stage = getPlantStage(newLevel);
  const evolved = leveledUp && stage.label !== getPlantStage(Math.max(1, newLevel - 1)).label;
  const xpValue = xpAwarded > 0 ? `⚡ +${xpAwarded}` : '✓ feito';

  const title = kind === 'exercise' ? 'Exercício completo!' : 'Rotina de hoje concluída!';
  const subtitle =
    kind === 'exercise'
      ? `${exerciseName} · você cuidou do seu coração hoje.`
      : 'Volte amanhã para manter sua sequência.';

  const handleContinue = () => {
    if (kind === 'exercise') {
      navigate('/health', { state: { fromExercise }, replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="relative h-full overflow-y-auto bg-app-bg">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: 'var(--gradient-blob)' }}
      />
      <div className="relative min-h-full w-full flex flex-col items-center justify-center px-6 py-10">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Mascot level={newLevel} mood="happy" size={200} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-[32px] font-black text-ink mt-6 mb-1 text-center leading-tight"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-[15px] text-muted-ink mb-8 text-center"
        >
          {subtitle}
        </motion.p>

        {leveledUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 18 }}
            className="w-full rounded-2xl p-4 mb-6 text-center bg-[image:var(--gradient-hero)] shadow-sm"
          >
            <p className="text-[17px] font-black text-ink">
              {evolved ? `Seu Corazão evoluiu: ${stage.label}! 🌱` : `Nível ${newLevel}! 🎉`}
            </p>
          </motion.div>
        )}

        <div className="w-full flex gap-3 mb-10">
          {kind === 'exercise' ? (
            <>
              <StatTile
                label="Minutos"
                value={String(minutes ?? 0)}
                color="var(--color-walk)"
                delay={0.25}
              />
              <StatTile label="XP" value={xpValue} color="var(--color-warning)" delay={0.35} />
              <StatTile
                label="Sequência"
                value={`🔥 ${streak}`}
                color="var(--color-brand-light)"
                delay={0.45}
              />
            </>
          ) : (
            <>
              <StatTile
                label="Sequência"
                value={`🔥 ${streak}`}
                color="var(--color-brand-light)"
                delay={0.25}
              />
              <StatTile label="XP" value={xpValue} color="var(--color-warning)" delay={0.35} />
              {feeling && (
                <StatTile
                  label="Humor"
                  value={FEELING_EMOJI[feeling]}
                  color="var(--color-success)"
                  delay={0.45}
                />
              )}
            </>
          )}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleContinue}
          className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] shadow-lg hover:bg-brand transition-colors"
        >
          {kind === 'exercise' ? 'Fazer check-in' : 'Voltar ao início'}
        </motion.button>
      </div>
    </div>
  );
}
