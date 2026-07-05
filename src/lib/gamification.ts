import { doc, getDoc, runTransaction, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const XP_PER_LEVEL = 100;

export type PlantStage = { minLevel: number; leaves: number; label: string };

export const PLANT_STAGES: PlantStage[] = [
  { minLevel: 1, leaves: 0, label: 'Semente' },
  { minLevel: 3, leaves: 1, label: 'Broto' },
  { minLevel: 5, leaves: 2, label: 'Muda' },
  { minLevel: 8, leaves: 3, label: 'Florescendo' },
  { minLevel: 11, leaves: 4, label: 'Árvore' },
];

export function getLevelFromXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getPlantStage(level: number): PlantStage {
  let current = PLANT_STAGES[0];
  for (const stage of PLANT_STAGES) {
    if (level >= stage.minLevel) current = stage;
  }
  return current;
}

export type MascotMood = 'happy' | 'neutral' | 'sleepy';

export function getMascotMood({
  streak,
  lastActivityDate,
}: {
  streak: number;
  lastActivityDate: string | null;
}): MascotMood {
  if (!lastActivityDate) return 'neutral';
  const today = getTodayId();
  const yesterday = getYesterdayId(today);
  if (streak > 0 && (lastActivityDate === today || lastActivityDate === yesterday)) {
    return 'happy';
  }
  const daysSince = daysBetween(lastActivityDate, today);
  return daysSince >= 3 ? 'sleepy' : 'neutral';
}

function daysBetween(fromId: string, toId: string): number {
  const [fy, fm, fd] = fromId.split('-').map(Number);
  const [ty, tm, td] = toId.split('-').map(Number);
  const from = new Date(fy, fm - 1, fd);
  const to = new Date(ty, tm - 1, td);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

export type ChallengeId = 'exercise' | 'checkin' | 'nutrition';

export type Tier = { label: string; xp: number };

const EXERCISE_TIERS: (Tier & { minMinutes: number })[] = [
  { minMinutes: 0, label: 'Exercício rápido (até 14 min)', xp: 10 },
  { minMinutes: 15, label: 'Exercício completo (15-29 min)', xp: 20 },
  { minMinutes: 30, label: 'Exercício exemplar (30+ min)', xp: 30 },
];

const NUTRITION_TIERS: (Tier & { minPortions: number })[] = [
  { minPortions: 0, label: '0 porções', xp: 0 },
  { minPortions: 1, label: '1-2 porções de fruta/vegetal', xp: 5 },
  { minPortions: 3, label: '3-4 porções de fruta/vegetal', xp: 10 },
  { minPortions: 5, label: '5+ porções de fruta/vegetal', xp: 15 },
];

const CHECKIN_TIER: Tier = { label: 'Check-in de saúde', xp: 15 };

export function getExerciseTier(minutes: number): Tier {
  let current = EXERCISE_TIERS[0];
  for (const tier of EXERCISE_TIERS) {
    if (minutes >= tier.minMinutes) current = tier;
  }
  return current;
}

export function getNutritionTier(portions: number): Tier {
  let current = NUTRITION_TIERS[0];
  for (const tier of NUTRITION_TIERS) {
    if (portions >= tier.minPortions) current = tier;
  }
  return current;
}

export const NUTRITION_TIER_TABLE = NUTRITION_TIERS.filter((t) => t.minPortions > 0);
export const EXERCISE_TIER_TABLE = EXERCISE_TIERS;
export const CHECKIN_XP = CHECKIN_TIER.xp;

export function getTodayId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayId(todayId: string): string {
  const [year, month, day] = todayId.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export type Sex = 'M' | 'F' | 'outro';

export type UserProfile = {
  name: string | null;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  dailyGoalMinutes: number;
  birthDate: string | null;
  sex: Sex | null;
  weightKg: number | null;
  notificationsOptIn: boolean;
};

export async function ensureUserProfile(uid: string, name?: string) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      name: name ?? null,
      xp: 0,
      streak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      dailyGoalMinutes: 20,
      birthDate: null,
      sex: null,
      weightKg: null,
      notificationsOptIn: false,
      createdAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  const data = snap.data() ?? {};
  const xp = data.xp ?? 0;
  return {
    name: data.name ?? null,
    xp,
    level: getLevelFromXp(xp),
    streak: data.streak ?? 0,
    longestStreak: data.longestStreak ?? 0,
    lastActivityDate: data.lastActivityDate ?? null,
    dailyGoalMinutes: data.dailyGoalMinutes ?? 20,
    birthDate: data.birthDate ?? null,
    sex: data.sex ?? null,
    weightKg: data.weightKg ?? null,
    notificationsOptIn: data.notificationsOptIn ?? false,
  };
}

export async function setDailyGoalMinutes(uid: string, minutes: number) {
  await setDoc(doc(db, 'users', uid), { dailyGoalMinutes: minutes }, { merge: true });
}

export async function updateProfileDetails(
  uid: string,
  details: { birthDate: string; sex: Sex; weightKg: number }
) {
  await setDoc(doc(db, 'users', uid), details, { merge: true });
}

export async function setNotificationsOptIn(uid: string, optIn: boolean) {
  await setDoc(doc(db, 'users', uid), { notificationsOptIn: optIn }, { merge: true });
}

export type ChallengeDayEntry = { tier: string; xp: number } | null;
export type TodayChallenges = Record<ChallengeId, ChallengeDayEntry>;

export async function getTodayChallenges(uid: string): Promise<TodayChallenges> {
  const ref = doc(db, 'users', uid, 'challengeDays', getTodayId());
  const snap = await getDoc(ref);
  const data = snap.data() ?? {};
  return {
    exercise: data.exercise ?? null,
    checkin: data.checkin ?? null,
    nutrition: data.nutrition ?? null,
  };
}

export type CompleteChallengeResult = {
  xpAwarded: number;
  tierLabel: string;
  leveledUp: boolean;
  newLevel: number;
  newStreak: number;
};

function resolveTier(challengeId: ChallengeId, quantity: number): Tier {
  if (challengeId === 'exercise') return getExerciseTier(quantity);
  if (challengeId === 'nutrition') return getNutritionTier(quantity);
  return CHECKIN_TIER;
}

/**
 * quantity: minutos (exercise), porções (nutrition), ignorado (checkin).
 * Se o dia já tinha um tier registrado com XP igual/maior, não premia de novo;
 * se o novo tier for maior, premia só a diferença.
 */
export async function completeChallenge(
  uid: string,
  challengeId: ChallengeId,
  quantity = 0
): Promise<CompleteChallengeResult> {
  const tier = resolveTier(challengeId, quantity);
  const todayId = getTodayId();
  const userRef = doc(db, 'users', uid);
  const challengeDayRef = doc(db, 'users', uid, 'challengeDays', todayId);

  return runTransaction(db, async (transaction) => {
    const [userSnap, challengeDaySnap] = await Promise.all([
      transaction.get(userRef),
      transaction.get(challengeDayRef),
    ]);

    const userData = userSnap.data() ?? {};
    const previousXp = userData.xp ?? 0;
    const previousLevel = getLevelFromXp(previousXp);

    const challengeDayData = challengeDaySnap.data() ?? {};
    const existing: ChallengeDayEntry = challengeDayData[challengeId] ?? null;
    const previousTierXp = existing?.xp ?? 0;

    const xpAwarded = Math.max(0, tier.xp - previousTierXp);

    if (xpAwarded === 0) {
      return {
        xpAwarded: 0,
        tierLabel: tier.label,
        leveledUp: false,
        newLevel: previousLevel,
        newStreak: userData.streak ?? 0,
      };
    }

    const newXp = previousXp + xpAwarded;
    const newLevel = getLevelFromXp(newXp);

    const lastActivityDate: string | null = userData.lastActivityDate ?? null;
    let streak: number = userData.streak ?? 0;
    let longestStreak: number = userData.longestStreak ?? 0;

    if (lastActivityDate !== todayId) {
      streak = lastActivityDate === getYesterdayId(todayId) ? streak + 1 : 1;
      longestStreak = Math.max(longestStreak, streak);
    }

    transaction.set(
      userRef,
      { xp: newXp, streak, longestStreak, lastActivityDate: todayId },
      { merge: true }
    );
    transaction.set(
      challengeDayRef,
      { [challengeId]: { tier: tier.label, xp: tier.xp } },
      { merge: true }
    );

    return {
      xpAwarded,
      tierLabel: tier.label,
      leveledUp: newLevel > previousLevel,
      newLevel,
      newStreak: streak,
    };
  });
}
