import type { StickyNoteData } from '../types';
import { IoIosClose } from "react-icons/io";

interface StickyNoteProps {
  note: StickyNoteData;
}

export function StickyNote({ note }: StickyNoteProps) {
  return (
    <div className="group absolute flex select-none flex-col overflow-hidden rounded-md border shadow-md transition-shadow">
      <div
        className="flex items-center gap-1 border-b border-black/5 bg-white/60 px-1.5 py-1"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="ml-auto rounded p-0.5 text-slate-500 hover:bg-black/10 hover:text-red-600"
        >
          <IoIosClose size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden p-2.5 cursor-move">
        <textarea
          autoFocus
          defaultValue={note.text}
          className="h-full w-full resize-none border-none bg-transparent text-sm leading-snug text-slate-800 outline-none placeholder:text-slate-500"
          placeholder="Type a note..."
        />
      </div>
    </div>
  );
}
