import { ArrowLeft, TrendingDown, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import BottomNav from './BottomNav';

export default function AI() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-[#F7F9FC]">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 mb-4">
          <ArrowLeft size={24} className="text-[#1F2937]" />
        </button>
        <h1 className="text-[24px] font-bold text-[#1F2937] mb-1">
          Assistente Inteligente 🤖
        </h1>
        <p className="text-[14px] text-[#6B7280]">Baseado no seu uso…</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-6">
        {/* Card 1 - Usage Alert */}
        <div className="bg-[#DBEAFE] rounded-[24px] p-6 mb-4 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingDown size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-[#1F2937] mb-2">
                Você treinou menos esta semana.
              </h3>
              <p className="text-[14px] text-[#6B7280] mb-4">
                Que tal reduzir sua meta para 15 minutos diários?
              </p>
              <button className="bg-[#3B82F6] text-white px-5 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-[#2563EB] transition-colors">
                Ajustar Meta
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 - Health Alert */}
        <div className="bg-[#FEF9C3] rounded-[24px] p-6 mb-4 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-[#FACC15] rounded-full flex items-center justify-center flex-shrink-0">
              <Heart size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-[#1F2937] mb-2">
                Você relatou cansaço em vários dias.
              </h3>
              <p className="text-[14px] text-[#6B7280] mb-4">
                Considere reduzir a intensidade dos exercícios.
              </p>
              <button className="bg-[#FACC15] text-white px-5 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-[#EAB308] transition-colors">
                Ver Recomendações
              </button>
            </div>
          </div>
        </div>

        {/* Card 3 - Motivation */}
        <div className="bg-[#DCFCE7] rounded-[24px] p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💪</div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-[#1F2937] mb-2">
                Pequenos passos ainda são progresso!
              </h3>
              <p className="text-[14px] text-[#6B7280]">
                Continue assim, você está cuidando do seu coração.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Suggestion */}
        <div>
          <h2 className="text-[16px] font-semibold text-[#1F2937] mb-3">
            Sugestão da semana
          </h2>
          <div className="bg-white rounded-[24px] p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#DCFCE7] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                🚶
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-semibold text-[#1F2937] mb-2">
                  Caminhada leve
                </h3>
                <div className="space-y-1">
                  <p className="text-[14px] text-[#6B7280]">
                    <span className="font-medium text-[#1F2937]">15 min</span> por dia
                  </p>
                  <p className="text-[14px] text-[#6B7280]">
                    <span className="font-medium text-[#1F2937]">5x</span> na semana
                  </p>
                </div>
              </div>
              <Zap size={24} className="text-[#FACC15]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
