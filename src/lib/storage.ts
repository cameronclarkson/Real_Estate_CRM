import { Board } from './types';

const STORAGE_KEY = 'real-estate-crm-data';

export function getDefaultBoard(): Board {
  return {
    id: 'board-1',
    title: 'Real Estate Deal Pipeline',
    lists: [
      {
        id: 'list-1',
        title: 'Prospect',
        cards: [],
      },
      {
        id: 'list-2',
        title: 'Gross Lead',
        cards: [],
      },
      {
        id: 'list-3',
        title: 'Net Lead',
        cards: [],
      },
      {
        id: 'list-4',
        title: 'Under Contract',
        cards: [],
      },
      {
        id: 'list-5',
        title: 'Closed',
        cards: [],
      },
    ],
  };
}

export function loadBoard(): Board {
  if (typeof window === 'undefined') {
    return getDefaultBoard();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading board from localStorage:', error);
  }

  return getDefaultBoard();
}

export function saveBoard(board: Board): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch (error) {
    console.error('Error saving board to localStorage:', error);
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some data and try again.');
    }
  }
}

