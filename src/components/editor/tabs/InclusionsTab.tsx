import React, { useState } from 'react';
import { STANDARD_INCLUSIONS_LIBRARY } from '../../../data/mockProposals';
import { 
  Trash2, 
  Check, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  X 
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

  const standardExclusionsPreset = [
    'International airfare, airport taxes & visa fees (unless specifically itemized)',
    'City tourist taxes & local municipal fees paid directly at hotel check-in',
    'Personal expenses: laundry, telephone calls, mini-bar, and room service',
    'Early check-in & late check-out charges subject to hotel availability',
    'Travel, medical & luggage cancellation insurance',
    'Tips, gratuities to drivers, local guides, and restaurant staff',
    'Any services or meals not explicitly listed under package inclusions'
  ];

  const handleLoadStandardPreset = () => {
    // Load standard inclusions that aren't already included
    const mergedInclusions = Array.from(new Set([...inclusions, ...STANDARD_INCLUSIONS_LIBRARY]));
    const mergedExclusions = Array.from(new Set([...exclusions, ...standardExclusionsPreset]));
    onInclusionsChange(mergedInclusions);
    onExclusionsChange(mergedExclusions);
    if (onShowToast) {
      onShowToast('success', 'Preset Pack Loaded', `Loaded ${mergedInclusions.length} standard inclusions and ${mergedExclusions.length} exclusions.`);
    }
  };

  const handleAddNewItem = () => {
    if (!newItemText.trim()) return;
    const text = newItemText.trim();
    if (activeSegment === 'inclusions') {
      if (!inclusions.includes(text)) {
        onInclusionsChange([...inclusions, text]);
      }
    } else {
      if (!exclusions.includes(text)) {
        onExclusionsChange([...exclusions, text]);
      }
    }
    setNewItemText('');
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
      <div className="bg-white rounded-xl border border-[rgba(55,53,47,0.09)] p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-semibold text-[#37352F]">
              Inclusions & Exclusions Policy
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="rounded-md bg-[#2383E2]/10 border border-[#2383E2]/20 text-[#2383E2] text-[12px] font-medium px-2 py-0.5 tabular-nums">
                {inclusions.length} Included
              </span>
              <span className="rounded-md bg-[#F7F7F5] border border-[rgba(55,53,47,0.08)] text-[#787774] text-[12px] font-medium px-2 py-0.5 tabular-nums">
                {exclusions.length} Excluded
              </span>
            </div>
          </div>
          <p className="text-[13px] text-[#787774] mt-0.5">
            Explicit contractual deliverables and policy terms rendered on Page 4 of the proposal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadStandardPreset}
          className="tactile-button-ai h-10 px-3.5 rounded-lg text-[13.5px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2383E2]" />
          <span>Load Standard Preset Pack</span>
        </button>
      </div>

      {/* 2. Unified Inclusions / Exclusions Card with Segmented Switcher & Single Quick-Add Bar */}
      <div className="bg-white rounded-xl border border-[rgba(55,53,47,0.09)] shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
        {/* Top Control Bar: Segmented Tab Switcher */}
        <div className="px-4 py-3 bg-[#F7F7F5] border-b border-[rgba(55,53,47,0.09)] flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex bg-[#EFECE6]/80 p-1 rounded-lg border border-[rgba(55,53,47,0.08)]">
            <button
              type="button"
              onClick={() => setActiveSegment('inclusions')}
              className={`px-4 py-1.5 text-[13px] rounded-md transition-all duration-150 cursor-pointer font-medium flex items-center gap-1.5 active:scale-95 ${
                activeSegment === 'inclusions'
                  ? 'bg-white text-[#37352F] font-semibold shadow-[0_1px_2px_rgba(15,15,15,0.06)]'
                  : 'text-[#787774] hover:text-[#37352F]'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
              <span>What's Included ({inclusions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSegment('exclusions')}
              className={`px-4 py-1.5 text-[13px] rounded-md transition-all duration-150 cursor-pointer font-medium flex items-center gap-1.5 active:scale-95 ${
                activeSegment === 'exclusions'
                  ? 'bg-white text-[#37352F] font-semibold shadow-[0_1px_2px_rgba(15,15,15,0.06)]'
                  : 'text-[#787774] hover:text-[#37352F]'
              }`}
            >
              <X className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
              <span>What's Excluded ({exclusions.length})</span>
            </button>
          </div>

          <span className="text-[12px] text-[#9B9A97]">
            {activeSegment === 'inclusions' ? 'Contractually provided items' : 'Items not covered in price'}
          </span>
        </div>

        {/* Single Quick-Add Input Bar */}
        <div className="p-4 border-b border-[rgba(55,53,47,0.08)] bg-[#F7F7F5]/50">
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
                  ? 'Type inclusion item and press Enter (e.g. VIP helicopter transfer, private museum tour)...'
                  : 'Type exclusion item and press Enter (e.g. City tourist taxes, travel insurance)...'
              }
              className="flex-1 h-10 px-3.5 text-[14px] bg-white border border-[rgba(55,53,47,0.12)] focus:border-[#2383E2] focus:ring-3 focus:ring-[#2383E2]/15 rounded-lg text-[#37352F] placeholder-[#9B9A97] shadow-[0_1px_2px_rgba(15,15,15,0.04)] outline-none transition-all"
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
              <div className="py-8 text-center text-[#9B9A97] text-[13.5px]">
                No inclusions added yet. Click "Load Standard Preset Pack" or type an item above.
              </div>
            ) : (
              <div className="divide-y divide-[rgba(55,53,47,0.06)] border border-[rgba(55,53,47,0.08)] rounded-lg overflow-hidden bg-white">
                {inclusions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#F7F7F5]/60 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-4.5 h-4.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-[14px] text-[#37352F] font-medium leading-snug">
                        {item}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeInclusion(idx)}
                      className="p-1 rounded-md text-[#9B9A97] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer shrink-0"
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
              <div className="py-8 text-center text-[#9B9A97] text-[13.5px]">
                No exclusions added yet. Click "Load Standard Preset Pack" or type an exclusion above.
              </div>
            ) : (
              <div className="divide-y divide-[rgba(55,53,47,0.06)] border border-[rgba(55,53,47,0.08)] rounded-lg overflow-hidden bg-white">
                {exclusions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#F7F7F5]/60 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-4.5 h-4.5 rounded-md bg-red-50 border border-red-200/60 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-[14px] text-[#37352F] font-medium leading-snug">
                        {item}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExclusion(idx)}
                      className="p-1 rounded-md text-[#9B9A97] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer shrink-0"
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
