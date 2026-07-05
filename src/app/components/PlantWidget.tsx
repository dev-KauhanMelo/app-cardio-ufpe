import { motion } from 'motion/react';
import Mascot from './Mascot';
import {
  getMascotMood,
  getPlantStage,
  XP_PER_LEVEL,
  type UserProfile,
} from '../../lib/gamification';

const RING_SIZE = 132;
const STROKE = 10;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PlantWidget({ profile }: { profile: UserProfile }) {
  const stage = getPlantStage(profile.level);
  const mood = getMascotMood(profile);
  const xpIntoLevel = profile.xp % XP_PER_LEVEL;
  const progressRatio = xpIntoLevel / XP_PER_LEVEL;
  const dashOffset = CIRCUMFERENCE * (1 - progressRatio);

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 mb-4 shadow-sm bg-[image:var(--gradient-hero)]">
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{ backgroundImage: 'var(--gradient-blob)' }}
      />
      <div className="relative flex items-center gap-4">
        <div className="relative flex-shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <svg width={RING_SIZE} height={RING_SIZE} className="absolute inset-0 -rotate-90">
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="var(--color-surface)"
              strokeWidth={STROKE}
              fill="none"
              opacity={0.5}
            />
            <motion.circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="url(#ringGradient)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-light)" />
                <stop offset="100%" stopColor="var(--color-success)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Mascot level={profile.level} mood={mood} size={92} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[16px] font-bold text-ink">
              {stage.label} · Nível {profile.level}
            </p>
            {profile.streak > 0 && (
              <span className="text-[14px] font-semibold text-warning flex items-center gap-1">
                🔥 {profile.streak}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted-ink">
            {xpIntoLevel} / {XP_PER_LEVEL} XP para o próximo nível
          </p>
        </div>
      </div>
    </div>
  );
}
