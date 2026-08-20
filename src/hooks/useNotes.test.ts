import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useNotes } from './useNotes';

describe('useNotes', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts with an empty board', () => {
    const { result } = renderHook(() => useNotes());
    expect(result.current.notes).toEqual([]);
  });

  it('adds a note at the given position and size', () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.addNote({ x: 10, y: 20, width: 200, height: 150 }, 'yellow');
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0]).toMatchObject({
      x: 10,
      y: 20,
      width: 200,
      height: 150,
      color: 'yellow',
    });
  });

  it('moves a note by updating its position', () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.addNote({ x: 0, y: 0, width: 200, height: 150 }, 'yellow');
    });
    const id = result.current.notes[0].id;

    act(() => {
      result.current.updateNote(id, { x: 50, y: 75 });
    });

    expect(result.current.notes[0]).toMatchObject({ x: 50, y: 75 });
  });

  it('removes a note', () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.addNote({ x: 0, y: 0, width: 200, height: 150 }, 'yellow');
    });
    const id = result.current.notes[0].id;

    act(() => {
      result.current.removeNote(id);
    });

    expect(result.current.notes).toHaveLength(0);
  });

  it('bringToFront gives a note the highest zIndex', () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.addNote({ x: 0, y: 0, width: 200, height: 150 }, 'yellow');
      result.current.addNote({ x: 0, y: 0, width: 200, height: 150 }, 'pink');
    });
    const [first, second] = result.current.notes;
    expect(first.zIndex).toBeLessThan(second.zIndex);

    act(() => {
      result.current.bringToFront(first.id);
    });

    const updatedFirst = result.current.notes.find((note) => note.id === first.id)!;
    expect(updatedFirst.zIndex).toBeGreaterThan(second.zIndex);
  });
});
