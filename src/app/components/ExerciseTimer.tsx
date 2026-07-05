import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import { useNavigate, useParams, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { getExerciseCatalogItem } from '../../lib/exercise-catalog';
import { useAuth } from '../../lib/auth-context';
import { addExercise } from '../../lib/exercises';
import { completeChallenge, getUserProfile, type UserProfile } from '../../lib/gamification';
import Mascot from './Mascot';

const MOTIVATION_PHRASES = [
  'Vamos começar, no seu ritmo.',
  'Você está indo bem!',
  'Continue no seu ritmo.',
  'Já está quase lá!',
];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function progressColor(progress: number) {
  const clamped = Math.max(0, Math.min(1, progress));
  const from = clamped <= 0.5 ? { r: 239, g: 68, b: 68 } : { r: 250, g: 204, b: 21 };
  const to = clamped <= 0.5 ? { r: 250, g: 204, b: 21 } : { r: 34, g: 197, b: 94 };
  const localT = clamped <= 0.5 ? clamped / 0.5 : (clamped - 0.5) / 0.5;
  const r = Math.round(from.r + (to.r - from.r) * localT);
  const g = Math.round(from.g + (to.g - from.g) * localT);
  const b = Math.round(from.b + (to.b - from.b) * localT);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function ExerciseTimer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const exercise = id ? getExerciseCatalogItem(id) : undefined;
  const totalSeconds = (exercise?.recommendedMinutes[0] ?? 1) * 60;

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(setProfile);
  }, [user]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (elapsed >= totalSeconds && running) {
      setCelebrating(true);
    }
  }, [elapsed, totalSeconds, running]);

  if (!exercise) {
    return <Navigate to="/exercises" replace />;
  }

  const secondsRemaining = Math.max(0, totalSeconds - elapsed);
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;
  const barColor = progressColor(progress);
  const stepIndex = Math.min(
    exercise.instructions.length - 1,
    Math.floor(progress * exercise.instructions.length)
  );
  const phraseIndex = Math.min(
    MOTIVATION_PHRASES.length - 1,
    Math.floor(progress * MOTIVATION_PHRASES.length)
  );

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    const minutes = Math.max(1, Math.round(elapsed / 60));
    try {
      await addExercise(user.uid, { type: exercise.name, duration: minutes, intensity: 'leve' });
      await completeChallenge(user.uid, 'exercise', minutes);
      navigate('/health', { state: { fromExercise: { type: exercise.name, duration: minutes } } });
    } finally {
      setSaving(false);
    }
  };

  if (celebrating) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-app-bg px-6">
        <Mascot level={profile?.level ?? 1} mood="happy" size={120} />
        <p className="text-[22px] font-extrabold text-ink mt-6 mb-2 text-center">
          Meta atingida! 🎉
        </p>
        <p className="text-[15px] text-muted-ink mb-8 text-center">
          Você completou {Math.round(elapsed / 60)} minutos de {exercise.name.toLowerCase()}.
        </p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleFinish}
          disabled={saving}
          className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] shadow-lg hover:bg-brand transition-colors disabled:opacity-60 mb-4"
        >
          {saving ? 'Salvando...' : 'Finalizar'}
        </motion.button>
        <button
          onClick={() => setCelebrating(false)}
          className="text-[14px] font-semibold text-muted-ink"
        >
          Continuar mais um pouco
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <h1 className="text-[26px] font-extrabold text-ink">{exercise.name}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-4">{exercise.icon}</div>

        <p className="text-[48px] font-mono font-bold text-ink mb-2 tabular-nums">
          {elapsed >= totalSeconds ? `+${formatTime(elapsed - totalSeconds)}` : formatTime(secondsRemaining)}
        </p>
        <p className="text-[13px] text-muted-ink mb-4">
          {elapsed >= totalSeconds ? 'tempo extra' : `meta: ${Math.round(totalSeconds / 60)} min`}
        </p>

        <div className="w-full h-3 rounded-full bg-border overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.round(progress * 100))}%`, backgroundColor: barColor }}
          />
        </div>

        <p className="text-[15px] font-semibold text-ink mb-6 text-center">
          {MOTIVATION_PHRASES[phraseIndex]}
        </p>

        <div className="w-full bg-surface rounded-2xl p-4 mb-8 shadow-sm">
          <p className="text-[13px] font-semibold text-muted-ink mb-2">O que fazer agora</p>
          <p className="text-[16px] font-medium text-ink leading-relaxed">
            {exercise.instructions[stepIndex]}
          </p>
        </div>

        {!running ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setRunning(true)}
            className="w-20 h-20 bg-brand-light text-white rounded-full flex items-center justify-center shadow-lg mb-6"
            aria-label="Iniciar"
          >
            <Play size={32} fill="white" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setRunning(false)}
            className="w-20 h-20 bg-warning text-white rounded-full flex items-center justify-center shadow-lg mb-6"
            aria-label="Pausar"
          >
            <Pause size={32} fill="white" />
          </motion.button>
        )}

        {elapsed > 0 && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleFinish}
            disabled={saving}
            className="w-full h-14 bg-success text-white rounded-2xl font-bold text-[17px] shadow-lg disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Finalizar exercício'}
          </motion.button>
        )}

        <p className="text-[13px] text-muted-ink text-center mt-6">
          O cronômetro funciona enquanto esta tela estiver aberta.
        </p>
      </div>
    </div>
  );
}
