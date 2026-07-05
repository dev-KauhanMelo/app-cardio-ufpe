import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import BottomNav from './BottomNav';
import PlantWidget from './PlantWidget';
import DailyChallenges from './DailyChallenges';
import Mascot from './Mascot';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getExercisesSince } from '../../lib/exercises';
import { getExerciseCatalogItem } from '../../lib/exercise-catalog';
import {
  completeChallenge,
  getNextRoutineStep,
  getTodayChallenges,
  getUserProfile,
  type RoutineStep,
  type TodayChallenges,
  type UserProfile,
} from '../../lib/gamification';

const DEFAULT_EXERCISE_ID = 'caminhada';

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7; // 0 = Monday
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function RoutineCard({
  step,
  level,
  onAction,
}: {
  step: RoutineStep;
  level: number;
  onAction: () => void;
}) {
  if (step === 'done') {
    return (
      <div className="relative overflow-hidden rounded-3xl p-6 mb-4 shadow-sm bg-[image:var(--gradient-hero)]">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: 'var(--gradient-blob)' }}
        />
        <div className="relative flex items-center gap-4">
          <Mascot level={level} mood="happy" size={72} />
          <div>
            <p className="text-[17px] font-bold text-ink">Rotina de hoje concluída! 🎉</p>
            <p className="text-[14px] text-muted-ink">Volte amanhã para continuar sua sequência.</p>
          </div>
        </div>
      </div>
    );
  }

  const exerciseName = getExerciseCatalogItem(DEFAULT_EXERCISE_ID)?.name ?? 'Caminhada';
  const title = step === 'exercise' ? 'Sua rotina de hoje' : 'Como você se sentiu no exercício de hoje?';
  const subtitle = step === 'exercise' ? exerciseName : 'Leva menos de 1 minuto';
  const buttonLabel = step === 'exercise' ? 'Começar agora' : 'Fazer check-in';

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 mb-4 shadow-sm bg-[image:var(--gradient-hero)]">
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{ backgroundImage: 'var(--gradient-blob)' }}
      />
      <div className="relative">
        <p className="text-[14px] font-semibold text-muted-ink mb-1">{title}</p>
        <p className="text-[20px] font-extrabold text-ink mb-4">{subtitle}</p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAction}
          className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] shadow-lg hover:bg-brand transition-colors"
        >
          {buttonLabel}
        </motion.button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [completedDays, setCompletedDays] = useState<boolean[]>(Array(7).fill(false));
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [challenges, setChallenges] = useState<TodayChallenges | null>(null);
  const [completingChallenge, setCompletingChallenge] = useState(false);

  const refreshGamification = async (uid: string) => {
    const [p, c] = await Promise.all([getUserProfile(uid), getTodayChallenges(uid)]);
    setProfile(p);
    setChallenges(c);
  };

  useEffect(() => {
    if (!user) return;
    const weekStart = startOfWeek(new Date());
    getExercisesSince(user.uid, weekStart)
      .then((entries) => {
        const days = Array(7).fill(false);
        entries.forEach((entry) => {
          const dayIndex = (entry.createdAt.getDay() + 6) % 7;
          days[dayIndex] = true;
        });
        setCompletedDays(days);
      })
      .finally(() => setLoading(false));

    refreshGamification(user.uid);
  }, [user]);

  const handleCompleteNutrition = async (portions: number) => {
    if (!user) return;
    setCompletingChallenge(true);
    try {
      await completeChallenge(user.uid, 'nutrition', portions);
      await refreshGamification(user.uid);
    } finally {
      setCompletingChallenge(false);
    }
  };

  const routineStep = challenges ? getNextRoutineStep(challenges) : null;

  const handleRoutineAction = () => {
    if (routineStep === 'exercise') {
      navigate(`/exercises/${DEFAULT_EXERCISE_ID}`);
    } else if (routineStep === 'checkin') {
      navigate('/health');
    }
  };

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex justify-end items-center mb-4">
          <button onClick={toggleTheme} className="p-2 -mr-2" aria-label="Alternar tema">
            {theme === 'dark' ? <Sun size={24} className="text-ink" /> : <Moon size={24} className="text-ink" />}
          </button>
        </div>
        <h1 className="text-[26px] font-extrabold text-ink mb-1">
          Olá, {user?.displayName ?? 'tudo bem'}
        </h1>
        <p className="text-[15px] text-muted-ink">
          Como está sua recuperação hoje?
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-4">
        {routineStep && profile && (
          <RoutineCard step={routineStep} level={profile.level} onAction={handleRoutineAction} />
        )}

        {/* Library Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/exercises')}
          className="w-full bg-surface rounded-3xl p-6 shadow-sm transition-colors mb-4 flex items-center gap-3"
          aria-label="Ver biblioteca de exercícios"
        >
          <div className="w-12 h-12 rounded-full bg-info-soft flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} className="text-ink" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-[15px] font-bold text-ink">Biblioteca de exercícios</h3>
            <p className="text-[13px] text-muted-ink">Veja todos os exercícios disponíveis</p>
          </div>
          <ChevronRight size={20} className="text-muted-ink" />
        </motion.button>

        {profile && (
          <PlantWidget profile={profile} weekCompletedDays={loading ? undefined : completedDays} />
        )}
        {challenges && (
          <DailyChallenges
            challenges={challenges}
            onCompleteNutrition={handleCompleteNutrition}
            completing={completingChallenge}
            onExerciseClick={
              !challenges.exercise ? () => navigate(`/exercises/${DEFAULT_EXERCISE_ID}`) : undefined
            }
            onCheckinClick={!challenges.checkin ? () => navigate('/health') : undefined}
          />
        )}

        {/* AI Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/ai')}
          className="w-full bg-success-soft rounded-3xl p-6 shadow-sm transition-colors mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">🤖</div>
            <div className="flex-1 text-left">
              <h3 className="text-[15px] font-bold text-ink mb-1">
                Mensagem da IA
              </h3>
              <p className="text-[15px] text-ink">
                Você está indo bem! Continue assim 🔥
              </p>
            </div>
            <ChevronRight size={20} className="text-ink" />
          </div>
        </motion.button>

        {/* Secondary navigation */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => navigate('/register')}
            className="text-[13px] font-semibold text-muted-ink"
          >
            Registrar manualmente
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
