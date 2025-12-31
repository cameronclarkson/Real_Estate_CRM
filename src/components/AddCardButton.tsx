'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBoard } from '@/context/BoardContext';

interface AddCardButtonProps {
  listId: string;
}

export function AddCardButton({ listId }: AddCardButtonProps) {
  const { addCard } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addCard(listId, title.trim());
      setTitle('');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="mt-2">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter property address or deal title..."
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          autoFocus
          onBlur={() => {
            if (!title.trim()) {
              setIsEditing(false);
            }
          }}
        />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Card
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setTitle('');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="w-full mt-2 p-2 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
    >
      <Plus size={16} />
      Add a card
    </button>
  );
}

