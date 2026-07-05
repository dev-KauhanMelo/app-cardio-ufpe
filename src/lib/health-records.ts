import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export type Feeling = 'bem' | 'normal' | 'cansado';

export type Symptoms = {
  chestPain: boolean;
  breathlessness: boolean;
  dizziness: boolean;
  other: boolean;
};

export type HealthRecordEntry = {
  feeling: Feeling;
  symptoms: Symptoms;
  notes: string;
  createdAt: Date;
};

export async function addHealthRecord(
  uid: string,
  record: { feeling: Feeling; symptoms: Symptoms; notes: string }
) {
  await addDoc(collection(db, 'users', uid, 'healthRecords'), {
    ...record,
    createdAt: serverTimestamp(),
  });
}

export async function getLatestHealthRecord(uid: string): Promise<HealthRecordEntry | null> {
  const q = query(
    collection(db, 'users', uid, 'healthRecords'),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const data = snapshot.docs[0].data();
  const createdAt: Timestamp | undefined = data.createdAt;
  return {
    feeling: data.feeling,
    symptoms: data.symptoms,
    notes: data.notes,
    createdAt: createdAt ? createdAt.toDate() : new Date(),
  };
}
