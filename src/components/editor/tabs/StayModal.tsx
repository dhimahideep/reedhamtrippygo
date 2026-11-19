import React, { useState, useEffect } from 'react';
import { StayProperty, MealPlanCode } from '../../../types/proposal';
import { MEAL_PLAN_MAP } from '../../../data/formatters';
import { NumericStepper } from '../../shared/NumericStepper';
import { X, Star } from 'lucide-react';

interface StayModalProps {
  isOpen: boolean;
  onClose: () => void;
  stay: StayProperty | null;
  onSave: (stay: StayProperty) => void;
}

export const StayModal: React.FC<StayModalProps> = ({
  isOpen,
  onClose,
  stay,
  onSave,
}) => {
  const [formData, setFormData] = useState<StayProperty>({
    id: '',
    hotelName: '',
    city: '',
    rating: 5,
    roomCategory: 'Deluxe Room',
    mealPlan: 'CP',
    nightRangeStart: 1,
    nightRangeEnd: 3,
    nights: 3,
    notes: '',
  });

  useEffect(() => {
    if (stay) {
      setFormData(stay);
    } else {
      setFormData({
        id: 'stay-' + Date.now(),
        hotelName: 'Four Seasons Hotel',
        city: 'Baku',
        rating: 5,
        roomCategory: 'Deluxe Caspian Sea View Room',
        mealPlan: 'CP',
        nightRangeStart: 1,
        nightRangeEnd: 3,
        nights: 3,
        notes: 'Complimentary luxury airport transfer. Early check-in requested.',
      });
    }
  }, [stay, isOpen]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleNightsChange = (val: number) => {
    const nights = Math.max(1, val);
    setFormData(prev => ({
      ...prev,
      nights,
      nightRangeEnd: prev.nightRangeStart + nights - 1,
    }));
  };

  const handleStartNightChange = (val: number) => {
    const start = Math.max(1, val);
    setFormData(prev => ({
      ...prev,
      nightRangeStart: start,
      nightRangeEnd: start + prev.nights - 1,
    }));
  };

  const mealPlans: MealPlanCode[] = ['EP', 'CP', 'MAP', 'AP'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-md transition-opacity duration-200 select-none animate-in fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      {/* Centered Modal Card */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-xl border border-black/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.16)] overflow-hidden z-10 transition-all duration-200 ease-out animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-black/[0.08] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1D1D1F] tracking-tight">
              {stay ? 'Edit Hotel Stay' : 'Add Hotel Accommodation'}
            </h2>
            <p className="text-[12.5px] text-[#6E6E73] mt-0.5 font-medium">
              Properties configured here render under Confirmed Accommodations on Page 3.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Form Body */}
        <form id="stay-modal-form" onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Hotel Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                Hotel / Resort Name
              </label>
              <input
                type="text"
                value={formData.hotelName}
                onChange={(e) => setFormData(prev => ({ ...prev, hotelName: e.target.value }))}
                placeholder="e.g. Four Seasons Hotel Baku"
                required
                className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 rounded-lg text-[#1D1D1F] font-semibold transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                City / Destination
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g. Baku"
                required
                className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 rounded-lg text-[#1D1D1F] font-semibold transition-all outline-none"
              />
            </div>
          </div>

          {/* Room Category & Star Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                Room Category
              </label>
              <input
                type="text"
                value={formData.roomCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, roomCategory: e.target.value }))}
                placeholder="e.g. Deluxe Caspian Sea View Suite"
                required
                className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 rounded-lg text-[#1D1D1F] transition-all outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                Star Rating
              </label>
              <div className="flex items-center gap-1.5 h-10 px-1.5 bg-[#F5F5F7] border border-[#D2D2D7] rounded-lg">
                {[3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: stars }))}
                    className={`flex-1 h-7.5 rounded-md text-[12.5px] font-medium transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 active:scale-95 ${
                      formData.rating === stars
                        ? 'bg-[#1D1D1F] text-white font-bold shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <span>{stars}</span>
                    <Star className={`w-3.5 h-3.5 ${formData.rating === stars ? 'fill-white text-white' : 'fill-[#1D1D1F] text-[#1D1D1F]'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Night Range & Duration */}
          <div className="p-3.5 bg-[#F5F5F7] rounded-xl border border-black/[0.08] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#6E6E73]">
                Stay Duration & Schedule
              </span>
              <span className="text-[12px] font-medium text-[#1D1D1F] tabular-nums bg-white px-2 py-0.5 rounded-md border border-[#D2D2D7] shadow-2xs">
                {formData.nightRangeStart === formData.nightRangeEnd
                  ? `Night ${formData.nightRangeStart}`
                  : `Nights ${formData.nightRangeStart}–${formData.nightRangeEnd}`}{' '}
                ({formData.nights} {formData.nights === 1 ? 'Night' : 'Nights'})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                  Starting on Night #
                </label>
                <NumericStepper
                  value={formData.nightRangeStart}
                  min={1}
                  onChange={handleStartNightChange}
                  labelFormat={(v) => `Night ${v}`}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                  Total Nights at Property
                </label>
                <NumericStepper
                  value={formData.nights}
                  min={1}
                  onChange={handleNightsChange}
                  labelFormat={(v) => `${v} ${v === 1 ? 'Night' : 'Nights'}`}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Meal Plan Segmented Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-medium text-[#1D1D1F]">
                Meal Plan (Board Arrangement)
              </label>
              <span className="text-[12px] text-[#6E6E73] font-medium">
                {MEAL_PLAN_MAP[formData.mealPlan]?.name} ({MEAL_PLAN_MAP[formData.mealPlan]?.desc})
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 bg-[#E5E5EA]/70 p-1 rounded-lg border border-black/[0.06]">
              {mealPlans.map((code) => {
                const isSelected = formData.mealPlan === code;
                const plan = MEAL_PLAN_MAP[code];
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, mealPlan: code }))}
                    className={`py-2 px-1 text-center rounded-md transition-all duration-150 cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-white text-[#1D1D1F] font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F] font-medium'
                    }`}
                  >
                    <div className="text-[13px]">{code}</div>
                    <div className="text-[10.5px] truncate text-[#86868B]">{plan?.name.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes & Amenities */}
          <div>
            <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
              Special Privileges & Amenities <span className="text-[#86868B] font-normal">(Printed on PDF)</span>
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Complimentary private car transfer from station. Spa access and panoramic view room."
              className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 rounded-lg text-[#1D1D1F] resize-none outline-none transition-all font-medium"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#F5F5F7] border-t border-black/[0.08] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="tactile-button-secondary h-10 px-4 rounded-lg text-[13.5px] font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="stay-modal-form"
            className="tactile-button-primary h-10 px-5 rounded-lg text-[13.5px] font-medium"
          >
            Save Property
          </button>
        </div>
      </div>
    </div>
  );
};
