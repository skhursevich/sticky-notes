import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useNotes } from "../hooks/useNotes";
import { StickyNote } from "./StickyNote";
import { Toolbar } from "./Toolbar";
import { Trash } from "./Trash";
import { DEFAULT_NOTE_HEIGHT, DEFAULT_NOTE_WIDTH, MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH } from "../types";
import type { NoteColor, Rect } from '../types';
import { clamp } from '../utils/geometry';

const CLICK_DRAG_THRESHOLD_PX = 6;

export function Board() {  
  const boardRef = useRef<HTMLDivElement>(null);
  const creationOrigin = useRef({ x: 0, y: 0 });

  const { notes, addNote } = useNotes();

  const [placingColor] = useState<NoteColor>('yellow');
  const [draft, setDraft] = useState<Rect | null>(null);

  const handleBoardPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {      
      if (e.target !== e.currentTarget) return;

      const boardRect = boardRef.current?.getBoundingClientRect();
      
      if (!boardRect) return;

      const originX = e.clientX - boardRect.left;
      const originY = e.clientY - boardRect.top;
      creationOrigin.current = { x: originX, y: originY };
      setDraft({ x: originX, y: originY, width: 0, height: 0 });

      const handleMove = (moveEvent: PointerEvent) => {
        const currentX = clamp(moveEvent.clientX - boardRect.left, 0, boardRect.width);
        const currentY = clamp(moveEvent.clientY - boardRect.top, 0, boardRect.height);
        const { x: startX, y: startY } = creationOrigin.current;
        
        setDraft({
          x: Math.min(startX, currentX),
          y: Math.min(startY, currentY),
          width: Math.abs(currentX - startX),
          height: Math.abs(currentY - startY),
        });
      };

      const handleUp = (upEvent: PointerEvent) => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);

        const currentX = clamp(upEvent.clientX - boardRect.left, 0, boardRect.width);
        const currentY = clamp(upEvent.clientY - boardRect.top, 0, boardRect.height);
        const { x: startX, y: startY } = creationOrigin.current;

        const draggedWidth = Math.abs(currentX - startX);
        const draggedHeight = Math.abs(currentY - startY);

        const isClick = draggedWidth < CLICK_DRAG_THRESHOLD_PX && draggedHeight < CLICK_DRAG_THRESHOLD_PX;
        const width = isClick ? DEFAULT_NOTE_WIDTH : Math.max(draggedWidth, MIN_NOTE_WIDTH);
        const height = isClick ? DEFAULT_NOTE_HEIGHT : Math.max(draggedHeight, MIN_NOTE_HEIGHT);
        
        const x = clamp(
          isClick ? startX - width / 2 : Math.min(startX, currentX),
          0,
          boardRect.width - width,
        );
        
        const y = clamp(
          isClick ? startY - height / 2 : Math.min(startY, currentY),
          0,
          boardRect.height - height,
        );

        addNote({ x, y, width, height }, placingColor);
        setDraft(null);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [addNote, placingColor],
  );

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50">
      <Toolbar />
      <div
        ref={boardRef}
        className="board-grid relative flex-1 overflow-hidden"
        onPointerDown={handleBoardPointerDown}
      >
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
          />
        ))}

        {draft && (
          <div
            className="pointer-events-none absolute rounded-md border-2 border-dashed border-indigo-400 bg-indigo-100/40"
            style={{ left: draft.x, top: draft.y, width: draft.width, height: draft.height }}
          />
        )}
      </div>

      <Trash />
    </div>
  );
}
