import { memo, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { TfiArrowsCorner } from 'react-icons/tfi';
import { FaRegSave } from 'react-icons/fa';
import type { NoteColor, StickyNoteData } from '../types';
import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH, NOTE_COLORS } from '../types';
import { NOTE_COLOR_THEME } from '../constants/colors';
import { usePointerDrag } from '../hooks/usePointerDrag';
import { clamp, overlapRatio } from '../utils/geometry';

const CLICK_DRAG_THRESHOLD_PX = 10;

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

export const StickyNote = memo(function StickyNote({
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
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [livePosition, setLivePosition] = useState<{ x: number; y: number } | null>(null);
  const [draftText, setDraftText] = useState(note.text);
  const [isEditingText, setIsEditingText] = useState(false);

  const dragStart = useRef({ x: note.x, y: note.y, width: note.width, height: note.height });
  const wasEditingAtDragStart = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const blurFromDrag = useRef(false);
  const theme = NOTE_COLOR_THEME[note.color];

  // Deselecting always exits text editing
  useEffect(() => {
    if (!selected) setIsEditingText(false);
  }, [selected]);

  useEffect(() => {
    if (!isEditingText) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.focus();
    const end = textarea.value.length;
    textarea.setSelectionRange(end, end);
  }, [isEditingText]);

  const getBoardRect = () => boardRef.current?.getBoundingClientRect() ?? null;

  const startMove = usePointerDrag({
    onDragStart: () => {
      dragStart.current = { ...dragStart.current, x: note.x, y: note.y };
      wasEditingAtDragStart.current = isEditingText;
      
      if (isEditingText) {
        blurFromDrag.current = true;
        textareaRef.current?.blur();
      }

      setIsMoving(true);
    },
    onDragMove: ({ dx, dy }) => {
      const boardRect = getBoardRect();
      if (!boardRect) return;

      const nextX = clamp(dragStart.current.x + dx, 0, boardRect.width - note.width);
      const nextY = clamp(dragStart.current.y + dy, 0, boardRect.height - note.height);
      setLivePosition({ x: nextX, y: nextY });

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
      if (over !== isOverTrash) {
        setIsOverTrash(over);
        onDragOverTrashChange(over);
      }
    },
    onDragEnd: ({ dx, dy }) => {
      const boardRect = getBoardRect();
      if (boardRect) {
        const finalX = clamp(dragStart.current.x + dx, 0, boardRect.width - note.width);
        const finalY = clamp(dragStart.current.y + dy, 0, boardRect.height - note.height);
        onMove(note.id, finalX, finalY);
      }

      onDragOverTrashChange(false);
      if (isOverTrash) {
        onRemove(note.id);
      }
      setIsOverTrash(false);
      setIsMoving(false);
      setLivePosition(null);

      if (wasEditingAtDragStart.current) {
        requestAnimationFrame(() => textareaRef.current?.focus());
      }

      if (!wasEditingAtDragStart.current) {
        const moved = Math.abs(dx) > CLICK_DRAG_THRESHOLD_PX || Math.abs(dy) > CLICK_DRAG_THRESHOLD_PX;
        
        if (!moved) {
          onSelect(note.id);
          setIsEditingText(true);
        }
      }
    },
  });

  const displayX = livePosition?.x ?? note.x;
  const displayY = livePosition?.y ?? note.y;

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
        left: displayX,
        top: displayY,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex,
        touchAction: 'none',
      }}
      onPointerDown={startMove}
    >
      {selected && (!isMoving || isEditingText) && (
        <div className="flex items-center gap-1 border-b border-black/5 bg-white/60 px-1.5 py-2.5 cursor-move">
          {NOTE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`h-4 w-4 rounded-full border border-black/10 ${NOTE_COLOR_THEME[color].swatch} ${
                color === note.color ? 'ring-2 ring-offset-1 ring-slate-500' : ''
              }`}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onColorChange(note.id, color)}
            />
          ))}
          <button
            type="button"
            title="Save"
            className={`ml-auto flex h-5 w-5 items-center justify-center rounded hover:bg-black/5 ${draftText !== note.text ? 'text-slate-600' : 'text-slate-400'}`}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onTextChange(note.id, draftText)}
          >
            <FaRegSave size={24} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-hidden p-2.5 cursor-move">
        {selected && isEditingText ? (
          <textarea
            ref={textareaRef}
            value={draftText}
            className="h-full w-full resize-none border-none bg-transparent text-lg leading-snug text-slate-800 outline-none placeholder:text-slate-500"
            placeholder="Type a note..."
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setDraftText(e.target.value)}
            onBlur={() => {
              if (blurFromDrag.current) {
                blurFromDrag.current = false;
                return;
              }
              setIsEditingText(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDraftText(note.text);
                e.currentTarget.blur();
              }
            }}
          />
        ) : (
          <p className="h-full w-full overflow-hidden whitespace-pre-wrap break-words text-lg leading-snug text-slate-800">
            {note.text || <span className="text-slate-500">Click to add text</span>}
          </p>
        )}
      </div>

      {(!isMoving && !isEditingText) && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize opacity-0 group-hover:opacity-70"
          onPointerDown={(e) => {
            e.stopPropagation();
            startResize(e);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <TfiArrowsCorner size={12} />
        </div>
      )}
    </div>
  );
});
