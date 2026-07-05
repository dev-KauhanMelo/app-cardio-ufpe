import type { HealthRecordEntry } from './health-records';
import type { UserProfile } from './gamification';

export type AssistantContext = {
  profile: UserProfile;
  lastHealthRecord: HealthRecordEntry | null;
  weeklyExerciseCount: number;
};

const ACCENT_MAP: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o',
  ú: 'u', ù: 'u', û: 'u', ü: 'u',
  ç: 'c',
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .split('')
    .map((char) => ACCENT_MAP[char] ?? char)
    .join('');
}

export function getAssistantReply(message: string, context: AssistantContext): string {
  const text = normalize(message);
  const { lastHealthRecord, weeklyExerciseCount, profile } = context;

  const hasSymptomFlag =
    lastHealthRecord?.symptoms.chestPain ||
    lastHealthRecord?.symptoms.dizziness ||
    lastHealthRecord?.symptoms.breathlessness;

  if (text.includes('cansad') || text.includes('cansaco') || text.includes('exaust')) {
    return 'Sinto muito que você esteja se sentindo assim. Recomendo reduzir a intensidade dos exercícios hoje e, se o cansaço persistir por mais de um dia, procure orientação médica.';
  }

  if (text.includes('dor no peito') || text.includes('dor no coracao')) {
    return '⚠️ Dor no peito é um sintoma sério. Interrompa qualquer atividade física agora e procure atendimento médico imediatamente.';
  }

  if (
    text.includes('posso') &&
    (text.includes('caminh') || text.includes('exercicio') || text.includes('treinar'))
  ) {
    if (lastHealthRecord?.feeling === 'cansado' || hasSymptomFlag) {
      return 'De acordo com seu último check-in, você relatou cansaço ou algum sintoma. Recomendo um exercício bem leve hoje, como alongamento ou respiração, e reavaliar amanhã.';
    }
    return 'De acordo com seus registros, sim! Mantenha a intensidade leve e ouça seu corpo durante o exercício.';
  }

  if (text.includes('falta de ar') || text.includes('respirar')) {
    return 'Recomendo interromper os exercícios e procurar orientação médica caso a falta de ar persista ou piore.';
  }

  if (text.includes('quantos') && text.includes('exercicio')) {
    return `Você registrou ${weeklyExerciseCount} exercício${weeklyExerciseCount === 1 ? '' : 's'} nos últimos 7 dias. ${
      weeklyExerciseCount >= 5 ? 'Excelente ritmo!' : 'Que tal tentar se exercitar mais um dia esta semana?'
    }`;
  }

  if (text.includes('nivel') || text.includes('xp') || text.includes('streak') || text.includes('sequencia')) {
    return `Você está no nível ${profile.level}, com ${profile.streak} dia${profile.streak === 1 ? '' : 's'} seguidos de atividade. Continue assim!`;
  }

  return 'Estou aqui para ajudar na sua recuperação! Pode me perguntar sobre exercícios, sintomas ou seu progresso.';
}
