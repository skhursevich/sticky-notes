import type { NoteColor } from '../types';

interface ColorTheme {
  label: string;
  swatch: string;
  note: string;
  border: string;
}

export const NOTE_COLOR_THEME: Record<NoteColor, ColorTheme> = {
  yellow: {
    label: 'Yellow',
    swatch: 'bg-amber-300',
    note: 'bg-amber-200',
    border: 'border-amber-400',
  },
  pink: {
    label: 'Pink',
    swatch: 'bg-pink-300',
    note: 'bg-pink-200',
    border: 'border-pink-400',
  },
  blue: {
    label: 'Blue',
    swatch: 'bg-sky-300',
    note: 'bg-sky-200',
    border: 'border-sky-400',
  },
  green: {
    label: 'Green',
    swatch: 'bg-emerald-300',
    note: 'bg-emerald-200',
    border: 'border-emerald-400',
  },
  orange: {
    label: 'Orange',
    swatch: 'bg-orange-300',
    note: 'bg-orange-200',
    border: 'border-orange-400',
  },
};
