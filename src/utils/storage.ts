import { Destiny, HistoryItem, LOCAL_STORAGE_KEYS } from '../types/destiny';

export const storage = {
  getDestinies: (): Destiny[] => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.DESTINIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading destinies:', error);
      return [];
    }
  },

  setDestinies: (destinies: Destiny[]): void => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.DESTINIES, JSON.stringify(destinies));
      window.dispatchEvent(new Event('itemsUpdated'));
    } catch (error) {
      console.error('Error saving destinies:', error);
    }
  },

  getHistory: (): HistoryItem[] => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTION_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  },

  setHistory: (history: HistoryItem[]): void => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTION_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }
}; 