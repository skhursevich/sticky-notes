import { useCallback, useEffect, useState } from 'react';
import { loadNotesFromStorage, saveNotesToStorage } from '../api/storage';
import type { NoteColor, Rect, StickyNoteData } from '../types';
import { DEFAULT_NOTE_HEIGHT, DEFAULT_NOTE_WIDTH } from '../types';

function createNote(rect: Rect, zIndex: number, color: NoteColor): StickyNoteData {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    x: rect.x,
    y: rect.y,
    width: rect.width || DEFAULT_NOTE_WIDTH,
    height: rect.height || DEFAULT_NOTE_HEIGHT,
    text: '',
    color,
    zIndex,
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeZIndex(list: StickyNoteData[]): StickyNoteData[] {
  return list.map((note, index) =>
    note.zIndex === index + 1 ? note : { ...note, zIndex: index + 1 },
  );
}

export function useNotes() {
  const [notes, setNotes] = useState<StickyNoteData[]>(() =>
    normalizeZIndex(loadNotesFromStorage() ?? []),
  );

  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  const addNote = useCallback((rect: Rect, color: NoteColor) => {
    const note = createNote(rect, 0, color);
    let created = note;

    setNotes((prev) => {
      const next = normalizeZIndex([...prev, note]);
      created = next[next.length - 1];
      return next;
    });

    return created;
  }, []);

  const updateNote = useCallback((id: string, patch: Partial<StickyNoteData>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...patch, updatedAt: Date.now() } : note)),
    );
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => normalizeZIndex(prev.filter((note) => note.id !== id)));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setNotes((prev) => {
      if (prev.length === 0 || prev[prev.length - 1].id === id) return prev;

      const target = prev.find((note) => note.id === id);

      if (!target) return prev;

      return normalizeZIndex([...prev.filter((note) => note.id !== id), target]);
    });
  }, []);

  return {
    notes,
    addNote,
    updateNote,
    removeNote,
    bringToFront,
  };
}
