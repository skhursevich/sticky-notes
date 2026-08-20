import type { StickyNoteData } from '../types';

const STORAGE_KEY = 'sticky-notes.board';

export function loadNotesFromStorage(): StickyNoteData[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as StickyNoteData[];

    if (!Array.isArray(parsed)) return null;

    return parsed;
  } catch (error) {
    console.warn('Failed to read notes from localStorage', error);
    return null;
  }
}

export function saveNotesToStorage(notes: StickyNoteData[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.warn('Failed to persist notes to localStorage', error);
  }
}
