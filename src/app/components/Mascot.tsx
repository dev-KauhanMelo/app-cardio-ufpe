import { motion } from 'motion/react';
import { getPlantStage, type MascotMood } from '../../lib/gamification';

type Props = {
  level: number;
  mood: MascotMood;
  size?: number;
};

const LEAF_POSITIONS = [
  { x: 78, y: 38, rotate: -35 },
  { x: 122, y: 38, rotate: 35 },
  { x: 68, y: 55, rotate: -60 },
  { x: 132, y: 55, rotate: 60 },
];

function Face({ mood }: { mood: MascotMood }) {
  if (mood === 'sleepy') {
    return (
      <g>
        <path d="M82 92 q8 -6 16 0" stroke="#1f2937" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M102 92 q8 -6 16 0" stroke="#1f2937" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M95 108 q5 4 10 0" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="128" y="70" fontSize="14" fill="#94a3b8" fontWeight="bold">z</text>
        <text x="138" y="58" fontSize="18" fill="#94a3b8" fontWeight="bold">Z</text>
      </g>
    );
  }

  if (mood === 'happy') {
    return (
      <g>
        <circle cx="88" cy="92" r="5.5" fill="#1f2937" />
        <circle cx="112" cy="92" r="5.5" fill="#1f2937" />
        <circle cx="90" cy="90" r="1.6" fill="#fff" />
        <circle cx="114" cy="90" r="1.6" fill="#fff" />
        <path d="M85 106 q15 14 30 0" stroke="#1f2937" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="75" cy="102" r="6" fill="#fb7185" opacity="0.5" />
        <circle cx="125" cy="102" r="6" fill="#fb7185" opacity="0.5" />
      </g>
    );
  }

  return (
    <g>
      <circle cx="88" cy="92" r="5" fill="#1f2937" />
      <circle cx="112" cy="92" r="5" fill="#1f2937" />
      <path d="M90 108 q10 4 20 0" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

export default function Mascot({ level, mood, size = 140 }: Props) {
  const stage = getPlantStage(level);

  return (
    <motion.svg
      key={`${stage.label}-${mood}`}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Mascote ${stage.label}, humor ${mood}`}
    >
      <defs>
        <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id="potGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c2703d" />
          <stop offset="100%" stopColor="#9a5527" />
        </linearGradient>
      </defs>

      {/* Pot */}
      <path d="M65 150 L135 150 L125 185 Q100 192 75 185 Z" fill="url(#potGradient)" />
      <rect x="60" y="142" width="80" height="12" rx="6" fill="#c2703d" />

      {/* Leaves */}
      {LEAF_POSITIONS.slice(0, stage.leaves).map((leaf, index) => (
        <ellipse
          key={index}
          cx={leaf.x}
          cy={leaf.y}
          rx="12"
          ry="7"
          fill="#22c55e"
          transform={`rotate(${leaf.rotate} ${leaf.x} ${leaf.y})`}
        />
      ))}

      {/* Heart body */}
      <path
        d="M100 138
           C 60 110, 40 82, 40 60
           C 40 38, 58 24, 78 24
           C 90 24, 98 30, 100 38
           C 102 30, 110 24, 122 24
           C 142 24, 160 38, 160 60
           C 160 82, 140 110, 100 138 Z"
        fill="url(#heartGradient)"
      />

      <Face mood={mood} />
    </motion.svg>
  );
}
