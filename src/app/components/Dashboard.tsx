import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import BottomNav from './BottomNav';
import PlantWidget from './PlantWidget';
import DailyChallenges from './DailyChallenges';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getExercisesSince } from '../../lib/exercises';
import {
  completeChallenge,
  getTodayChallenges,
  getUserProfile,
  type TodayChallenges,
  type UserProfile,
} from '../../lib/gamification';

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const TODAY_EXERCISES = [
  { icon: '🚶', name: 'Caminhada leve', duration: '20 min', color: 'var(--color-walk)' },
  { icon: '🫁', name: 'Exercício respiratório', duration: '10 min', color: 'var(--color-breath)' },
  { icon: '🧘', name: 'Alongamento', duration: '10 min', color: 'var(--color-stretch)' },
];

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7; // 0 = Monday
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
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
        {profile && <PlantWidget profile={profile} />}
        {challenges && (
          <DailyChallenges
            challenges={challenges}
            onCompleteNutrition={handleCompleteNutrition}
            completing={completingChallenge}
          />
        )}

        {/* Today's Exercises */}
        <div className="bg-surface rounded-3xl p-6 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-bold text-ink">
              Hoje você tem:
            </h2>
            <button
              onClick={() => navigate('/exercises')}
              className="text-[13px] font-semibold text-brand"
            >
              Ver biblioteca
            </button>
          </div>
          <div className="space-y-3">
            {TODAY_EXERCISES.map((exercise, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register')}
                className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-app-bg transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `color-mix(in srgb, ${exercise.color} 20%, transparent)` }}
                >
                  {exercise.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[15px] font-medium text-ink">
                    {exercise.name}
                  </p>
                  <p className="text-[13px] text-muted-ink">{exercise.duration}</p>
                </div>
                <ChevronRight size={20} className="text-muted-ink" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Register Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/register')}
          className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] mb-4 shadow-lg hover:bg-brand transition-colors"
        >
          + Registrar Exercício
        </motion.button>

        {/* Weekly Progress */}
        <div className="bg-surface rounded-3xl p-6 mb-4 shadow-sm">
          <h2 className="text-[17px] font-bold text-ink mb-4">
            Progresso semanal
          </h2>
          <div className="flex justify-between gap-2">
            {WEEK_DAYS.map((day, index) => {
              const isCompleted = !loading && completedDays[index];
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-full h-2 rounded-full transition-colors ${
                      isCompleted ? 'bg-success' : 'bg-border'
                    }`}
                  ></div>
                  <span className="text-[13px] text-muted-ink">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/ai')}
          className="w-full bg-success-soft rounded-3xl p-6 shadow-sm transition-colors"
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
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
