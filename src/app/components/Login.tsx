import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../../lib/auth-context';
import Mascot from './Mascot';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch {
      setError('E-mail ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch {
      setError('Não foi possível enviar o e-mail. Confira o endereço digitado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full overflow-y-auto bg-app-bg">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: 'var(--gradient-blob)' }}
      />

      <div className="relative min-h-full flex flex-col justify-center px-6 py-10">
        <div className="mb-4">
          <Mascot level={1} mood="happy" size={100} />
        </div>

        {resetMode ? (
          <>
            <h1 className="text-[28px] font-extrabold text-ink mb-1">Recuperar senha</h1>
            <p className="text-[15px] text-muted-ink mb-8">
              Informe seu e-mail e enviaremos um link para redefinir a senha
            </p>

            {resetSent ? (
              <p className="text-[15px] text-success font-medium mb-6">
                E-mail enviado! Confira sua caixa de entrada.
              </p>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
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
                {error && <p className="text-[15px] text-danger">{error}</p>}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-brand-light text-white rounded-2xl font-bold text-[17px] shadow-lg hover:bg-brand transition-colors disabled:opacity-60"
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
                </motion.button>
              </form>
            )}

            <button
              onClick={() => {
                setResetMode(false);
                setResetSent(false);
                setError(null);
              }}
              className="text-[15px] text-brand font-semibold mt-6"
            >
              Voltar para o login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-[28px] font-extrabold text-ink mb-1">Bem-vindo de volta</h1>
            <p className="text-[15px] text-muted-ink mb-8">Entre para continuar sua recuperação</p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                {loading ? 'Entrando...' : 'Entrar'}
              </motion.button>
            </form>

            <button
              onClick={() => setResetMode(true)}
              className="text-[14px] text-muted-ink mt-4"
            >
              Esqueci minha senha
            </button>

            <p className="text-[15px] text-muted-ink text-center mt-6">
              Ainda não tem conta?{' '}
              <Link to="/signup" className="text-brand font-semibold">
                Criar conta
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
