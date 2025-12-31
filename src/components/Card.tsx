'use client';

import { Card as CardType } from '@/lib/types';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export function Card({ card, onClick }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const displayTitle = card.address || card.title;
  const displayPrice = card.purchasePrice || card.askingPrice;
  const displayAcreage = card.acreage;

  const formatCurrency = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isOverdue =
    card.closingDate && new Date(card.closingDate) < new Date() && !card.closingDate.includes('T');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
    >
      {card.labels.length > 0 && (
        <div className="flex gap-1 mb-2 flex-wrap">
          {card.labels.map((label) => (
            <div
              key={label.id}
              className="h-2 rounded"
              style={{
                backgroundColor: label.color,
                minWidth: '40px',
              }}
              title={label.name}
            />
          ))}
        </div>
      )}
      <p className="text-sm font-semibold text-gray-800 mb-1">{displayTitle}</p>
      
      {(displayAcreage || displayPrice) && (
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          {displayAcreage && (
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              {displayAcreage} acres
            </span>
          )}
          {displayPrice && (
            <span className="flex items-center gap-1">
              <DollarSign size={10} />
              {formatCurrency(displayPrice)}
            </span>
          )}
        </div>
      )}

      {card.assignmentFee && (
        <div className="text-xs text-green-600 font-medium mb-1">
          Assignment: {formatCurrency(card.assignmentFee)}
        </div>
      )}

      {(card.closingDate || card.contractDate) && (
        <div
          className={`flex items-center gap-1 text-xs ${
            isOverdue ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          <Calendar size={12} />
          <span>
            {card.closingDate
              ? `Closing: ${new Date(card.closingDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}`
              : card.contractDate
              ? `Contract: ${new Date(card.contractDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}`
              : null}
          </span>
        </div>
      )}
    </div>
  );
}

