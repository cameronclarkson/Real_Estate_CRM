'use client';

import { BoardProvider } from '@/context/BoardContext';
import { Board } from '@/components/Board';

export default function Home() {
  return (
    <BoardProvider>
      <Board />
    </BoardProvider>
  );
}

