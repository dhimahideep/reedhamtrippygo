import React, { useState } from 'react';
import { StayProperty } from '../../../types/proposal';
import { MEAL_PLAN_MAP } from '../../../data/formatters';
import { StayModal } from './StayModal';
import { 
  Building2, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Star 
} from 'lucide-react';

interface StaysTabProps {
  stays: StayProperty[];
  onChange: (stays: StayProperty[]) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const StaysTab: React.FC<StaysTabProps> = ({ 
  stays, 
  onChange,
  onNext,
  onBack 
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStay, setEditingStay] = useState<StayProperty | null>(null);

  const handleOpenAdd = () => {
    setEditingStay(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (stay: StayProperty) => {
    setEditingStay(stay);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    onChange(stays.filter(s => s.id !== id));
  };

  const handleSaveStay = (savedStay: StayProperty) => {
    const exists = stays.some(s => s.id === savedStay.id);
    if (exists) {
      onChange(stays.map(s => (s.id === savedStay.id ? savedStay : s)));
    } else {
      onChange([...stays, savedStay]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* 1. Header Toolbar Card: ONLY ONE PRIMARY BUTTON */}
      <div className="bg-white rounded-xl border border-[rgba(55,53,47,0.09)] p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-semibold text-[#37352F]">
              Accommodations & Board Plans
            </h2>
            <span className="rounded-md bg-[#F7F7F5] border border-[rgba(55,53,47,0.08)] text-[#787774] text-[12px] font-medium px-2 py-0.5 tabular-nums">
              {stays.length} {stays.length === 1 ? 'Property' : 'Properties'}
            </span>
          </div>
          <p className="text-[13px] text-[#787774] mt-0.5">
            Properties configured here render under Confirmed Accommodations on Page 3 of the proposal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="tactile-button-primary h-10 px-4 rounded-lg text-[13.5px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
          <span>Add Stay</span>
        </button>
      </div>

      {/* 2. Chronological List Card */}
      <div className="bg-white rounded-xl border border-[rgba(55,53,47,0.09)] shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
        <div className="px-4 py-3 bg-[#F7F7F5] border-b border-[rgba(55,53,47,0.09)] flex items-center justify-between">
          <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-[#787774]">
            Confirmed Properties Itinerary
          </h3>
          <span className="text-[12px] text-[#9B9A97]">
            Chronological stay order
          </span>
        </div>

        {stays.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Building2 className="w-8 h-8 text-[#9B9A97]/40 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-[14.5px] font-semibold text-[#37352F]">
              No accommodations configured yet
            </p>
            <p className="text-[12.5px] text-[#9B9A97] mt-1 max-w-sm mx-auto">
              Click "Add Stay" to configure hotels, resorts, and meal plans for this itinerary.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(55,53,47,0.06)]">
            {stays.map((stay) => {
              const rangeText = stay.nightRangeStart === stay.nightRangeEnd
                ? `Night ${stay.nightRangeStart}`
                : `Nights ${stay.nightRangeStart}–${stay.nightRangeEnd}`;
              const plan = MEAL_PLAN_MAP[stay.mealPlan];

              return (
                <div
                  key={stay.id}
                  className="px-4 py-3.5 hover:bg-[#F7F7F5]/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left: Night range badge, Hotel & City, Room Category, Meal Plan */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2.5 py-1 rounded-md bg-[#2383E2] text-white text-[12px] font-semibold tabular-nums shrink-0 shadow-[0_1px_2px_rgba(35,131,226,0.25)]">
                        {rangeText}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[15px] font-semibold text-[#37352F] truncate">
                            {stay.hotelName}
                          </span>
                          <span className="text-[13px] text-[#787774] font-medium">
                            • {stay.city}
                          </span>
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: stay.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-[12.5px] text-[#787774] flex-wrap">
                          <span className="text-[#37352F] font-medium">{stay.roomCategory}</span>
                          <span>•</span>
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded-md bg-[#F7F7F5] border border-[rgba(55,53,47,0.08)] text-[11.5px] font-semibold text-[#37352F]">
                            {stay.mealPlan}: {plan?.name || stay.mealPlan}
                          </span>
                          <span className="tabular-nums">({stay.nights} {stay.nights === 1 ? 'Night' : 'Nights'})</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(stay)}
                        className="tactile-button-secondary h-7 px-2.5 rounded-lg text-[12px] font-medium cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(stay.id)}
                        className="p-1.5 rounded-md text-[#9B9A97] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete property"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>

                  {/* Notes / Special Privileges */}
                  {stay.notes && (
                    <div className="mt-2 text-[12px] text-[#787774] bg-[#F7F7F5] border border-[rgba(55,53,47,0.06)] px-3 py-1.5 rounded-lg">
                      <span className="font-semibold text-[#37352F]">Privileges:</span> {stay.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Centered Stay Modal */}
      <StayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        stay={editingStay}
        onSave={handleSaveStay}
      />

      {/* STEP PROGRESSION FOOTER */}
      <div className="pt-2 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="tactile-button-secondary inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-[13.5px] font-medium cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back: Flights</span>
          </button>
        ) : <div />}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="tactile-button-primary inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-[13.5px] font-medium cursor-pointer whitespace-nowrap"
          >
            <span>Save & Continue to Days</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
