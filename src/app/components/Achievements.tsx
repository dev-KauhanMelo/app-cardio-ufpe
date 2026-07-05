import { useEffect, useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { getUserProfile, type UserProfile } from '../../lib/gamification';
import { getAllExercises } from '../../lib/exercises';

type Tab = 'todas' | 'conquistadas';

type Achievement = {
  id: string;
  label: string;
  description: string;
  earned: boolean;
};

export default function Achievements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [totalExercises, setTotalExercises] = useState(0);
  const [tab, setTab] = useState<Tab>('todas');

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(setProfile);
    getAllExercises(user.uid).then((exercises) => setTotalExercises(exercises.length));
  }, [user]);

  const achievements: Achievement[] = [
    {
      id: 'first-walk',
      label: 'Primeira Caminhada',
      description: 'Parabéns pelo início!',
      earned: totalExercises >= 1,
    },
    {
      id: 'streak-7',
      label: '7 Dias Seguidos',
      description: 'Muito bem!',
      earned: Boolean(profile && profile.longestStreak >= 7),
    },
    {
      id: 'exercises-10',
      label: '10 Exercícios',
      description: 'Ótimo trabalho!',
      earned: totalExercises >= 10,
    },
    {
      id: 'streak-15',
      label: '15 Dias Seguidos',
      description: 'Você é incrível!',
      earned: Boolean(profile && profile.longestStreak >= 15),
    },
  ];

  const visibleAchievements =
    tab === 'conquistadas' ? achievements.filter((a) => a.earned) : achievements;

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-12 pb-4 px-6">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <h1 className="text-[26px] font-extrabold text-ink mb-4">Conquistas</h1>

        <div className="flex gap-2 bg-surface rounded-2xl p-1">
          <button
            onClick={() => setTab('todas')}
            className={`flex-1 py-2 rounded-xl text-[14px] font-semibold transition-colors ${
              tab === 'todas' ? 'bg-brand-light text-white' : 'text-muted-ink'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setTab('conquistadas')}
            className={`flex-1 py-2 rounded-xl text-[14px] font-semibold transition-colors ${
              tab === 'conquistadas' ? 'bg-brand-light text-white' : 'text-muted-ink'
            }`}
          >
            Conquistadas
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-6">
        {visibleAchievements.length === 0 ? (
          <p className="text-[15px] text-muted-ink text-center mt-8">
            Ainda não há conquistas nessa categoria. Continue se exercitando!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {visibleAchievements.map((achievement) => (
              <Badge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ achievement }: { achievement: Achievement }) {
  const { label, description, earned } = achievement;
  return (
    <div className={`rounded-2xl p-4 shadow-sm text-center ${earned ? 'bg-success-soft' : 'bg-surface'}`}>
      <div className="text-3xl mb-2 flex justify-center">
        {earned ? '🏅' : <Lock className="text-icon-muted" size={28} />}
      </div>
      <p className={`text-[14px] font-semibold ${earned ? 'text-ink' : 'text-muted-ink'}`}>{label}</p>
      {earned && <p className="text-[12px] text-muted-ink mt-1">{description}</p>}
    </div>
  );
}
