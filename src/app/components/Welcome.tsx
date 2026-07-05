import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import Mascot from './Mascot';
import { useAuth } from '../../lib/auth-context';

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative h-full flex flex-col bg-app-bg px-6 justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: 'var(--gradient-blob)' }}
      />
      <div className="relative text-center">
        <div className="flex justify-center mb-6">
          <Mascot level={1} mood="happy" size={140} />
        </div>
        <h1 className="text-[28px] font-extrabold text-ink mb-2">
          Olá, {user?.displayName ?? 'tudo bem'}! Esse é o Corazão 💗
        </h1>
        <p className="text-[16px] text-muted-ink mb-8 leading-relaxed">
          Cada exercício e check-in dá XP e faz o Corazão crescer — no seu ritmo. 🌱
        </p>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/dashboard')}
          className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] shadow-lg hover:bg-brand transition-colors"
        >
          Vamos começar
        </motion.button>
      </div>
    </div>
  );
}
