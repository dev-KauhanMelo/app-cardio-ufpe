import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

export default function RegisterExercise() {
  const navigate = useNavigate();
  const [exerciseType, setExerciseType] = useState('Caminhada');
  const [duration, setDuration] = useState('20');
  const [intensity, setIntensity] = useState<'leve' | 'médio' | 'intenso'>('leve');
  const [showSuccess, setShowSuccess] = useState(false);

  const intensityOptions = [
    { value: 'leve', label: 'Leve', emoji: '😊', color: '#22C55E', bg: '#DCFCE7' },
    { value: 'médio', label: 'Médio', emoji: '😐', color: '#FACC15', bg: '#FEF9C3' },
    { value: 'intenso', label: 'Intenso', emoji: '❤️', color: '#EF4444', bg: '#FEE2E2' },
  ];

  const recommendedExercises = [
    { icon: '🚶', name: 'Caminhada leve' },
    { icon: '🫁', name: 'Exercício respiratório' },
    { icon: '🧘', name: 'Alongamento' },
  ];

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#F7F9FC]">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={24} className="text-[#1F2937]" />
        </button>
        <h1 className="text-[24px] font-bold text-[#1F2937]">
          Registrar Exercício
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-6 px-6">
        {/* Exercise Type */}
        <div className="mb-6">
          <label className="block text-[14px] font-medium text-[#1F2937] mb-2">
            Tipo de Exercício
          </label>
          <select
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[16px] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option>Caminhada</option>
            <option>Bicicleta</option>
            <option>Alongamento</option>
            <option>Exercício respiratório</option>
          </select>
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="block text-[14px] font-medium text-[#1F2937] mb-2">
            Duração (minutos)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[16px] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>

        {/* Intensity */}
        <div className="mb-6">
          <label className="block text-[14px] font-medium text-[#1F2937] mb-2">
            Intensidade
          </label>
          <div className="grid grid-cols-3 gap-3">
            {intensityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setIntensity(option.value as any)}
                className="relative bg-white border-2 rounded-xl py-6 transition-all"
                style={{
                  borderColor: intensity === option.value ? option.color : '#E5E7EB',
                  backgroundColor: intensity === option.value ? option.bg : 'white',
                }}
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className="text-[14px] font-medium text-[#1F2937]">
                  {option.label}
                </div>
                {intensity === option.value && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: option.color }}
                  >
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Educational Card */}
        <div className="bg-[#DBEAFE] rounded-xl p-4 mb-6">
          <p className="text-[12px] text-[#1F2937] leading-relaxed">
            <strong>Escala de esforço percebido:</strong> Escolha como você se sentiu durante o exercício.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-[#3B82F6] text-white py-4 rounded-[18px] font-semibold text-[16px] mb-6 shadow-lg hover:bg-[#2563EB] transition-colors"
        >
          Salvar Exercício
        </button>

        {/* Recommended Exercises */}
        <div>
          <h3 className="text-[14px] font-semibold text-[#1F2937] mb-3">
            Exercícios recomendados
          </h3>
          <div className="bg-white rounded-xl p-4 space-y-2">
            {recommendedExercises.map((exercise, index) => (
              <div key={index} className="flex items-center gap-3 py-1">
                <span className="text-xl">{exercise.icon}</span>
                <span className="text-[14px] text-[#1F2937]">{exercise.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#22C55E] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <Check size={24} strokeWidth={3} />
            <span className="text-[16px] font-semibold">Exercício salvo!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
