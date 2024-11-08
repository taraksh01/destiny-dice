export interface Destiny {
  id: string;
  text: string;
  createdAt: number;
  editedAt?: number;
}

export interface HistoryItem extends Destiny {
  selectedAt: number;
}

export const HISTORY_SIZE_OPTIONS = [3, 5, 7, 10, 15, 20] as const;
export type HistorySize = (typeof HISTORY_SIZE_OPTIONS)[number];

export const MAX_STORED_HISTORY = 20;

export const LOCAL_STORAGE_KEYS = {
  DESTINIES: 'destinies',
  SELECTION_HISTORY: 'selectionHistory',
  HISTORY_SIZE: 'historySize'
} as const; 