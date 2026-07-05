import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import BottomNav from './BottomNav';
import { useAuth } from '../../lib/auth-context';
import { getAllExercises, type Exercise } from '../../lib/exercises';

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const MONTH_ABBR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

type Period = 'semana' | 'mes' | 'ano';
type ChartPoint = { day: string; value: number };

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getWeekChartData(exercises: Exercise[], weekStart: Date): ChartPoint[] {
  const counts = Array(7).fill(0);
  exercises.forEach((exercise) => {
    if (exercise.createdAt >= weekStart) {
      const dayIndex = (exercise.createdAt.getDay() + 6) % 7;
      counts[dayIndex] += 1;
    }
  });
  return WEEK_DAYS.map((day, index) => ({ day, value: counts[index] }));
}

function getMonthChartData(exercises: Exercise[], now: Date): ChartPoint[] {
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeksCount = Math.ceil(daysInMonth / 7);
  const counts = Array(weeksCount).fill(0);
  exercises.forEach((exercise) => {
    if (exercise.createdAt.getFullYear() === year && exercise.createdAt.getMonth() === month) {
      const weekIndex = Math.floor((exercise.createdAt.getDate() - 1) / 7);
      counts[weekIndex] += 1;
    }
  });
  return counts.map((value, index) => ({ day: `Sem ${index + 1}`, value }));
}

function getYearChartData(exercises: Exercise[], now: Date): ChartPoint[] {
  const year = now.getFullYear();
  const counts = Array(12).fill(0);
  exercises.forEach((exercise) => {
    if (exercise.createdAt.getFullYear() === year) {
      counts[exercise.createdAt.getMonth()] += 1;
    }
  });
  return MONTH_ABBR.map((label, index) => ({ day: label, value: counts[index] }));
}

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [period, setPeriod] = useState<Period>('semana');

  useEffect(() => {
    if (!user) return;
    getAllExercises(user.uid).then(setExercises);
  }, [user]);

  const now = useMemo(() => new Date(), []);
  const weekStart = useMemo(() => startOfWeek(now), [now]);
  const previousWeekStart = useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    return d;
  }, [weekStart]);

  const weekData = useMemo(() => getWeekChartData(exercises, weekStart), [exercises, weekStart]);
  const weekTotal = weekData.reduce((sum, d) => sum + d.value, 0);
  const daysWithExercise = weekData.filter((d) => d.value > 0).length;

  const previousWeekTotal = useMemo(
    () =>
      exercises.filter((e) => e.createdAt >= previousWeekStart && e.createdAt < weekStart).length,
    [exercises, previousWeekStart, weekStart]
  );

  const evolutionPercent =
    previousWeekTotal > 0 ? Math.round(((weekTotal - previousWeekTotal) / previousWeekTotal) * 100) : null;

  const data =
    period === 'semana'
      ? weekData
      : period === 'mes'
        ? getMonthChartData(exercises, now)
        : getYearChartData(exercises, now);

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
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
        >
          <option value="semana">Esta semana</option>
          <option value="mes">Este mês</option>
          <option value="ano">Este ano</option>
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
