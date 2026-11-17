import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface NotionSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface NotionSelectProps {
  value: string;
  options: NotionSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
}

export const NotionSelect: React.FC<NotionSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Select an option...',
  className = '',
  buttonClassName = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-10 w-full px-3.5 rounded-lg bg-[#F7F7F5]/80 hover:bg-[#F1F1EF] border border-[rgba(55,53,47,0.12)] focus:border-[#2383E2] focus:bg-white focus:ring-2 focus:ring-[#2383E2]/15 flex items-center justify-between text-[14px] text-[#37352F] cursor-pointer transition-all duration-150 select-none shadow-[0_1px_2px_rgba(15,15,15,0.02)] ${buttonClassName}`}
      >
        <span className={`truncate font-medium ${selectedOption ? 'text-[#37352F]' : 'text-[#9B9A97]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#787774] shrink-0 transition-transform duration-150 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 min-w-full w-max max-w-xs sm:max-w-md rounded-xl bg-white border border-[rgba(55,53,47,0.12)] shadow-[0_8px_24px_rgba(15,15,15,0.12)] p-1 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 text-[13.5px] rounded-md flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#F7F7F5] text-[#2383E2] font-semibold'
                    : 'text-[#37352F] hover:bg-[#F7F7F5] font-medium'
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate">{option.label}</div>
                  {option.description && (
                    <div className="text-[11.5px] text-[#787774] font-normal truncate">
                      {option.description}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#2383E2] shrink-0 ml-2" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
