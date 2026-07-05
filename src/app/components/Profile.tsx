import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, LogOut, Moon, Sun } from 'lucide-react';
import BottomNav from './BottomNav';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { getUserProfile, XP_PER_LEVEL, type UserProfile } from '../../lib/gamification';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(setProfile);
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-[26px] font-extrabold text-ink">Perfil</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-6">
        <div className="bg-surface rounded-3xl p-6 mb-4 shadow-sm">
          <p className="text-[18px] font-bold text-ink">{user?.displayName ?? 'Usuário'}</p>
          <p className="text-[14px] text-muted-ink">{user?.email}</p>

          {profile && (
            <div className="flex justify-between mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-[20px] font-bold text-brand">{profile.level}</p>
                <p className="text-[12px] text-muted-ink">Nível</p>
              </div>
              <div>
                <p className="text-[20px] font-bold text-success">{profile.xp % XP_PER_LEVEL}</p>
                <p className="text-[12px] text-muted-ink">XP no nível</p>
              </div>
              <div>
                <p className="text-[20px] font-bold text-warning">{profile.streak}</p>
                <p className="text-[12px] text-muted-ink">Streak</p>
              </div>
              <div>
                <p className="text-[20px] font-bold text-ink">{profile.longestStreak}</p>
                <p className="text-[12px] text-muted-ink">Recorde</p>
              </div>
            </div>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/achievements')}
          className="w-full bg-surface rounded-2xl p-4 mb-3 shadow-sm flex items-center justify-between"
        >
          <span className="text-[15px] font-medium text-ink">🏆 Conquistas</span>
          <ChevronRight size={20} className="text-muted-ink" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/history')}
          className="w-full bg-surface rounded-2xl p-4 mb-3 shadow-sm flex items-center justify-between"
        >
          <span className="text-[15px] font-medium text-ink">📋 Histórico de exercícios</span>
          <ChevronRight size={20} className="text-muted-ink" />
        </motion.button>

        <button
          onClick={toggleTheme}
          className="w-full bg-surface rounded-2xl p-4 mb-3 shadow-sm flex items-center justify-between"
        >
          <span className="text-[15px] font-medium text-ink flex items-center gap-2">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            Tema {theme === 'dark' ? 'escuro' : 'claro'}
          </span>
          <span className="text-[13px] text-brand font-semibold">Trocar</span>
        </button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="w-full bg-danger-soft rounded-2xl p-4 shadow-sm flex items-center justify-center gap-2 text-danger font-semibold"
        >
          <LogOut size={20} />
          Sair
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
