export interface Question {
  id: string | null;
  question: string;
  answer: string;
  deck?: string;
  synced: number;
  lastModified?: number;
  conflict?: number;
}

export interface Deck {
  title: string;
}