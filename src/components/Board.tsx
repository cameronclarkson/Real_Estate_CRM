'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { List } from './List';
import { AddListButton } from './AddListButton';
import { Card as CardType } from '@/lib/types';
import { Card } from './Card';
import { CardDetailModal } from './CardDetailModal';
import { useBoard } from '@/context/BoardContext';

export function Board() {
  const { board, moveCard, moveList } = useBoard();
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  // Update selectedCard when board changes to ensure modal shows latest data
  useEffect(() => {
    if (selectedCard) {
      for (const list of board.lists) {
        const updatedCard = list.cards.find((c) => c.id === selectedCard.id);
        if (updatedCard) {
          // Only update if the card actually changed
          if (JSON.stringify(updatedCard) !== JSON.stringify(selectedCard)) {
            setSelectedCard(updatedCard);
          }
          break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const listIds = board.lists.map((list) => list.id);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Find the card if it's being dragged
    for (const list of board.lists) {
      const card = list.cards.find((c) => c.id === active.id);
      if (card) {
        setActiveCard(card);
        return;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    // Handle list reordering
    if (active.id.toString().startsWith('list-')) {
      const activeIndex = listIds.indexOf(active.id as string);
      const overIndex = listIds.indexOf(over.id as string);
      if (activeIndex !== overIndex) {
        moveList(active.id as string, overIndex);
      }
      return;
    }

    // Handle card movement
    let activeCardData: CardType | null = null;
    let activeListId: string | null = null;

    for (const list of board.lists) {
      const card = list.cards.find((c) => c.id === active.id);
      if (card) {
        activeCardData = card;
        activeListId = list.id;
        break;
      }
    }

    if (!activeCardData || !activeListId) return;

    // Check if dropped on a list
    const targetList = board.lists.find((list) => list.id === over.id);
    if (targetList) {
      // Move to end of target list
      moveCard(activeCardData.id, activeListId, targetList.id, targetList.cards.length);
      return;
    }

    // Check if dropped on another card
    for (const list of board.lists) {
      const cardIndex = list.cards.findIndex((c) => c.id === over.id);
      if (cardIndex !== -1) {
        // Move to position of the target card
        moveCard(activeCardData.id, activeListId, list.id, cardIndex);
        return;
      }
    }
  };

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{board.title}</h1>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
              {board.lists.map((list) => (
                <List key={list.id} list={list} onCardClick={handleCardClick} />
              ))}
            </SortableContext>
            <AddListButton />
          </div>
          <DragOverlay>
            {activeCard ? (
              <div className="opacity-90">
                <Card card={activeCard} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={handleCloseModal} />
      )}
    </>
  );
}

