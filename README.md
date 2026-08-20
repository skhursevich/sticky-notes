# Sticky Notes

A sticky-note board: create notes, drag and resize them, edit their text inline, and delete them by dropping them on the trash zone. State persists to `localStorage`, so the board survives a page reload.

## Stack

React + TypeScript + Vite, styled with Tailwind CSS.

## Architecture

The app is small, so the architecture stays intentionally flat:

- `App` renders a single top-level component, `Board`, which is the board itself.
- `Board` owns the list of notes through the `useNotes` hook (`src/hooks/useNotes.ts`) and passes callbacks (`addNote`, `updateNote`, `removeNote`, `bringToFront`) down to the toolbar and the notes as props.
- `StickyNote` is a presentational component for a single note; dragging and resizing are implemented with the `usePointerDrag` hook rather than a third-party DnD library.
- `api/storage.ts` is a thin persistence layer on top of `localStorage`; `useNotes` syncs it in a `useEffect` whenever the notes change.

## Why no state manager

All application state is a single array of notes, living in one place (`useNotes`) and consumed by one subtree of components. There's no state shared across distant parts of the tree and no complex async flows that would justify Redux, Zustand, Recoil, etc. `useState` plus props gives the same result with less code and less boilerplate. If the board grows more functionality (multiple boards, real-time sync, undo/redo history), that's the point to revisit this decision.

## Live demo

The app is deployed via GitHub Pages: https://skhursevich.github.io/sticky-notes/

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test
```

## Linting

If you are developing this further, the ESLint config already enables type-aware rules via `tseslint.configs.recommendedTypeChecked` (see `eslint.config.js`).