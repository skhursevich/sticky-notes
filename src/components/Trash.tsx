import { forwardRef } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';

interface TrashProps {
  active: boolean;
}

export const Trash = forwardRef<HTMLDivElement, TrashProps>(({ active }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute bottom-6 right-6 z-[9999] flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed transition-colors ${
        active
          ? 'scale-110 border-red-500 bg-red-100 text-red-600'
          : 'border-slate-300 bg-white/80 text-slate-400'
      }`}
    >
      <FaRegTrashCan size={18} />
      <span className="text-[11px] font-medium text-center">{active ? 'Delete' : 'Trash'}</span>
    </div>
  );
});

Trash.displayName = 'Trash';
