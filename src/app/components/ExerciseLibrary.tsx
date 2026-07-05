import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { EXERCISE_CATALOG } from '../../lib/exercise-catalog';

export default function ExerciseLibrary() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <h1 className="text-[26px] font-extrabold text-ink">Biblioteca de Exercícios</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-6 space-y-3">
        {EXERCISE_CATALOG.map((exercise) => (
          <motion.button
            key={exercise.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/exercises/${exercise.id}`)}
            className="w-full bg-surface rounded-2xl p-4 shadow-sm flex items-center gap-4"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: `color-mix(in srgb, ${exercise.color} 20%, transparent)` }}
            >
              {exercise.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="text-[16px] font-semibold text-ink">{exercise.name}</p>
              <p className="text-[13px] text-muted-ink">
                {exercise.recommendedMinutes[0]}-{exercise.recommendedMinutes[1]} min
              </p>
            </div>
            <ChevronRight size={20} className="text-muted-ink" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
