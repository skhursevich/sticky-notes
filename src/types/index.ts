export interface StickyNoteData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: NoteColor;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}

export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange';

export const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'blue', 'green', 'orange'];

export const MIN_NOTE_WIDTH = 140;
export const MIN_NOTE_HEIGHT = 120;
export const DEFAULT_NOTE_WIDTH = 200;
export const DEFAULT_NOTE_HEIGHT = 180;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
