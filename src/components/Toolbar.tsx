export function Toolbar() {
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
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
      >
        New note
      </button>
    </header>
  );
}
