import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { db } from './firebase';

export type Intensity = 'leve' | 'médio' | 'intenso';

export type Exercise = {
  id: string;
  type: string;
  duration: number;
  intensity: Intensity;
  createdAt: Date;
};

function fromDoc(docSnap: QueryDocumentSnapshot): Exercise {
  const data = docSnap.data();
  const createdAt: Timestamp | undefined = data.createdAt;
  return {
    id: docSnap.id,
    type: data.type,
    duration: data.duration,
    intensity: data.intensity,
    createdAt: createdAt ? createdAt.toDate() : new Date(),
  };
}

export async function addExercise(
  uid: string,
  exercise: { type: string; duration: number; intensity: Intensity }
) {
  await addDoc(collection(db, 'users', uid, 'exercises'), {
    ...exercise,
    createdAt: serverTimestamp(),
  });
}

export async function getExercisesSince(uid: string, since: Date): Promise<Exercise[]> {
  const q = query(
    collection(db, 'users', uid, 'exercises'),
    where('createdAt', '>=', Timestamp.fromDate(since)),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(fromDoc);
}

export async function getAllExercises(uid: string): Promise<Exercise[]> {
  const q = query(collection(db, 'users', uid, 'exercises'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(fromDoc);
}
