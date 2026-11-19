import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface InclusionsTabProps {
  inclusions: string[];
  exclusions: string[];
  onInclusionsChange: (inclusions: string[]) => void;
  onExclusionsChange: (exclusions: string[]) => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

const DEFAULT_STANDARD_INCLUSIONS = [
  'Handpicked luxury hotel accommodations with daily buffet gourmet breakfast',
  'Private escorted airport round-trip transfers in executive Mercedes-Benz sedans',
  'All intercity express high-speed rail transfers in 1st class panoramic coaches',
  'Certified English-speaking private historian guide for all scheduled cultural excursions',
  'Skip-the-line VIP priority entrance tickets to all itinerary monuments and palaces',
  'All municipal tourism city taxes, road tolls, fuel surcharges, and parking permits',
  '24/7 dedicated personal concierge support and private emergency assistance throughout travel',
];

const DEFAULT_STANDARD_EXCLUSIONS = [
  'International commercial airfare & airport taxes (unless bundled in commercial quotation)',
  'Personal expenses, mini-bar consumption, telephone calls, and room laundry services',
  'Optional supplementary excursions not explicitly cited in the confirmed daily itinerary',
  'Overseas comprehensive travel medical insurance with trip cancellation coverage',
  'Customary gratuities and tips for private chauffeurs, guides, and hotel porterage',
  'Standard visa application processing fees and biometric document procurement',
];

export const InclusionsTab: React.FC<InclusionsTabProps> = ({
  inclusions,
  exclusions,
  onInclusionsChange,
  onExclusionsChange,
  onShowToast,
  onNext,
  onBack,
}) => {
  const [activeSegment, setActiveSegment] = useState<'inclusions' | 'exclusions'>('inclusions');
  const [newItemText, setNewItemText] = useState('');

  const handleAddNewItem = () => {
    if (!newItemText.trim()) return;
    const text = newItemText.trim();
    if (activeSegment === 'inclusions') {
      onInclusionsChange([...inclusions, text]);
    } else {
      onExclusionsChange([...exclusions, text]);
    }
    setNewItemText('');
  };

  const handleLoadStandardPreset = () => {
    onInclusionsChange(DEFAULT_STANDARD_INCLUSIONS);
    onExclusionsChange(DEFAULT_STANDARD_EXCLUSIONS);
    if (onShowToast) {
      onShowToast('success', 'Preset Policy Pack Applied', 'Loaded standard luxury agency inclusions & exclusions terms.');
    }
  };

  const removeInclusion = (index: number) => {
    onInclusionsChange(inclusions.filter((_, idx) => idx !== index));
  };

  const removeExclusion = (index: number) => {
    onExclusionsChange(exclusions.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* 1. Header Toolbar Card: Single Load Standard Policy Preset Button */}
      <div className="bg-white rounded-xl border border-black/[0.08] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-semibold text-[#1D1D1F] tracking-tight">
              Inclusions & Exclusions Policy
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="rounded-md bg-[#1D1D1F] text-white text-[12px] font-medium px-2 py-0.5 tabular-nums">
                {inclusions.length} Included
              </span>
              <span className="rounded-md bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] text-[12px] font-medium px-2 py-0.5 tabular-nums">
                {exclusions.length} Excluded
              </span>
            </div>
          </div>
          <p className="text-[13px] text-[#6E6E73] mt-0.5 font-medium">
            Explicit contractual deliverables and policy terms rendered on Page 4 of the proposal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadStandardPreset}
          className="tactile-button-ai h-10 px-3.5 rounded-lg text-[13.5px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1D1D1F]" />
          <span>Load Standard Preset Pack</span>
        </button>
      </div>

      {/* 2. Unified Inclusions / Exclusions Card with Segmented Switcher & Single Quick-Add Bar */}
      <div className="bg-white rounded-xl border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Top Control Bar: Segmented Tab Switcher */}
        <div className="px-4 py-3 bg-[#F5F5F7] border-b border-black/[0.08] flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex bg-[#E5E5EA]/70 p-1 rounded-lg border border-black/[0.06]">
            <button
              type="button"
              onClick={() => setActiveSegment('inclusions')}
              className={`px-4 py-1.5 text-[13px] rounded-md transition-all duration-150 cursor-pointer font-medium flex items-center gap-1.5 active:scale-95 ${
                activeSegment === 'inclusions'
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-[#1D1D1F]" strokeWidth={2.5} />
              <span>What's Included ({inclusions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSegment('exclusions')}
              className={`px-4 py-1.5 text-[13px] rounded-md transition-all duration-150 cursor-pointer font-medium flex items-center gap-1.5 active:scale-95 ${
                activeSegment === 'exclusions'
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <X className="w-3.5 h-3.5 text-[#6E6E73]" strokeWidth={2.5} />
              <span>What's Excluded ({exclusions.length})</span>
            </button>
          </div>

          <span className="text-[12px] text-[#86868B] font-medium">
            Active view: {activeSegment === 'inclusions' ? 'What is Included' : 'What is Excluded'}
          </span>
        </div>

        {/* Quick-Add Single Input Bar */}
        <div className="p-4 bg-white border-b border-black/[0.08]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddNewItem();
                }
              }}
              placeholder={
                activeSegment === 'inclusions'
                  ? 'Type inclusion item and press Enter (e.g. Private airport transfer, breakfast included)...'
                  : 'Type exclusion item and press Enter (e.g. City tourist taxes, travel insurance)...'
              }
              className="flex-1 h-10 px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 rounded-lg text-[#1D1D1F] placeholder-[#86868B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all font-medium"
            />
            <button
              type="button"
              onClick={handleAddNewItem}
              className="tactile-button-primary h-10 px-4 rounded-lg text-[13.5px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="p-4">
          {activeSegment === 'inclusions' ? (
            inclusions.length === 0 ? (
              <div className="py-8 text-center text-[#86868B] text-[13.5px]">
                No inclusions added yet. Click "Load Standard Preset Pack" or type an item above.
              </div>
            ) : (
              <div className="divide-y divide-black/[0.06] border border-black/[0.08] rounded-lg overflow-hidden bg-white">
                {inclusions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#F5F5F7]/70 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-4.5 h-4.5 rounded-md bg-[#1D1D1F] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-[14px] text-[#1D1D1F] font-medium leading-snug">
                        {item}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeInclusion(idx)}
                      className="p-1 rounded-md text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5 transition-colors cursor-pointer shrink-0"
                      title="Remove inclusion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            exclusions.length === 0 ? (
              <div className="py-8 text-center text-[#86868B] text-[13.5px]">
                No exclusions added yet. Click "Load Standard Preset Pack" or type an exclusion above.
              </div>
            ) : (
              <div className="divide-y divide-black/[0.06] border border-black/[0.08] rounded-lg overflow-hidden bg-white">
                {exclusions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#F5F5F7]/70 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-4.5 h-4.5 rounded-md bg-[#F5F5F7] border border-[#D2D2D7] text-[#6E6E73] flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-[14px] text-[#1D1D1F] font-medium leading-snug">
                        {item}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExclusion(idx)}
                      className="p-1 rounded-md text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5 transition-colors cursor-pointer shrink-0"
                      title="Remove exclusion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* STEP PROGRESSION FOOTER */}
      <div className="pt-2 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="tactile-button-secondary inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-[13.5px] font-medium cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back: Days</span>
          </button>
        ) : <div />}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="tactile-button-primary inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-[13.5px] font-medium cursor-pointer whitespace-nowrap"
          >
            <span>Save & Continue to Pricing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
