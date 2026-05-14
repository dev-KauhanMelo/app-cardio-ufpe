import { Menu, Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import BottomNav from './BottomNav';

export default function Dashboard() {
  const navigate = useNavigate();

  const exercises = [
    { icon: '🚶', name: 'Caminhada leve', duration: '20 min', color: '#22C55E' },
    { icon: '🫁', name: 'Exercício respiratório', duration: '10 min', color: '#3B82F6' },
    { icon: '🧘', name: 'Alongamento', duration: '10 min', color: '#A855F7' },
  ];

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="h-full flex flex-col bg-[#F7F9FC]">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex justify-between items-center mb-6">
          <button className="p-2 -ml-2">
            <Menu size={24} className="text-[#1F2937]" />
          </button>
          <button className="p-2 -mr-2 relative">
            <Bell size={24} className="text-[#1F2937]" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></div>
          </button>
        </div>
        <h1 className="text-[24px] font-bold text-[#1F2937] mb-1">
          Olá, Gabriel 👋
        </h1>
        <p className="text-[14px] text-[#6B7280]">
          Como está sua recuperação hoje?
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-6">
        {/* Today's Exercises */}
        <div className="bg-white rounded-[24px] p-6 mb-4 shadow-sm">
          <h2 className="text-[16px] font-semibold text-[#1F2937] mb-4">
            Hoje você tem:
          </h2>
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <button
                key={index}
                onClick={() => navigate('/register')}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-[#F7F9FC] transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${exercise.color}20` }}
                >
                  {exercise.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[14px] font-medium text-[#1F2937]">
                    {exercise.name}
                  </p>
                  <p className="text-[12px] text-[#6B7280]">{exercise.duration}</p>
                </div>
                <ChevronRight size={20} className="text-[#6B7280]" />
              </button>
            ))}
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={() => navigate('/register')}
          className="w-full bg-[#3B82F6] text-white py-4 rounded-[18px] font-semibold text-[16px] mb-4 shadow-lg hover:bg-[#2563EB] transition-colors"
        >
          + Registrar Exercício
        </button>

        {/* Weekly Progress */}
        <div className="bg-white rounded-[24px] p-6 mb-4 shadow-sm">
          <h2 className="text-[16px] font-semibold text-[#1F2937] mb-4">
            Progresso semanal
          </h2>
          <div className="flex justify-between gap-2">
            {weekDays.map((day, index) => {
              const isCompleted = index < 4;
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full h-2 rounded-full transition-colors"
                    style={{
                      backgroundColor: isCompleted ? '#22C55E' : '#E5E7EB',
                    }}
                  ></div>
                  <span className="text-[12px] text-[#6B7280]">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Card */}
        <button
          onClick={() => navigate('/ai')}
          className="w-full bg-[#DCFCE7] rounded-[24px] p-6 shadow-sm hover:bg-[#BBF7D0] transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">🤖</div>
            <div className="flex-1 text-left">
              <h3 className="text-[14px] font-semibold text-[#1F2937] mb-1">
                Mensagem da IA
              </h3>
              <p className="text-[14px] text-[#1F2937]">
                Você está indo bem! Continue assim 🔥
              </p>
            </div>
            <ChevronRight size={20} className="text-[#1F2937]" />
          </div>
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
