import { Toolbar } from "./Toolbar";

export function Board() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50">
      <Toolbar />
      <div
        className="board-grid relative flex-1 overflow-hidden"
      >
      </div>
    </div>
  );
}
