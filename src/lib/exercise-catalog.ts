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
  {
    id: 'marcha',
    name: 'Caminhada no lugar',
    icon: '👟',
    color: 'var(--color-walk)',
    recommendedMinutes: [10, 20],
    recommendedIntensity: 'Leve',
    benefits:
      'Todos os benefícios da caminhada sem sair de casa — ideal para dias de chuva ou calor forte.',
    instructions: [
      'Fique perto de uma cadeira ou parede para se apoiar se precisar.',
      'Marche no lugar levantando bem os joelhos, balançando os braços.',
      'Mantenha um ritmo em que você consiga conversar sem ofegar.',
    ],
  },
  {
    id: 'danca',
    name: 'Dança leve',
    icon: '💃',
    color: 'var(--color-heart)',
    recommendedMinutes: [15, 25],
    recommendedIntensity: 'Leve a médio',
    benefits:
      'Exercita o coração com alegria: melhora o condicionamento, o humor e a coordenação.',
    instructions: [
      'Coloque uma música que você ama e dance no seu ritmo.',
      'Movimentos suaves, sem pulos — o objetivo é se divertir em movimento.',
      'Cansou ou ficou ofegante? Diminua o ritmo ou faça uma pausa.',
    ],
  },
  {
    id: 'fortalecimento',
    name: 'Fortalecimento leve',
    icon: '💪',
    color: 'var(--color-warning)',
    recommendedMinutes: [10, 15],
    recommendedIntensity: 'Leve',
    benefits:
      'Músculos mais fortes ajudam o coração a trabalhar menos nas tarefas do dia a dia.',
    instructions: [
      'Use garrafinhas de água (500 ml) como pesos leves.',
      'Levante os braços devagar, soltando o ar no esforço — nunca prenda a respiração.',
      'Sentado ou em pé com apoio: levante e abaixe os calcanhares 10 vezes.',
    ],
  },
  {
    id: 'equilibrio',
    name: 'Equilíbrio',
    icon: '🧍',
    color: 'var(--color-stretch)',
    recommendedMinutes: [5, 10],
    recommendedIntensity: 'Leve',
    benefits: 'Reduz o risco de quedas e dá mais segurança para se exercitar todos os dias.',
    instructions: [
      'Segure no encosto de uma cadeira firme.',
      'Fique alguns segundos apoiado em um pé só, depois troque.',
      'Caminhe em linha reta colocando um pé na frente do outro, devagar.',
    ],
  },
];

export function getExerciseCatalogItem(id: string): ExerciseCatalogItem | undefined {
  return EXERCISE_CATALOG.find((item) => item.id === id);
}
