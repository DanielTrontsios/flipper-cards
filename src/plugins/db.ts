// db.ts
import Dexie, { type EntityTable } from 'dexie';
import './uuidGenerator';
import type { Question } from '../types';

const db = new Dexie('QuestionsDB') as Dexie & {
  questions: EntityTable<
    Question,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  questions: '$$id, externalId, question, answer, deck, synced, lastModified, conflict' // primary key "id" (for the runtime!)
});

export { db };