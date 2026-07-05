import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Send, TrendingDown, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import BottomNav from './BottomNav';
import { useAuth } from '../../lib/auth-context';
import { getUserProfile, setDailyGoalMinutes, type UserProfile } from '../../lib/gamification';
import { getLatestHealthRecord, type HealthRecordEntry } from '../../lib/health-records';
import { getExercisesSince } from '../../lib/exercises';
import { getAssistantReply } from '../../lib/ai-assistant';

type Tab = 'insights' | 'chat';

type ChatMessage = { role: 'user' | 'assistant'; text: string };

function startOfLastWeek() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
}

export default function AI() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const suggestionRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>('insights');

  const [dailyGoal, setDailyGoal] = useState(20);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('20');
  const [savingGoal, setSavingGoal] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lastHealthRecord, setLastHealthRecord] = useState<HealthRecordEntry | null>(null);
  const [weeklyExerciseCount, setWeeklyExerciseCount] = useState(0);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Olá! Sou seu assistente. Pode me perguntar sobre exercícios, sintomas ou seu progresso.' },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((p) => {
      setProfile(p);
      setDailyGoal(p.dailyGoalMinutes);
      setGoalInput(String(p.dailyGoalMinutes));
    });
    getLatestHealthRecord(user.uid).then(setLastHealthRecord);
    getExercisesSince(user.uid, startOfLastWeek()).then((entries) =>
      setWeeklyExerciseCount(entries.length)
    );
  }, [user]);

  const handleSaveGoal = async () => {
    if (!user) return;
    const minutes = Number(goalInput) || 0;
    setSavingGoal(true);
    try {
      await setDailyGoalMinutes(user.uid, minutes);
      setDailyGoal(minutes);
      setEditingGoal(false);
    } finally {
      setSavingGoal(false);
    }
  };

  const scrollToSuggestion = () => {
    setTab('insights');
    suggestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !profile) return;
    const userMessage = input.trim();
    const reply = getAssistantReply(userMessage, {
      profile,
      lastHealthRecord,
      weeklyExerciseCount,
    });
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMessage },
      { role: 'assistant', text: reply },
    ]);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-app-bg">
      {/* Header */}
      <div className="pt-12 pb-4 px-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={26} className="text-ink" />
        </button>
        <h1 className="text-[26px] font-extrabold text-ink mb-1">
          Assistente Inteligente 🤖
        </h1>
        <p className="text-[15px] text-muted-ink mb-4">Baseado no seu uso…</p>

        <div className="flex gap-2 bg-surface rounded-2xl p-1">
          <button
            onClick={() => setTab('insights')}
            className={`flex-1 py-2 rounded-xl text-[14px] font-semibold transition-colors ${
              tab === 'insights' ? 'bg-brand-light text-white' : 'text-muted-ink'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setTab('chat')}
            className={`flex-1 py-2 rounded-xl text-[14px] font-semibold transition-colors ${
              tab === 'chat' ? 'bg-brand-light text-white' : 'text-muted-ink'
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {tab === 'insights' ? (
        <div className="flex-1 overflow-y-auto pb-24 px-6">
          {/* Card 1 - Usage Alert */}
          <div className="bg-info-soft rounded-3xl p-6 mb-4 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingDown size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-bold text-ink mb-2">
                  Você treinou menos esta semana.
                </h3>
                <p className="text-[15px] text-muted-ink mb-4">
                  Sua meta atual é <strong>{dailyGoal} minutos diários</strong>. Que tal ajustar?
                </p>

                {editingGoal ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={5}
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      className="w-20 h-12 bg-surface border border-border rounded-xl px-3 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
                    />
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      disabled={savingGoal}
                      onClick={handleSaveGoal}
                      className="bg-brand-light text-white px-4 py-3 rounded-2xl text-[15px] font-bold disabled:opacity-60"
                    >
                      {savingGoal ? 'Salvando...' : 'Salvar'}
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setEditingGoal(true)}
                    className="bg-brand-light text-white px-5 py-3 rounded-2xl text-[15px] font-bold hover:bg-brand transition-colors"
                  >
                    Ajustar Meta
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Card 2 - Health Alert */}
          <div className="bg-warning-soft rounded-3xl p-6 mb-4 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center flex-shrink-0">
                <Heart size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-bold text-ink mb-2">
                  Você relatou cansaço em vários dias.
                </h3>
                <p className="text-[15px] text-muted-ink mb-4">
                  Considere reduzir a intensidade dos exercícios.
                </p>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={scrollToSuggestion}
                  className="bg-warning text-white px-5 py-3 rounded-2xl text-[15px] font-bold hover:opacity-90 transition-opacity"
                >
                  Ver Recomendações
                </motion.button>
              </div>
            </div>
          </div>

          {/* Card 3 - Motivation */}
          <div className="bg-success-soft rounded-3xl p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💪</div>
              <div className="flex-1">
                <h3 className="text-[17px] font-bold text-ink mb-2">
                  Pequenos passos ainda são progresso!
                </h3>
                <p className="text-[15px] text-muted-ink">
                  Continue assim, você está cuidando do seu coração.
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Suggestion */}
          <div ref={suggestionRef}>
            <h2 className="text-[17px] font-bold text-ink mb-3">
              Sugestão da semana
            </h2>
            <div className="bg-surface rounded-3xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-success-soft rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  🚶
                </div>
                <div className="flex-1">
                  <h3 className="text-[17px] font-bold text-ink mb-2">
                    Caminhada leve
                  </h3>
                  <div className="space-y-1">
                    <p className="text-[15px] text-muted-ink">
                      <span className="font-medium text-ink">15 min</span> por dia
                    </p>
                    <p className="text-[15px] text-muted-ink">
                      <span className="font-medium text-ink">5x</span> na semana
                    </p>
                  </div>
                </div>
                <Zap size={24} className="text-warning" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-6 pb-24 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] ${
                    msg.role === 'user'
                      ? 'bg-brand-light text-white'
                      : 'bg-surface text-ink shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 h-14 bg-surface border border-border rounded-2xl px-4 text-[16px] text-ink focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="submit"
              className="w-14 h-14 bg-brand-light text-white rounded-2xl flex items-center justify-center flex-shrink-0"
              aria-label="Enviar"
            >
              <Send size={22} />
            </motion.button>
          </form>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
