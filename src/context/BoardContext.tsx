'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Board, List, Card, Label, Comment } from '@/lib/types';
import { loadBoard, saveBoard, getDefaultBoard } from '@/lib/storage';

interface BoardContextType {
  board: Board;
  addList: (title: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  addCard: (listId: string, title: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, fromListId: string, toListId: string, newIndex: number) => void;
  moveList: (listId: string, newIndex: number) => void;
  addLabel: (cardId: string, label: Label) => void;
  removeLabel: (cardId: string, labelId: string) => void;
  addComment: (cardId: string, text: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  // Always start with the same default board to avoid hydration mismatch
  // This ensures server and client render the same initial HTML
  const [board, setBoard] = useState<Board>(() => getDefaultBoard());

  useEffect(() => {
    // Only load from localStorage after component mounts on client
    // This prevents hydration mismatch
    setBoard(loadBoard());
  }, []);

  const addList = useCallback((title: string) => {
    setBoard((prev) => {
      const newList: List = {
        id: `list-${Date.now()}`,
        title,
        cards: [],
      };
      const newBoard = {
        ...prev,
        lists: [...prev.lists, newList],
      };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  const updateListTitle = useCallback((listId: string, title: string) => {
    setBoard((prev) => {
      const newBoard = {
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId ? { ...list, title } : list
        ),
      };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  const deleteList = useCallback((listId: string) => {
    setBoard((prev) => {
      const newBoard = {
        ...prev,
        lists: prev.lists.filter((list) => list.id !== listId),
      };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  const addCard = useCallback((listId: string, title: string) => {
    setBoard((prev) => {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title,
        labels: [],
        comments: [],
        listId,
        createdAt: new Date().toISOString(),
      };
      const newBoard = {
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        ),
      };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  const updateCard = useCallback((cardId: string, updates: Partial<Card>) => {
    setBoard((prev) => {
      const newBoard = {
        ...prev,
        lists: prev.lists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId ? { ...card, ...updates } : card
          ),
        })),
      };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setBoard((prev) => {
      const newBoard = {
        ...prev,
        lists: prev.lists.map((list) => ({
          ...list,
          cards: list.cards.filter((card) => card.id !== cardId),
        })),
      };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  const moveCard = useCallback(
    (cardId: string, fromListId: string, toListId: string, newIndex: number) => {
      setBoard((prev) => {
        let cardToMove: Card | null = null;
        const listsWithoutCard = prev.lists.map((list) => {
          if (list.id === fromListId) {
            const card = list.cards.find((c) => c.id === cardId);
            if (card) {
              cardToMove = { ...card, listId: toListId };
              return {
                ...list,
                cards: list.cards.filter((c) => c.id !== cardId),
              };
            }
          }
          return list;
        });

        if (!cardToMove) return prev;

        const newBoard = {
          ...prev,
          lists: listsWithoutCard.map((list) => {
            if (list.id === toListId) {
              const newCards = [...list.cards];
              newCards.splice(newIndex, 0, cardToMove!);
              return { ...list, cards: newCards };
            }
            return list;
          }),
        };
        saveBoard(newBoard);
        return newBoard;
      });
    },
    []
  );

  const moveList = useCallback((listId: string, newIndex: number) => {
    setBoard((prev) => {
      const listIndex = prev.lists.findIndex((l) => l.id === listId);
      if (listIndex === -1) return prev;

      const newLists = [...prev.lists];
      const [movedList] = newLists.splice(listIndex, 1);
      newLists.splice(newIndex, 0, movedList);

      const newBoard = { ...prev, lists: newLists };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  const addLabel = useCallback((cardId: string, label: Label) => {
    setBoard((prev) => {
      const newBoard = {
        ...prev,
        lists: prev.lists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId
              ? { ...card, labels: [...card.labels, label] }
              : card
          ),
        })),
      };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  const removeLabel = useCallback((cardId: string, labelId: string) => {
    setBoard((prev) => {
      const newBoard = {
        ...prev,
        lists: prev.lists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId
              ? { ...card, labels: card.labels.filter((l) => l.id !== labelId) }
              : card
          ),
        })),
      };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  const addComment = useCallback((cardId: string, text: string) => {
    setBoard((prev) => {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
      };
      const newBoard = {
        ...prev,
        lists: prev.lists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId
              ? { ...card, comments: [...card.comments, newComment] }
              : card
          ),
        })),
      };
      saveBoard(newBoard);
      return newBoard;
    });
  }, []);

  return (
    <BoardContext.Provider
      value={{
        board,
        addList,
        updateListTitle,
        deleteList,
        addCard,
        updateCard,
        deleteCard,
        moveCard,
        moveList,
        addLabel,
        removeLabel,
        addComment,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}

