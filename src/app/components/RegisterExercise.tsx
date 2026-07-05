import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../../lib/auth-context';
import { addExercise } from '../../lib/exercises';
import { completeChallenge, getExerciseTier } from '../../lib/gamification';

type TimerState = { type: string; minutes: number };

export default function RegisterExercise() {
  const navigate = useNavigate();
  const location = useLocation();
  const timerState = location.state as TimerState | null;
  const { user } = useAuth();
  const [exerciseType, setExerciseType] = useState(timerState?.type ?? 'Caminhada');
  const [duration, setDuration] = useState(String(timerState?.minutes ?? 20));
  const [intensity, setIntensity] = useState<'leve' | 'médio' | 'intenso'>('leve');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const intensityOptions = [
    { value: 'leve', label: 'Leve', emoji: '😊', color: 'var(--color-success)', bg: 'var(--color-success-soft)' },
    { value: 'médio', label: 'Médio', emoji: '😐', color: 'var(--color-warning)', bg: 'var(--color-warning-soft)' },
    { value: 'intenso', label: 'Intenso', emoji: '❤️', color: 'var(--color-danger)', bg: 'var(--color-danger-soft)' },
  ];

  const durationMinutes = Number(duration) || 0;
  const currentTier = getExerciseTier(durationMinutes);

  const handleSave = async () => {
    if (!user) return;
    setError(null);
    setSaving(true);
    try {
      await addExercise(user.uid, {
        type: exerciseType,
        duration: durationMinutes,
        intensity,
      });
      const result = await completeChallenge(user.uid, 'exercise', durationMinutes);
      navigate('/celebrate', {
        replace: true,
        state: {
          kind: 'exercise',
          exerciseName: exerciseType,
          minutes: durationMinutes,
          xpAwarded: result.xpAwarded,
          streak: result.newStreak,
          leveledUp: result.leveledUp,
          newLevel: result.newLevel,
          fromExercise: { type: exerciseType, duration: durationMinutes },
        },
      });
    } catch {
      setError('Não foi possível salvar o exercício. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <h1 className="text-[26px] font-extrabold text-ink">
          Registrar Exercício
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-6 px-6">
        {/* Exercise Type */}
        <div className="mb-6">
          <label className="block text-[15px] font-medium text-ink mb-2">
            Tipo de Exercício
          </label>
          <select
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
            className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
          >
            <option>Caminhada</option>
            <option>Bicicleta</option>
            <option>Alongamento</option>
            <option>Exercício respiratório</option>
          </select>
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="block text-[15px] font-medium text-ink mb-2">
            Duração (minutos)
          </label>
          <input
            type="number"
            min={0}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
          <p className="text-[13px] text-muted-ink mt-2">
            {currentTier.label} → <span className="font-semibold text-success">+{currentTier.xp} XP</span>
          </p>
        </div>

        {/* Intensity */}
        <div className="mb-6">
          <label className="block text-[15px] font-medium text-ink mb-2">
            Intensidade
          </label>
          <div className="grid grid-cols-3 gap-3">
            {intensityOptions.map((option) => (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIntensity(option.value as any)}
                className="relative bg-surface border-2 rounded-2xl py-6 transition-all"
                style={{
                  borderColor: intensity === option.value ? option.color : 'var(--color-border)',
                  backgroundColor: intensity === option.value ? option.bg : 'var(--color-surface)',
                }}
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className="text-[15px] font-medium text-ink">
                  {option.label}
                </div>
                {intensity === option.value && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: option.color }}
                  >
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Educational Card */}
        <div className="bg-info-soft rounded-2xl p-4 mb-6">
          <p className="text-[14px] text-ink leading-relaxed">
            <strong>Escala de esforço percebido:</strong> Escolha como você se sentiu durante o exercício.
          </p>
        </div>

        {error && <p className="text-[15px] text-danger mb-4">{error}</p>}

        {/* Save Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] mb-6 shadow-lg hover:bg-brand transition-colors disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar Exercício'}
        </motion.button>
      </div>

    </div>
  );
}
