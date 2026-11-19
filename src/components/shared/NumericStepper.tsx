import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface NumericStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labelFormat?: (val: number) => React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const NumericStepper: React.FC<NumericStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  labelFormat,
  className = '',
  disabled = false,
}) => {
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canDecrement) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canIncrement) {
      onChange(Math.min(max, value + step));
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-between bg-white border border-[#D2D2D7] rounded-lg p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] min-w-[132px] h-10 select-none ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={!canDecrement}
        className="w-8 h-8 rounded-[6px] bg-[#1D1D1F] hover:bg-[#000000] active:scale-95 text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shrink-0"
        title="Decrease"
        aria-label="Decrease value"
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>

      <span className="px-3 text-[15px] font-semibold text-[#1D1D1F] tabular-nums select-none text-center flex-1 truncate">
        {labelFormat ? labelFormat(value) : value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={!canIncrement}
        className="w-8 h-8 rounded-[6px] bg-[#1D1D1F] hover:bg-[#000000] active:scale-95 text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shrink-0"
        title="Increase"
        aria-label="Increase value"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};
