import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../../lib/auth-context';
import Mascot from './Mascot';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(name, email, password);
      navigate('/create-profile');
    } catch {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-app-bg px-6 justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: 'var(--gradient-blob)' }}
      />
      <div className="relative">
        <div className="mb-4">
          <Mascot level={1} mood="neutral" size={100} />
        </div>
        <h1 className="text-[28px] font-extrabold text-ink mb-1">Criar conta</h1>
        <p className="text-[15px] text-muted-ink mb-8">Vamos começar sua jornada de recuperação</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[15px] font-medium text-ink mb-2">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
          </div>
          <div>
            <label className="block text-[15px] font-medium text-ink mb-2">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
          </div>
          <div>
            <label className="block text-[15px] font-medium text-ink mb-2">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-surface border border-border rounded-2xl px-4 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
          </div>

          {error && <p className="text-[15px] text-danger">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] shadow-lg hover:bg-brand transition-colors disabled:opacity-60"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </motion.button>
        </form>

        <p className="text-[15px] text-muted-ink text-center mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-brand font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
