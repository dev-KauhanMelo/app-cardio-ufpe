import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { getAllExercises, type Exercise } from '../../lib/exercises';

const WEEKDAY_LABELS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    if (!user) return;
    getAllExercises(user.uid).then(setExercises);
  }, [user]);

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = Monday

  const daysWithExercise = useMemo(() => {
    const set = new Set<number>();
    exercises?.forEach((exercise) => {
      if (monthKey(exercise.createdAt) === monthKey(monthCursor)) {
        set.add(exercise.createdAt.getDate());
      }
    });
    return set;
  }, [exercises, monthCursor]);

  const monthCount = useMemo(
    () => exercises?.filter((e) => monthKey(e.createdAt) === monthKey(monthCursor)).length ?? 0,
    [exercises, monthCursor]
  );

  const activeDaysPercent = Math.round((daysWithExercise.size / daysInMonth) * 100);

  const changeMonth = (delta: number) => {
    setMonthCursor(new Date(year, month + delta, 1));
  };

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <h1 className="text-[26px] font-extrabold text-ink">Histórico de exercícios</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-6">
        {exercises === null && <p className="text-[15px] text-muted-ink">Carregando...</p>}

        {exercises && (
          <>
            <div className="bg-surface rounded-3xl p-6 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2" aria-label="Mês anterior">
                  <ChevronLeft size={22} className="text-ink" />
                </button>
                <p className="text-[16px] font-bold text-ink">
                  {MONTH_LABELS[month]} {year}
                </p>
                <button onClick={() => changeMonth(1)} className="p-2" aria-label="Próximo mês">
                  <ChevronRight size={22} className="text-ink" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAY_LABELS.map((label, index) => (
                  <div key={index} className="text-center text-[12px] text-muted-ink font-medium">
                    {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[13px] ${
                      day === null
                        ? ''
                        : daysWithExercise.has(day)
                          ? 'bg-success text-white font-semibold'
                          : 'bg-app-bg text-muted-ink'
                    }`}
                  >
                    {day ?? ''}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-success-soft rounded-3xl p-6 shadow-sm">
              <p className="text-[15px] font-semibold text-ink mb-1">Resumo do mês</p>
              <p className="text-[14px] text-ink">
                {monthCount} exercício{monthCount === 1 ? '' : 's'} registrado
                {monthCount === 1 ? '' : 's'}
              </p>
              <p className="text-[14px] text-ink">{activeDaysPercent}% dos dias com atividade</p>
            </div>

            {exercises.length === 0 && (
              <div className="bg-surface rounded-3xl p-6 shadow-sm text-center mt-4">
                <p className="text-[15px] text-muted-ink">
                  Você ainda não registrou nenhum exercício. Que tal começar hoje?
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
