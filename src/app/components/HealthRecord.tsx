import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from './BottomNav';

export default function HealthRecord() {
  const navigate = useNavigate();
  const [feeling, setFeeling] = useState<'bem' | 'normal' | 'cansado' | null>('normal');
  const [symptoms, setSymptoms] = useState({
    chestPain: false,
    breathlessness: true,
    dizziness: false,
    other: false,
  });
  const [notes, setNotes] = useState('Leve falta de ar durante o esforço.');
  const [showToast, setShowToast] = useState(false);

  const feelings = [
    { value: 'bem', emoji: '😄', label: 'Bem', color: '#22C55E' },
    { value: 'normal', emoji: '😐', label: 'Normal', color: '#FACC15' },
    { value: 'cansado', emoji: '😓', label: 'Cansado', color: '#EF4444' },
  ];

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#F7F9FC]">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={24} className="text-[#1F2937]" />
        </button>
        <h1 className="text-[24px] font-bold text-[#1F2937]">
          Registro de Saúde
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-6">
        {/* Feeling Question */}
        <div className="mb-6">
          <h2 className="text-[16px] font-semibold text-[#1F2937] mb-4">
            Como você se sentiu hoje?
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {feelings.map((option) => (
              <button
                key={option.value}
                onClick={() => setFeeling(option.value as any)}
                className="bg-white rounded-xl py-6 border-2 transition-all relative"
                style={{
                  borderColor: feeling === option.value ? option.color : '#E5E7EB',
                  backgroundColor: feeling === option.value ? `${option.color}15` : 'white',
                }}
              >
                <div className="text-4xl mb-2">{option.emoji}</div>
                <div className="text-[14px] font-medium text-[#1F2937]">
                  {option.label}
                </div>
                {feeling === option.value && (
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

        {/* Symptoms */}
        <div className="bg-white rounded-[24px] p-6 mb-6 shadow-sm">
          <h3 className="text-[14px] font-semibold text-[#1F2937] mb-4">
            Sintomas
          </h3>
          <div className="space-y-3">
            {[
              { key: 'chestPain', label: 'Dor no peito?' },
              { key: 'breathlessness', label: 'Falta de ar?' },
              { key: 'dizziness', label: 'Tontura?' },
              { key: 'other', label: 'Outros sintomas?' },
            ].map((symptom) => (
              <label
                key={symptom.key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={symptoms[symptom.key as keyof typeof symptoms]}
                    onChange={(e) =>
                      setSymptoms({ ...symptoms, [symptom.key]: e.target.checked })
                    }
                    className="appearance-none w-5 h-5 border-2 border-[#E5E7EB] rounded checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-colors"
                  />
                  {symptoms[symptom.key as keyof typeof symptoms] && (
                    <Check
                      size={14}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none"
                      strokeWidth={3}
                    />
                  )}
                </div>
                <span className="text-[14px] text-[#1F2937]">{symptom.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-[14px] font-semibold text-[#1F2937] mb-2">
            Observações
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#1F2937] resize-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-[#3B82F6] text-white py-4 rounded-[18px] font-semibold text-[16px] mb-4 shadow-lg hover:bg-[#2563EB] transition-colors"
        >
          Salvar Registro
        </button>

        {/* Info Card */}
        <div className="bg-[#DCFCE7] rounded-[24px] p-6 shadow-sm">
          <p className="text-[14px] text-[#1F2937] leading-relaxed">
            💚 Seu registro ajuda a personalizar seu tratamento!
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#22C55E] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
          >
            <span className="text-lg">❤️</span>
            <span className="text-[14px] font-semibold">Registro salvo!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
