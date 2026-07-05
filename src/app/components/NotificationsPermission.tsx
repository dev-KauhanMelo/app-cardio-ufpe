import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { setNotificationsOptIn } from '../../lib/gamification';

export default function NotificationsPermission() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleChoice = async (optIn: boolean) => {
    if (!user) return;
    setSaving(true);
    try {
      if (optIn && 'Notification' in window) {
        try {
          await Notification.requestPermission();
        } catch {
          // navegador pode bloquear/ignorar; seguimos mesmo assim
        }
      }
      await setNotificationsOptIn(user.uid, optIn);
      navigate('/welcome');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-app-bg">
      <div className="min-h-full flex flex-col justify-center items-center text-center px-6 py-10">
      <div className="w-20 h-20 bg-info-soft rounded-full flex items-center justify-center mb-6">
        <Bell size={36} className="text-brand" />
      </div>
      <h1 className="text-[26px] font-extrabold text-ink mb-2">Vamos te conhecer melhor! 💙</h1>
      <p className="text-[15px] text-muted-ink mb-8 leading-relaxed">
        Deseja receber lembretes? Eles ajudam você a manter sua rotina em dia.
      </p>

      <motion.button
        whileTap={{ scale: 0.96 }}
        disabled={saving}
        onClick={() => handleChoice(true)}
        className="w-full h-14 bg-success text-white rounded-2xl font-bold text-[17px] shadow-lg mb-3 disabled:opacity-60"
      >
        Sim, quero lembretes
      </motion.button>
      <button
        disabled={saving}
        onClick={() => handleChoice(false)}
        className="text-[15px] text-muted-ink font-medium py-3 disabled:opacity-60"
      >
        Agora não
      </button>
      </div>
    </div>
  );
}
