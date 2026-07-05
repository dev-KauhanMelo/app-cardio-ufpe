import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../../lib/auth-context';
import { updateProfileDetails, type Sex } from '../../lib/gamification';

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'F', label: 'Feminino' },
  { value: 'M', label: 'Masculino' },
  { value: 'outro', label: 'Outro' },
];

export default function CreateProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState<Sex | null>(null);
  const [weight, setWeight] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !sex) return;
    setSaving(true);
    try {
      await updateProfileDetails(user.uid, {
        birthDate,
        sex,
        weightKg: Number(weight) || 0,
      });
      navigate('/notifications-permission');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-app-bg">
      <div className="min-h-full flex flex-col justify-center px-6 py-10">
      <h1 className="text-[26px] font-extrabold text-ink mb-1">Criar Perfil</h1>
      <p className="text-[15px] text-muted-ink mb-8">
        Essas informações ajudam a personalizar suas recomendações
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[15px] font-medium text-ink mb-2">Nome completo</label>
          <input
            type="text"
            value={user?.displayName ?? ''}
            disabled
            className="w-full h-14 bg-app-bg border border-border rounded-2xl px-4 text-[16px] text-muted-ink"
          />
        </div>

        <div>
          <label className="block text-[15px] font-medium text-ink mb-2">Data de nascimento</label>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
        </div>

        <div>
          <label className="block text-[15px] font-medium text-ink mb-2">Sexo</label>
          <div className="grid grid-cols-3 gap-3">
            {SEX_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setSex(option.value)}
                className={`h-14 rounded-2xl border-2 text-[14px] font-medium transition-colors ${
                  sex === option.value
                    ? 'border-brand-light bg-info-soft text-ink'
                    : 'border-border bg-surface text-muted-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[15px] font-medium text-ink mb-2">Peso (kg)</label>
          <input
            type="number"
            required
            min={20}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={saving || !sex}
          className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] shadow-lg hover:bg-brand transition-colors disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Próximo'}
        </motion.button>
      </form>
      </div>
    </div>
  );
}
