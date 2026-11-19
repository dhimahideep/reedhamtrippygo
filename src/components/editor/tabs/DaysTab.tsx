import React, { useState } from 'react';
import { ItineraryDay, StayProperty } from '../../../types/proposal';
import { 
  Plus, 
  Trash2, 
  Building2, 
  X, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface DaysTabProps {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
  stays: StayProperty[];
  destinations: string[];
  nights?: number;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const DaysTab: React.FC<DaysTabProps> = ({
  days,
  onChange,
  stays,
  destinations,
  nights,
  onShowToast,
  onNext,
  onBack,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [newHighlight, setNewHighlight] = useState('');

  const currentDay = days[activeDayIndex] || days[0];

  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const dest = destinations[0] || 'Destination';
    const newDay: ItineraryDay = {
      dayNumber: nextDayNum,
      title: `Day in ${dest} — Leisure & Curated Sightseeing`,
      description: `Enjoy a private morning guided tour followed by an afternoon at leisure exploring local historical landmarks and artisanal boutiques.`,
      overnightStay: stays[0]?.hotelName ? `${stays[0].hotelName}, ${stays[0].city}` : `${dest} Hotel`,
      highlights: ['Private Sightseeing', 'Cultural Landmarks', 'Evening at Leisure']
    };
    const updated = [...days, newDay];
    onChange(updated);
    setActiveDayIndex(updated.length - 1);
  };

  const handleDeleteDay = (indexToDelete: number) => {
    if (days.length <= 1) return;
    const filtered = days.filter((_, idx) => idx !== indexToDelete);
    const renumbered = filtered.map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    onChange(renumbered);
    setActiveDayIndex(Math.max(0, indexToDelete - 1));
  };

  const handleUpdateCurrentDay = (partial: Partial<ItineraryDay>) => {
    const updated = days.map((d, idx) => {
      if (idx === activeDayIndex) {
        return { ...d, ...partial };
      }
      return d;
    });
    onChange(updated);
  };

  const handleCraftAllDays = () => {
    const totalDays = Math.max(days.length, (nights || 5) + 1);
    const primaryDest = destinations[0] || 'Baku';
    const secondaryDest = destinations[1] || primaryDest;

    const generatedDays: ItineraryDay[] = Array.from({ length: totalDays }).map((_, idx) => {
      const dayNumber = idx + 1;
      const isFirstDay = dayNumber === 1;
      const isLastDay = dayNumber === totalDays;
      const activeDest = dayNumber > Math.ceil(totalDays / 2) && destinations.length > 1 ? secondaryDest : primaryDest;

      // Find matched stay for this day
      const matched = stays.find(
        s => dayNumber >= s.nightRangeStart && dayNumber <= s.nightRangeEnd
      );
      const hotelDesc = matched ? `${matched.hotelName}, ${matched.city}` : `${activeDest} Luxury Hotel`;

      if (isFirstDay) {
        return {
          dayNumber,
          title: `Arrival in ${primaryDest} — VIP Airport Welcome & Skyline Sunset`,
          description: `Arrive at the international airport terminal. Clear priority expedited customs and meet your private chauffeur for an escorted transfer to your luxury property in a Mercedes-Benz executive sedan. Evening at leisure with welcome cocktails overlooking the illuminated skyline.`,
          overnightStay: hotelDesc,
          highlights: ['VIP Airport Meet & Greet', 'Private Chauffeur Transfer', 'Welcome Cocktail Reception']
        };
      }

      if (isLastDay) {
        return {
          dayNumber,
          title: `Farewell ${primaryDest} — Private Chauffeur Airport Transfer`,
          description: `Enjoy an indulgent breakfast at your hotel followed by late check-out privileges. Enjoy morning souvenir shopping at local artisanal boutiques before your chauffeur escorts you to the departure terminal for your scheduled flight home.`,
          overnightStay: 'Return Flight Sector',
          highlights: ['Gourmet Breakfast', 'Late Check-out Privileges', 'Private Airport Chauffeur']
        };
      }

      return {
        dayNumber,
        title: `Curated Discovery of ${activeDest} — Private Guided Exploration`,
        description: `Full-day bespoke excursion with an English-speaking certified private historian. Discover ancient architectural heritage, vibrant cultural boulevards, and dine at a curated Michelin-recommended venue before returning to your retreat.`,
        overnightStay: hotelDesc,
        highlights: ['Private Cultural Historian', 'Panoramic Scenic Lookouts', 'Curated Fine Dining']
      };
    });

    onChange(generatedDays);
    if (onShowToast) {
      onShowToast('success', 'AI Itinerary Crafted', `Populated ${generatedDays.length} full days with rich narratives.`);
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim() || !currentDay) return;
    const existing = currentDay.highlights || [];
    if (!existing.includes(newHighlight.trim())) {
      handleUpdateCurrentDay({ highlights: [...existing, newHighlight.trim()] });
    }
    setNewHighlight('');
  };

  const handleRemoveHighlight = (highlightToRemove: string) => {
    if (!currentDay) return;
    const existing = currentDay.highlights || [];
    handleUpdateCurrentDay({
      highlights: existing.filter(h => h !== highlightToRemove)
    });
  };

  const handleAutoFillSingleDay = () => {
    if (!currentDay) return;
    const dest = destinations[0] || 'Destination';
    const dayNum = currentDay.dayNumber;
    
    handleUpdateCurrentDay({
      title: `Day ${dayNum} in ${dest} — Curated Private Excursion`,
      description: `Experience the finest cultural highlights of ${dest} with an exclusive private morning tour, priority access to historical monuments, and an evening at leisure enjoying world-class regional hospitality.`,
      highlights: ['Private Historic Tour', 'Priority Venue Access', 'Curated Culinary Dining']
    });

    if (onShowToast) {
      onShowToast('info', `Day ${dayNum} Refined`, 'Generated customized highlights and summary.');
    }
  };

  if (!currentDay) return null;

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* 1. Header Toolbar Card */}
      <div className="bg-white rounded-xl border border-black/[0.08] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-semibold text-[#1D1D1F] tracking-tight">
              Day-by-Day Itinerary Builder
            </h2>
            <span className="rounded-md bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] text-[12px] font-medium px-2 py-0.5 tabular-nums">
              {days.length} {days.length === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <p className="text-[13px] text-[#6E6E73] mt-0.5 font-medium">
            Daily experiences, private guided excursions, and verified stay connections printed on Page 2.
          </p>
        </div>

        {/* Right Actions: Craft All Days AI + Add Day */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCraftAllDays}
            className="tactile-button-ai h-10 px-3.5 rounded-lg text-[13.5px] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1D1D1F]" />
            <span>Craft All Days</span>
          </button>

          <button
            type="button"
            onClick={handleAddDay}
            className="tactile-button-primary h-10 px-3.5 rounded-lg text-[13.5px] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer font-medium"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
            <span>Add Day</span>
          </button>
        </div>
      </div>

      {/* 2. Top Horizontal Scrollable Day Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="inline-flex items-center gap-1 bg-[#E5E5EA]/70 p-1 rounded-lg border border-black/[0.06] shrink-0">
          {days.map((day, idx) => {
            const isActive = idx === activeDayIndex;
            const dayNumberStr = String(day.dayNumber).padStart(2, '0');

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveDayIndex(idx)}
                className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium shrink-0 transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Day {dayNumberStr}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Focused Single-Day Workspace */}
      <div className="bg-white border border-black/[0.08] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Workspace Card Header */}
        <div className="px-4 py-3 bg-[#F5F5F7] border-b border-black/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#1D1D1F] text-white text-[11.5px] font-semibold tabular-nums shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
              Day {String(currentDay.dayNumber).padStart(2, '0')}
            </span>
            <span className="text-[14px] font-semibold text-[#1D1D1F]">
              Daily Narrative & Highlights
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFillSingleDay}
              className="text-[12.5px] text-[#1D1D1F] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Auto-Fill Details</span>
            </button>

            {days.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteDay(activeDayIndex)}
                className="p-1 rounded-md text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5 transition-colors cursor-pointer"
                title="Delete this day"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Workspace Card Body */}
        <div className="p-4 space-y-4">
          {/* Day Title */}
          <div>
            <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
              Day Heading / Title
            </label>
            <input
              type="text"
              value={currentDay.title}
              onChange={(e) => handleUpdateCurrentDay({ title: e.target.value })}
              placeholder="e.g. Arrival in Zurich — Scenic Limmat River Cruise & Welcome Dinner"
              className="w-full h-10 px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 text-[#1D1D1F] font-semibold transition-all"
            />
          </div>

          {/* Day Narrative Description */}
          <div>
            <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
              Detailed Daily Narrative Description <span className="text-[#86868B] font-normal">(Printed on Page 2)</span>
            </label>
            <textarea
              rows={4}
              value={currentDay.description}
              onChange={(e) => handleUpdateCurrentDay({ description: e.target.value })}
              placeholder="Provide a vivid description of activities, private chauffeurs, scenic transfers, and meal stops..."
              className="w-full px-3.5 py-2.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 text-[#1D1D1F] leading-relaxed resize-none transition-all"
            />
          </div>

          {/* Overnight Accommodation Selector */}
          <div>
            <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
              Overnight Accommodation for Night {currentDay.dayNumber}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868B]">
                <Building2 className="w-4 h-4" />
              </div>
              <select
                value={currentDay.overnightStay || ''}
                onChange={(e) => handleUpdateCurrentDay({ overnightStay: e.target.value })}
                className="w-full h-10 pl-10 pr-4 text-[13.5px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:border-[#1D1D1F] text-[#1D1D1F] font-medium transition-all"
              >
                <option value="">Select confirmed accommodation...</option>
                {stays.map((stay) => (
                  <option key={stay.id} value={`${stay.hotelName}, ${stay.city}`}>
                    {stay.hotelName} ({stay.city}) — Nights {stay.nightRangeStart}–{stay.nightRangeEnd} ({stay.roomCategory})
                  </option>
                ))}
                <option value="Overnight Flight / Transit">Overnight Flight / Transit</option>
                <option value="Return Flight Sector">Return Flight Sector</option>
              </select>
            </div>
          </div>

          {/* Key Experience Highlights */}
          <div>
            <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
              Key Experience Highlights <span className="text-[#86868B] font-normal">(Bullet tags printed on proposal)</span>
            </label>
            <div className="p-3 bg-[#F5F5F7] border border-black/[0.08] rounded-lg space-y-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {(currentDay.highlights || []).map((highlight, hIdx) => (
                  <span
                    key={hIdx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12.5px] font-medium bg-white text-[#1D1D1F] border border-[#D2D2D7] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <span>{highlight}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(highlight)}
                      className="p-0.5 hover:bg-black/5 text-[#86868B] hover:text-[#1D1D1F] rounded transition-colors cursor-pointer"
                      title="Remove highlight"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                  placeholder="Add highlight badge (press Enter)..."
                  className="h-8 flex-1 px-2.5 text-[13px] bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-md text-[#1D1D1F] placeholder-[#86868B] outline-none"
                />
                {newHighlight.trim() && (
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="tactile-button-primary h-8 px-3 rounded-md text-[12px] shrink-0 font-medium"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>
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
            <span>Back: Stays</span>
          </button>
        ) : <div />}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="tactile-button-primary inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-[13.5px] font-medium cursor-pointer whitespace-nowrap"
          >
            <span>Save & Continue to Inclusions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
