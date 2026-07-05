import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import { useNavigate, useParams, Navigate } from 'react-router';
import { motion } from 'motion/react';
import { getExerciseCatalogItem } from '../../lib/exercise-catalog';

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

export default function ExerciseTimer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const exercise = id ? getExerciseCatalogItem(id) : undefined;
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  if (!exercise) {
    return <Navigate to="/exercises" replace />;
  }

  const handleFinish = () => {
    const minutes = Math.max(1, Math.round(seconds / 60));
    navigate('/register', { state: { type: exercise.name, minutes } });
  };

  return (
    <div className="h-full flex flex-col bg-app-bg">
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <h1 className="text-[26px] font-extrabold text-ink">{exercise.name}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-7xl mb-8">{exercise.icon}</div>
        <p className="text-[48px] font-mono font-bold text-ink mb-8 tabular-nums">
          {formatTime(seconds)}
        </p>

        {!running ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setRunning(true)}
            className="w-20 h-20 bg-brand-light text-white rounded-full flex items-center justify-center shadow-lg mb-6"
            aria-label="Iniciar"
          >
            <Play size={32} fill="white" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setRunning(false)}
            className="w-20 h-20 bg-warning text-white rounded-full flex items-center justify-center shadow-lg mb-6"
            aria-label="Pausar"
          >
            <Pause size={32} fill="white" />
          </motion.button>
        )}

        {seconds > 0 && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleFinish}
            className="w-full h-14 bg-success text-white rounded-2xl font-bold text-[17px] shadow-lg"
          >
            Finalizar exercício
          </motion.button>
        )}

        <p className="text-[13px] text-muted-ink text-center mt-6">
          O cronômetro funciona enquanto esta tela estiver aberta.
        </p>
      </div>
    </div>
  );
}
