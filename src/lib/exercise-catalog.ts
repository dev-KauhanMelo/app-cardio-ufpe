export type ExerciseCatalogItem = {
  id: string;
  name: string;
  icon: string;
  color: string;
  recommendedMinutes: [number, number];
  recommendedIntensity: string;
  benefits: string;
  instructions: string[];
};

export const EXERCISE_CATALOG: ExerciseCatalogItem[] = [
  {
    id: 'caminhada',
    name: 'Caminhada',
    icon: '🚶',
    color: 'var(--color-walk)',
    recommendedMinutes: [20, 30],
    recommendedIntensity: 'Leve',
    benefits: 'Melhora da circulação, condicionamento físico e saúde do coração.',
    instructions: [
      'Caminhe em ritmo confortável, sem pressa.',
      'Respire pelo nariz e solte pela boca.',
      'Sentiu falta de ar ou tontura? Pare e descanse.',
    ],
  },
  {
    id: 'bicicleta',
    name: 'Bicicleta',
    icon: '🚴',
    color: 'var(--color-walk)',
    recommendedMinutes: [15, 25],
    recommendedIntensity: 'Leve a médio',
    benefits: 'Fortalece pernas e sistema cardiovascular com baixo impacto nas articulações.',
    instructions: [
      'Pedale em ritmo constante, sem forçar.',
      'Mantenha as costas retas e os ombros relaxados.',
      'Se sentir dor no peito ou tontura, pare imediatamente.',
    ],
  },
  {
    id: 'alongamento',
    name: 'Alongamento',
    icon: '🧘',
    color: 'var(--color-stretch)',
    recommendedMinutes: [10, 15],
    recommendedIntensity: 'Leve',
    benefits: 'Melhora flexibilidade, reduz tensão muscular e ajuda na recuperação.',
    instructions: [
      'Alongue devagar, sem forçar além do confortável.',
      'Mantenha cada posição por alguns segundos, respirando com calma.',
      'Não sinta dor — só uma leve tensão é o esperado.',
    ],
  },
  {
    id: 'respiratorio',
    name: 'Exercício respiratório',
    icon: '🫁',
    color: 'var(--color-breath)',
    recommendedMinutes: [5, 10],
    recommendedIntensity: 'Leve',
    benefits: 'Fortalece a musculatura respiratória e ajuda no controle da falta de ar.',
    instructions: [
      'Sente-se confortavelmente, com as costas apoiadas.',
      'Inspire devagar pelo nariz, contando até 4.',
      'Solte o ar pela boca lentamente, contando até 6.',
    ],
  },
];

export function getExerciseCatalogItem(id: string): ExerciseCatalogItem | undefined {
  return EXERCISE_CATALOG.find((item) => item.id === id);
}
