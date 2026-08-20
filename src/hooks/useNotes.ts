import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export function useNotes() {
  const [notes, setNotes] = useState<StickyNoteData[]>(() => loadNotesFromStorage() ?? []);
  const zIndexCounter = useRef(notes.reduce((max, note) => Math.max(max, note.zIndex), 0));

  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  const nextZIndex = useCallback(() => {
    zIndexCounter.current += 1;
    return zIndexCounter.current;
  }, []);

  const addNote = useCallback(
    (rect: Rect, color: NoteColor) => {
      const note = createNote(rect, nextZIndex(), color);
      setNotes((prev) => [...prev, note]);
      return note;
    },
    [nextZIndex],
  );

  const updateNote = useCallback((id: string, patch: Partial<StickyNoteData>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...patch, updatedAt: Date.now() } : note)),
    );
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  const bringToFront = useCallback(
    (id: string) => {
      const top = nextZIndex();
      setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, zIndex: top } : note)));
    },
    [nextZIndex],
  );

  const sortedNotes = useMemo(() => [...notes].sort((a, b) => a.zIndex - b.zIndex), [notes]);

  return {
    notes: sortedNotes,
    addNote,
    updateNote,
    removeNote,
    bringToFront,
  };
}
