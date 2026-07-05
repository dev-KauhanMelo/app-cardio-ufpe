import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { getExerciseCatalogItem } from '../../lib/exercise-catalog';

export default function ExerciseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const exercise = id ? getExerciseCatalogItem(id) : undefined;

  if (!exercise) {
    return <Navigate to="/exercises" replace />;
  }

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/exercises')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <div className="flex items-center gap-4 mb-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: `color-mix(in srgb, ${exercise.color} 20%, transparent)` }}
          >
            {exercise.icon}
          </div>
          <h1 className="text-[26px] font-extrabold text-ink">{exercise.name}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 px-6">
        <div className="bg-surface rounded-3xl p-6 mb-4 shadow-sm space-y-3">
          <div>
            <p className="text-[13px] text-muted-ink">Tempo recomendado</p>
            <p className="text-[16px] font-semibold text-ink">
              {exercise.recommendedMinutes[0]}-{exercise.recommendedMinutes[1]} min
            </p>
          </div>
          <div>
            <p className="text-[13px] text-muted-ink">Intensidade recomendada</p>
            <p className="text-[16px] font-semibold text-ink">{exercise.recommendedIntensity}</p>
          </div>
        </div>

        <div className="bg-info-soft rounded-3xl p-6 mb-6 shadow-sm">
          <p className="text-[14px] font-semibold text-ink mb-1">Benefícios</p>
          <p className="text-[15px] text-ink leading-relaxed">{exercise.benefits}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(`/exercises/${exercise.id}/timer`)}
          className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] shadow-lg hover:bg-brand transition-colors"
        >
          Iniciar
        </motion.button>
        <p className="text-[13px] text-muted-ink text-center mt-3">
          Siga o ritmo e bons treinos!
        </p>
      </div>
    </div>
  );
}
