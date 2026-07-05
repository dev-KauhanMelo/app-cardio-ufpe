import { motion } from 'motion/react';
import Mascot from './Mascot';

export default function Splash() {
  return (
    <div className="relative h-full flex flex-col items-center justify-center bg-app-bg px-6 overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: 'var(--gradient-blob)' }}
      />
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Mascot level={1} mood="happy" size={120} />
        <h1 className="text-[26px] font-extrabold text-ink mt-4">CardioCare AI</h1>
        <p className="text-[15px] text-muted-ink mt-1">Cuidando do seu coração todos os dias.</p>
      </motion.div>
    </div>
  );
}
