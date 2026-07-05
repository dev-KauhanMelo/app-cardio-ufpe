import { useEffect, useState } from 'react';
import { ArrowLeft, Check, TriangleAlert } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from './BottomNav';
import Mascot from './Mascot';
import { useAuth } from '../../lib/auth-context';
import { addHealthRecord } from '../../lib/health-records';
import { completeChallenge, getUserProfile, type MascotMood } from '../../lib/gamification';

type Feeling = 'bem' | 'normal' | 'cansado';

type FromExerciseState = { fromExercise?: { type: string; duration: number } } | null;

const FEELING_MOOD: Record<Feeling, MascotMood> = {
  bem: 'happy',
  normal: 'neutral',
  cansado: 'sleepy',
};

export default function HealthRecord() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromExercise = (location.state as FromExerciseState)?.fromExercise ?? null;
  const { user } = useAuth();
  const [level, setLevel] = useState(1);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [symptoms, setSymptoms] = useState({
    chestPain: false,
    breathlessness: false,
    dizziness: false,
    other: false,
  });
  const [notes, setNotes] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((profile) => setLevel(profile.level));
  }, [user]);

  const feelings: { value: Feeling; emoji: string; label: string; color: string }[] = [
    { value: 'bem', emoji: '😄', label: 'Bem', color: '#22C55E' },
    { value: 'normal', emoji: '😐', label: 'Normal', color: '#FACC15' },
    { value: 'cansado', emoji: '😓', label: 'Cansado', color: '#EF4444' },
  ];

  const handleSave = async () => {
    if (!user || !feeling) return;
    setError(null);
    setSaving(true);
    try {
      await addHealthRecord(user.uid, { feeling, symptoms, notes });
      const result = await completeChallenge(user.uid, 'checkin');
      setXpAwarded(result.xpAwarded);

      if (fromExercise) {
        navigate('/dashboard');
      } else {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch {
      setError('Não foi possível salvar o registro. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <h1 className="text-[26px] font-extrabold text-ink">
          Registro de Saúde
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-6">
        {/* Feeling Question */}
        <div className="mb-6">
          <div className="flex justify-center mb-3">
            <Mascot level={level} mood={feeling ? FEELING_MOOD[feeling] : 'neutral'} size={80} />
          </div>
          <h2 className="text-[18px] font-bold text-ink mb-4 text-center">
            {fromExercise
              ? `Como você se sentiu na ${fromExercise.type} de ${fromExercise.duration} min?`
              : 'Como você se sentiu hoje?'}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {feelings.map((option) => (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.9 }}
                animate={feeling === option.value ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setFeeling(option.value)}
                className="bg-surface rounded-2xl py-6 border-2 transition-colors relative"
                style={{
                  borderColor: feeling === option.value ? option.color : 'var(--color-border)',
                  backgroundColor: feeling === option.value ? `${option.color}15` : 'var(--color-surface)',
                }}
              >
                <div className="text-6xl mb-2">{option.emoji}</div>
                <div className="text-[15px] font-medium text-ink">
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
              </motion.button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-surface rounded-3xl p-6 mb-6 shadow-sm">
          <h3 className="text-[15px] font-bold text-ink mb-4">
            Sintomas
          </h3>
          <div className="space-y-3">
            {[
              { key: 'chestPain', label: 'Dor no peito?', cardiac: true },
              { key: 'breathlessness', label: 'Falta de ar?', cardiac: true },
              { key: 'dizziness', label: 'Tontura?', cardiac: true },
              { key: 'other', label: 'Outros sintomas?', cardiac: false },
            ].map((symptom) => {
              const checked = symptoms[symptom.key as keyof typeof symptoms];
              const alert = symptom.cardiac && checked;
              return (
                <label
                  key={symptom.key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setSymptoms({ ...symptoms, [symptom.key]: e.target.checked })
                      }
                      className={`appearance-none w-6 h-6 border-2 rounded transition-colors ${
                        alert
                          ? 'bg-danger border-danger'
                          : 'border-border checked:bg-brand-light checked:border-brand-light'
                      }`}
                    />
                    {checked && (
                      <Check
                        size={16}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <span className={`text-[15px] ${alert ? 'font-semibold text-danger' : 'text-ink'}`}>
                    {symptom.label}
                  </span>
                </label>
              );
            })}
          </div>

          {(symptoms.chestPain || symptoms.breathlessness || symptoms.dizziness) && (
            <div className="mt-4 bg-danger-soft rounded-2xl p-4 flex items-start gap-3">
              <TriangleAlert size={20} className="text-danger flex-shrink-0 mt-0.5" />
              <p className="text-[14px] text-ink leading-relaxed">
                <strong>Vale atenção:</strong> sintomas assim merecem contato com seu médico ainda hoje.
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-[15px] font-semibold text-ink mb-2">
            Observações
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-[15px] text-ink resize-none focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
        </div>

        {error && <p className="text-[15px] text-danger mb-4">{error}</p>}

        {/* Save Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          disabled={saving || !feeling}
          className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] mb-4 shadow-lg hover:bg-brand transition-colors disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar Registro'}
        </motion.button>

        {/* Info Card */}
        <div className="bg-success-soft rounded-3xl p-6 shadow-sm">
          <p className="text-[15px] text-ink leading-relaxed">
            💚 Seu registro ajuda a personalizar seu tratamento!
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Toast (só quando é um check-in avulso, fora do fluxo guiado) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-success text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
          >
            <span className="text-lg">❤️</span>
            <span className="text-[15px] font-semibold">
              Registro salvo!{xpAwarded > 0 ? ` +${xpAwarded} XP` : ''}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
