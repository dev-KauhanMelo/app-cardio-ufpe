import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import BottomNav from './BottomNav';
import { useAuth } from '../../lib/auth-context';
import { getExercisesSince } from '../../lib/exercises';

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(WEEK_DAYS.map((day) => ({ day, value: 0 })));
  const [previousWeekTotal, setPreviousWeekTotal] = useState<number | null>(null);
  const daysWithExercise = data.filter((d) => d.value > 0).length;
  const weekTotal = data.reduce((sum, d) => sum + d.value, 0);
  const evolutionPercent =
    previousWeekTotal && previousWeekTotal > 0
      ? Math.round(((weekTotal - previousWeekTotal) / previousWeekTotal) * 100)
      : null;

  useEffect(() => {
    if (!user) return;
    const weekStart = startOfWeek(new Date());
    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    getExercisesSince(user.uid, weekStart).then((entries) => {
      const counts = Array(7).fill(0);
      entries.forEach((entry) => {
        const dayIndex = (entry.createdAt.getDay() + 6) % 7;
        counts[dayIndex] += 1;
      });
      setData(WEEK_DAYS.map((day, index) => ({ day, value: counts[index] })));
    });

    getExercisesSince(user.uid, previousWeekStart).then((entries) => {
      const lastWeekEntries = entries.filter((entry) => entry.createdAt < weekStart);
      setPreviousWeekTotal(lastWeekEntries.length);
    });
  }, [user]);

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <h1 className="text-[26px] font-extrabold text-ink mb-4">
          Seu Progresso
        </h1>
        <select className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light">
          <option>Esta semana</option>
          <option>Este mês</option>
          <option>Este ano</option>
        </select>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-6">
        {/* Chart */}
        <div className="bg-surface rounded-3xl p-6 mb-4 shadow-sm">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 13 }}
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
        <div className="bg-warning-soft rounded-3xl p-6 mb-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-ink mb-2">
                Você fez exercícios em {daysWithExercise} de 7 dias esta semana! 🎉
              </p>
              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full"
                  style={{ width: `${Math.round((daysWithExercise / 7) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Evolution Card */}
        <div className="bg-surface rounded-3xl p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div
                className="text-[32px] font-bold mb-1"
                style={{ color: (evolutionPercent ?? 0) >= 0 ? '#22C55E' : '#EF4444' }}
              >
                {evolutionPercent === null
                  ? '—'
                  : `${evolutionPercent >= 0 ? '+' : ''}${evolutionPercent}%`}
              </div>
              <p className="text-[15px] text-muted-ink">
                {evolutionPercent === null
                  ? 'sem dados da semana passada'
                  : evolutionPercent >= 0
                    ? 'melhor que semana passada'
                    : 'menos que semana passada'}
              </p>
            </div>
            <div className="w-16 h-16 bg-success-soft rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp size={28} className="text-success" />
            </div>
          </div>
        </div>

        {/* Motivation Card */}
        <div className="bg-surface rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔥</div>
            <div>
              <h3 className="text-[15px] font-semibold text-ink mb-1">
                Frequência: Boa
              </h3>
              <p className="text-[13px] text-muted-ink">
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
