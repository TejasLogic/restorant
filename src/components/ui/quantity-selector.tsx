import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from './button';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 10,
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="quantity"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="hover:bg-primary hover:text-primary-foreground"
      >
        <Minus className="h-3 w-3" />
      </Button>
      
      <span className="min-w-[2rem] text-center font-semibold text-lg">
        {quantity}
      </span>
      
      <Button
        variant="quantity"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="hover:bg-primary hover:text-primary-foreground"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};