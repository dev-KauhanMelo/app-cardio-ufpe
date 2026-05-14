import { useNavigate, useLocation } from 'react-router';
import { Home, TrendingUp, Heart, Bot } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: TrendingUp, label: 'Progresso', path: '/progress' },
    { icon: Heart, label: 'Saúde', path: '/health' },
    { icon: Bot, label: 'IA', path: '/ai' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] pb-6 pt-3">
      <div className="flex justify-around items-center px-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 transition-colors"
            >
              <Icon
                size={24}
                className={isActive ? 'text-[#3B82F6]' : 'text-[#6B7280]'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[11px] ${
                  isActive ? 'text-[#3B82F6] font-semibold' : 'text-[#6B7280]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
