import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { TfiArrowsCorner } from 'react-icons/tfi';
import type { NoteColor, StickyNoteData } from '../types';
import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH, NOTE_COLORS } from '../types';
import { NOTE_COLOR_THEME } from '../constants/colors';
import { usePointerDrag } from '../hooks/usePointerDrag';
import { clamp, overlapRatio } from '../utils/geometry';

interface StickyNoteProps {
  note: StickyNoteData;
  boardRef: RefObject<HTMLDivElement | null>;
  trashRef: RefObject<HTMLDivElement | null>;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onTextChange: (id: string, text: string) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  onRemove: (id: string) => void;
  onDragOverTrashChange: (active: boolean) => void;
}

export function StickyNote({
  note,
  boardRef,
  trashRef,
  selected,
  onSelect,
  onMove,
  onResize,
  onTextChange,
  onColorChange,
  onRemove,
  onDragOverTrashChange,
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const dragStart = useRef({ x: note.x, y: note.y, width: note.width, height: note.height });
  const theme = NOTE_COLOR_THEME[note.color];

  const getBoardRect = () => boardRef.current?.getBoundingClientRect() ?? null;

  const startMove = usePointerDrag({
    onDragStart: () => {
      dragStart.current = { ...dragStart.current, x: note.x, y: note.y };
      onSelect(note.id);
      setIsMoving(true);
    },
    onDragMove: ({ dx, dy }) => {
      const boardRect = getBoardRect();
      if (!boardRect) return;

      const nextX = clamp(dragStart.current.x + dx, 0, boardRect.width - note.width);
      const nextY = clamp(dragStart.current.y + dy, 0, boardRect.height - note.height);
      onMove(note.id, nextX, nextY);

      const trash = trashRef.current;
      if (!trash) return;

      const trashRect = trash.getBoundingClientRect();
      const noteScreenRect = {
        x: boardRect.left + nextX,
        y: boardRect.top + nextY,
        width: note.width,
        height: note.height,
      };

      const over = overlapRatio(trashRect, noteScreenRect) > 0.5;
      setIsOverTrash(over);
      onDragOverTrashChange(over);
    },
    onDragEnd: () => {
      onDragOverTrashChange(false);
      if (isOverTrash) {
        onRemove(note.id);
      }
      setIsOverTrash(false);
      setIsMoving(false);
    },
  });

  const startResize = usePointerDrag({
    onDragStart: () => {
      dragStart.current = { ...dragStart.current, width: note.width, height: note.height };
    },
    onDragMove: ({ dx, dy }) => {
      const boardRect = getBoardRect();
      if (!boardRect) return;

      const maxWidth = boardRect.width - note.x;
      const maxHeight = boardRect.height - note.y;
      const nextWidth = clamp(dragStart.current.width + dx, MIN_NOTE_WIDTH, maxWidth);
      const nextHeight = clamp(dragStart.current.height + dy, MIN_NOTE_HEIGHT, maxHeight);
      onResize(note.id, nextWidth, nextHeight);
    },
  });

  return (
    <div
      className={`group absolute flex select-none flex-col overflow-hidden rounded-md border shadow-md transition-shadow ${theme.note} ${theme.border} ${
        isOverTrash ? 'opacity-40 ring-2 ring-red-500' : ''
      } ${selected ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex,
        touchAction: 'none',
      }}
      onPointerDown={(e) => {
        if (isEditing) return;
        startMove(e);
      }}
      onDoubleClick={() => setIsEditing(true)}
      onClick={() => onSelect(note.id)}
    >
      {selected && !isEditing && !isMoving && (
        <div
          className="flex items-center gap-1 border-b border-black/5 bg-white/60 px-1.5 py-1"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {NOTE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`h-4 w-4 rounded-full border border-black/10 ${NOTE_COLOR_THEME[color].swatch} ${
                color === note.color ? 'ring-2 ring-offset-1 ring-slate-500' : ''
              }`}
              onClick={() => onColorChange(note.id, color)}
            />
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden p-2.5 cursor-move">
        {isEditing ? (
          <textarea
            autoFocus
            defaultValue={note.text}
            className="h-full w-full resize-none border-none bg-transparent text-sm leading-snug text-slate-800 outline-none placeholder:text-slate-500"
            placeholder="Type a note..."
            onPointerDown={(e) => e.stopPropagation()}
            onBlur={(e) => {
              setIsEditing(false);
              onTextChange(note.id, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.currentTarget.blur();
              }
            }}
          />
        ) : (
          <p className="h-full w-full overflow-hidden whitespace-pre-wrap break-words text-sm leading-snug text-slate-800">
            {note.text || <span className="text-slate-500">Double-click to add text</span>}
          </p>
        )}
      </div>

      {!isMoving && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize opacity-0 group-hover:opacity-70"
          onPointerDown={(e) => {
            e.stopPropagation();
            startResize(e);
          }}
        >
          <TfiArrowsCorner size={12} />
        </div>
      )}
    </div>
  );
}
