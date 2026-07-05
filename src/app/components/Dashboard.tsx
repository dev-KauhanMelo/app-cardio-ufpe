import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import BottomNav from './BottomNav';
import PlantWidget from './PlantWidget';
import DailyChallenges from './DailyChallenges';
import { useAuth } from '../../lib/auth-context';
import { getExercisesSince } from '../../lib/exercises';
import { getExerciseCatalogItem } from '../../lib/exercise-catalog';
import {
  completeChallenge,
  getNextRoutineStep,
  getTodayChallenges,
  getUserProfile,
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

// Cache em memória para a Home renderizar instantânea ao voltar de outra tela
// (stale-while-revalidate: mostra o último dado e atualiza por baixo).
let homeCache: {
  uid: string | null;
  profile: UserProfile | null;
  challenges: TodayChallenges | null;
  completedDays: boolean[] | null;
} = { uid: null, profile: null, challenges: null, completedDays: null };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cached = user && homeCache.uid === user.uid ? homeCache : null;
  const [completedDays, setCompletedDays] = useState<boolean[]>(
    () => cached?.completedDays ?? Array(7).fill(false)
  );
  const [loading, setLoading] = useState(() => !cached?.completedDays);
  const [profile, setProfile] = useState<UserProfile | null>(() => cached?.profile ?? null);
  const [challenges, setChallenges] = useState<TodayChallenges | null>(
    () => cached?.challenges ?? null
  );
  const [completingChallenge, setCompletingChallenge] = useState(false);

  const refreshGamification = async (uid: string) => {
    const [p, c] = await Promise.all([getUserProfile(uid), getTodayChallenges(uid)]);
    homeCache = { ...homeCache, uid, profile: p, challenges: c };
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
        homeCache = { ...homeCache, uid: user.uid, completedDays: days };
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
  const exerciseName = getExerciseCatalogItem(DEFAULT_EXERCISE_ID)?.name ?? 'Caminhada';

  const handleRoutineAction = () => {
    if (routineStep === 'exercise') {
      navigate(`/exercises/${DEFAULT_EXERCISE_ID}`);
    } else if (routineStep === 'checkin') {
      navigate('/health');
    }
  };

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-b-[32px] bg-[image:var(--gradient-hero)] px-6 pt-14 pb-7">
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{ backgroundImage: 'var(--gradient-blob)' }}
          />
          <div className="relative">
            <h1 className="text-[32px] font-black text-ink leading-tight">
              Olá, {user?.displayName ?? 'tudo bem'}
            </h1>
            <p className="text-[15px] text-muted-ink mb-6">Como está sua recuperação hoje?</p>

            <div className="mb-6 min-h-[188px]">
              {profile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <PlantWidget
                    profile={profile}
                    weekCompletedDays={loading ? undefined : completedDays}
                    variant="hero"
                  />
                </motion.div>
              )}
            </div>

            {routineStep === 'done' ? (
              <div className="text-center py-2">
                <p className="text-[17px] font-bold text-ink">🎉 Rotina de hoje concluída!</p>
                <p className="text-[13px] text-muted-ink mt-1">
                  Volte amanhã para continuar sua sequência.
                </p>
              </div>
            ) : (
              routineStep && (
                <>
                  <p className="text-[14px] font-semibold text-muted-ink mb-2">
                    {routineStep === 'exercise'
                      ? `Sua rotina de hoje · ${exerciseName}`
                      : 'Exercício feito ✓ · falta o check-in'}
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleRoutineAction}
                    className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] shadow-lg hover:bg-brand transition-colors"
                  >
                    {routineStep === 'exercise' ? 'Começar agora' : 'Fazer check-in'}
                  </motion.button>
                </>
              )
            )}
          </div>
        </div>

        {/* Sheet */}
        <div className="px-6 pt-8 space-y-3">
          {challenges && (
            <DailyChallenges
              challenges={challenges}
              onCompleteNutrition={handleCompleteNutrition}
              completing={completingChallenge}
              onExerciseClick={
                !challenges.exercise
                  ? () => navigate(`/exercises/${DEFAULT_EXERCISE_ID}`)
                  : undefined
              }
              onCheckinClick={!challenges.checkin ? () => navigate('/health') : undefined}
            />
          )}

          {/* Library */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/exercises')}
            className="w-full bg-surface rounded-2xl p-4 shadow-sm flex items-center gap-3"
            aria-label="Ver biblioteca de exercícios"
          >
            <div className="w-10 h-10 rounded-full bg-info-soft flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="text-ink" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-[15px] font-bold text-ink">Biblioteca de exercícios</h3>
              <p className="text-[13px] text-muted-ink">Veja todos os exercícios disponíveis</p>
            </div>
            <ChevronRight size={20} className="text-muted-ink" />
          </motion.button>

          {/* AI assistant */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/ai')}
            className="w-full bg-surface rounded-2xl p-4 shadow-sm flex items-center gap-3"
            aria-label="Abrir assistente de saúde"
          >
            <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center flex-shrink-0 text-xl">
              🤖
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-[15px] font-bold text-ink">Assistente de saúde</h3>
              <p className="text-[13px] text-muted-ink">Tire suas dúvidas sobre a recuperação</p>
            </div>
            <ChevronRight size={20} className="text-muted-ink" />
          </motion.button>

          {/* Manual register */}
          <button
            onClick={() => navigate('/register')}
            className="w-full h-12 rounded-2xl border border-border text-[15px] font-semibold text-muted-ink"
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
