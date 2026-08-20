import { FaRegTrashCan } from "react-icons/fa6";

export const Trash = () => {
  return (
    <div className="absolute bottom-6 right-6 z-[9999] flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed transition-colors">
        <FaRegTrashCan size={18} />
      <span className="text-[11px] font-medium text-center">Trash</span>
    </div>
  );
};
