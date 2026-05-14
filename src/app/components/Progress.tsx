import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import BottomNav from './BottomNav';

export default function Progress() {
  const navigate = useNavigate();

  const data = [
    { day: 'Seg', value: 2 },
    { day: 'Ter', value: 4 },
    { day: 'Qua', value: 1 },
    { day: 'Qui', value: 5 },
    { day: 'Sex', value: 4 },
    { day: 'Sáb', value: 0 },
    { day: 'Dom', value: 0 },
  ];

  return (
    <div className="h-full flex flex-col bg-[#F7F9FC]">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={24} className="text-[#1F2937]" />
        </button>
        <h1 className="text-[24px] font-bold text-[#1F2937] mb-4">
          Seu Progresso
        </h1>
        <select className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]">
          <option>Esta semana</option>
          <option>Este mês</option>
          <option>Este ano</option>
        </select>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-6">
        {/* Chart */}
        <div className="bg-white rounded-[24px] p-6 mb-4 shadow-sm">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value > 0 ? '#3B82F6' : '#E5E7EB'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Achievement Card */}
        <div className="bg-[#FEF9C3] rounded-[24px] p-6 mb-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#FACC15] rounded-full flex items-center justify-center">
              <Trophy size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#1F2937] mb-2">
                Você fez 4 de 5 exercícios esta semana! 🎉
              </p>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#22C55E] rounded-full"
                  style={{ width: '80%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Evolution Card */}
        <div className="bg-white rounded-[24px] p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[32px] font-bold text-[#22C55E] mb-1">+15%</div>
              <p className="text-[14px] text-[#6B7280]">melhor que semana passada</p>
            </div>
            <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center">
              <TrendingUp size={28} className="text-[#22C55E]" />
            </div>
          </div>
        </div>

        {/* Motivation Card */}
        <div className="bg-[#F3F4F6] rounded-[24px] p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔥</div>
            <div>
              <h3 className="text-[14px] font-semibold text-[#1F2937] mb-1">
                Frequência: Boa
              </h3>
              <p className="text-[12px] text-[#6B7280]">
                Continue mantendo sua constância!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
