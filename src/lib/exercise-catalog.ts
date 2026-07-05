export type ExerciseCatalogItem = {
  id: string;
  name: string;
  icon: string;
  color: string;
  recommendedMinutes: [number, number];
  recommendedIntensity: string;
  benefits: string;
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
  },
  {
    id: 'bicicleta',
    name: 'Bicicleta',
    icon: '🚴',
    color: 'var(--color-walk)',
    recommendedMinutes: [15, 25],
    recommendedIntensity: 'Leve a médio',
    benefits: 'Fortalece pernas e sistema cardiovascular com baixo impacto nas articulações.',
  },
  {
    id: 'alongamento',
    name: 'Alongamento',
    icon: '🧘',
    color: 'var(--color-stretch)',
    recommendedMinutes: [10, 15],
    recommendedIntensity: 'Leve',
    benefits: 'Melhora flexibilidade, reduz tensão muscular e ajuda na recuperação.',
  },
  {
    id: 'respiratorio',
    name: 'Exercício respiratório',
    icon: '🫁',
    color: 'var(--color-breath)',
    recommendedMinutes: [5, 10],
    recommendedIntensity: 'Leve',
    benefits: 'Fortalece a musculatura respiratória e ajuda no controle da falta de ar.',
  },
];

export function getExerciseCatalogItem(id: string): ExerciseCatalogItem | undefined {
  return EXERCISE_CATALOG.find((item) => item.id === id);
}
