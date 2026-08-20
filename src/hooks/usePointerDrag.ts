import { useCallback, useEffect, useRef } from 'react';

export interface DragDelta {
  dx: number;
  dy: number;
  clientX: number;
  clientY: number;
}

export interface DragHandlers {
  onDragStart?: (e: React.PointerEvent) => void;
  onDragMove: (delta: DragDelta) => void;
  onDragEnd?: (delta: DragDelta) => void;
}

export function usePointerDrag(handlers: DragHandlers) {
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  const origin = useRef({ x: 0, y: 0 });

  const startDrag = useCallback((e: React.PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;

    e.stopPropagation();

    origin.current = { x: e.clientX, y: e.clientY };
    handlersRef.current.onDragStart?.(e);

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    const handleMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - origin.current.x;
      const dy = moveEvent.clientY - origin.current.y;

      handlersRef.current.onDragMove({
        dx,
        dy,
        clientX: moveEvent.clientX,
        clientY: moveEvent.clientY,
      });
    };

    const handleUp = (upEvent: PointerEvent) => {
      const dx = upEvent.clientX - origin.current.x;
      const dy = upEvent.clientY - origin.current.y;

      handlersRef.current.onDragEnd?.({
        dx,
        dy,
        clientX: upEvent.clientX,
        clientY: upEvent.clientY,
      });

      target.releasePointerCapture(e.pointerId);
      target.removeEventListener('pointermove', handleMove);
      target.removeEventListener('pointerup', handleUp);
      target.removeEventListener('pointercancel', handleUp);
    };

    target.addEventListener('pointermove', handleMove);
    target.addEventListener('pointerup', handleUp);
    target.addEventListener('pointercancel', handleUp);
  }, []);

  return startDrag;
}
