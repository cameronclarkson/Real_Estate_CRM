'use client';

import { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, X } from 'lucide-react';
import { List as ListType, Card as CardType } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './Card';
import { AddCardButton } from './AddCardButton';
import { useBoard } from '@/context/BoardContext';

interface ListProps {
  list: ListType;
  onCardClick: (card: CardType) => void;
}

export function List({ list, onCardClick }: ListProps) {
  const { updateListTitle, deleteList } = useBoard();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync title with list prop when it changes externally
  useEffect(() => {
    if (!isEditingTitle) {
      setTitle(list.title);
    }
  }, [list.title, isEditingTitle]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardIds = list.cards.map((card) => card.id);

  const handleTitleBlur = () => {
    if (title.trim()) {
      updateListTitle(list.id, title.trim());
    } else {
      setTitle(list.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-200 rounded-lg p-3 min-w-[272px] h-fit max-h-[calc(100vh-120px)] flex flex-col"
    >
      <div
        className="flex items-center justify-between mb-3"
        {...(!isEditingTitle ? { ...attributes, ...listeners } : {})}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="flex-1 px-2 py-1 font-semibold bg-white border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <>
            <h3
              className="flex-1 font-semibold text-gray-800 cursor-pointer px-2 py-1 hover:bg-gray-300 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
            >
              {list.title}
            </h3>
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 hover:bg-gray-300 rounded text-gray-600"
              >
                <MoreHorizontal size={18} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white rounded shadow-lg border border-gray-200 z-10 min-w-[150px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this list?')) {
                        deleteList(list.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                  >
                    <X size={16} />
                    Delete List
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto mb-2">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>
      </div>

      <AddCardButton listId={list.id} />
    </div>
  );
}

