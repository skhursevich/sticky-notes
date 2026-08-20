import { LuCirclePlus } from 'react-icons/lu';
import type { NoteColor } from '../types';
import { NOTE_COLORS } from '../types';
import { NOTE_COLOR_THEME } from '../constants/colors';

interface ToolbarProps {
  isPlacing: boolean;
  onTogglePlacing: () => void;
  placingColor: NoteColor;
  onPlacingColorChange: (color: NoteColor) => void;
  noteCount: number;
}

export function Toolbar({
  isPlacing,
  onTogglePlacing,
  placingColor,
  onPlacingColorChange,
  noteCount,
}: ToolbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
          S
        </div>
        <h1 className="text-sm font-semibold text-slate-800">Sticky notes board</h1>
      </div>

      <div className="mx-2 h-6 w-px bg-slate-200" />

      <button
        type="button"
        onClick={onTogglePlacing}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          isPlacing
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        <LuCirclePlus size={16} />
        {isPlacing ? 'Click or drag on the board...' : 'New note'}
      </button>

      <div className="flex items-center gap-1 pl-1">
        {NOTE_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onPlacingColorChange(color)}
            className={`h-5 w-5 rounded-full border border-black/10 ${NOTE_COLOR_THEME[color].swatch} ${
              color === placingColor ? 'ring-2 ring-offset-1 ring-indigo-500' : ''
            }`}
          />
        ))}
      </div>

      <div className="ml-auto text-xs text-slate-500">
        <span>
          {noteCount} note{noteCount === 1 ? '' : 's'}
        </span>
      </div>
    </header>
  );
}
