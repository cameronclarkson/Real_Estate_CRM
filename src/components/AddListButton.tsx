'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBoard } from '@/context/BoardContext';

export function AddListButton() {
  const { addList } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addList(title.trim());
      setTitle('');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 rounded-lg p-3 min-w-[272px] h-fit"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Add List
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
      className="bg-gray-200 hover:bg-gray-300 rounded-lg p-3 min-w-[272px] h-fit flex items-center gap-2 text-gray-700 font-medium transition-colors"
    >
      <Plus size={20} />
      Add another list
    </button>
  );
}

