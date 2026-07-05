import { useNavigate, useLocation } from 'react-router';
import { Home, TrendingUp, Heart, Bot, Menu } from 'lucide-react';
import { motion } from 'motion/react';

const MORE_PATHS = ['/profile', '/history', '/achievements'];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: TrendingUp, label: 'Progresso', path: '/progress' },
    { icon: Heart, label: 'Saúde', path: '/health' },
    { icon: Bot, label: 'IA', path: '/ai' },
    { icon: Menu, label: 'Mais', path: '/profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border pb-6 pt-2">
      <div className="flex justify-around items-center px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/profile'
              ? MORE_PATHS.includes(location.pathname)
              : location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 min-h-16 justify-center px-4 rounded-2xl transition-colors ${
                isActive ? 'bg-brand-soft' : ''
              }`}
            >
              <Icon
                size={26}
                className={isActive ? 'text-brand' : 'text-icon-muted'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[12px] ${
                  isActive ? 'text-brand font-bold' : 'text-muted-ink'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
