import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronRight, Minus, Plus } from 'lucide-react';
import {
  CHECKIN_XP,
  EXERCISE_TIER_TABLE,
  NUTRITION_TIER_TABLE,
  getNutritionTier,
  type TodayChallenges,
} from '../../lib/gamification';

type Props = {
  challenges: TodayChallenges;
  onCompleteNutrition: (portions: number) => void;
  completing: boolean;
  onExerciseClick?: () => void;
  onCheckinClick?: () => void;
};

export default function DailyChallenges({
  challenges,
  onCompleteNutrition,
  completing,
  onExerciseClick,
  onCheckinClick,
}: Props) {
  const [portions, setPortions] = useState(0);
  const nutritionTier = getNutritionTier(portions);

  return (
    <div className="bg-surface rounded-3xl p-6 mb-4 shadow-sm">
      <h2 className="text-[17px] font-bold text-ink mb-4">Desafios de hoje</h2>

      <div className="space-y-3">
        {/* Exercise */}
        <ChallengeRow
          label="Registrar um exercício"
          entry={challenges.exercise}
          hint={EXERCISE_TIER_TABLE.map((t) => `${t.label}: +${t.xp} XP`).join(' · ')}
          onClick={onExerciseClick}
        />

        {/* Check-in */}
        <ChallengeRow
          label="Fazer o check-in de saúde"
          entry={challenges.checkin}
          hint={`+${CHECKIN_XP} XP`}
          onClick={onCheckinClick}
        />

        {/* Nutrition */}
        <div className="p-3 rounded-2xl bg-app-bg">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                challenges.nutrition ? 'bg-success' : 'bg-surface border-2 border-border'
              }`}
            >
              {challenges.nutrition && <Check size={18} className="text-white" strokeWidth={3} />}
            </div>
            <div className="flex-1">
              <p className={`text-[15px] font-medium ${challenges.nutrition ? 'text-muted-ink line-through' : 'text-ink'}`}>
                Comer frutas ou vegetais hoje
              </p>
              <p className="text-[13px] text-muted-ink">
                {NUTRITION_TIER_TABLE.map((t) => `${t.label}: +${t.xp} XP`).join(' · ')}
              </p>
            </div>
          </div>

          {!challenges.nutrition && (
            <div className="flex items-center gap-3 mt-3 pl-11">
              <button
                onClick={() => setPortions((p) => Math.max(0, p - 1))}
                className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center"
                aria-label="Diminuir porções"
              >
                <Minus size={16} className="text-ink" />
              </button>
              <span className="text-[16px] font-bold text-ink text-center">
                {portions} {portions === 1 ? 'porção' : 'porções'}
              </span>
              <button
                onClick={() => setPortions((p) => Math.min(9, p + 1))}
                className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center"
                aria-label="Aumentar porções"
              >
                <Plus size={16} className="text-ink" />
              </button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                disabled={completing || portions === 0}
                onClick={() => onCompleteNutrition(portions)}
                className="ml-auto bg-brand text-white text-[13px] font-semibold px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Confirmar {nutritionTier.xp > 0 ? `(+${nutritionTier.xp} XP)` : ''}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChallengeRow({
  label,
  entry,
  hint,
  onClick,
}: {
  label: string;
  entry: { tier: string; xp: number } | null;
  hint: string;
  onClick?: () => void;
}) {
  const done = Boolean(entry);
  const Wrapper = onClick ? motion.button : 'div';
  return (
    <Wrapper
      {...(onClick ? { whileTap: { scale: 0.98 }, onClick, 'aria-label': label } : {})}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl bg-app-bg text-left ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          done ? 'bg-success' : 'bg-surface border-2 border-border'
        }`}
      >
        {done && <Check size={18} className="text-white" strokeWidth={3} />}
      </div>
      <div className="flex-1">
        <p className={`text-[15px] font-medium ${done ? 'text-muted-ink line-through' : 'text-ink'}`}>
          {label}
        </p>
        <p className="text-[13px] text-muted-ink">{done ? `${entry!.tier} · +${entry!.xp} XP` : hint}</p>
      </div>
      {onClick && <ChevronRight size={20} className="text-muted-ink flex-shrink-0" />}
    </Wrapper>
  );
}
