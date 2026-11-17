import React, { useState } from 'react';
import { ItineraryDay, StayProperty } from '../../../types/proposal';
import { 
  Plus, 
  Trash2, 
  Building2, 
  Image as ImageIcon, 
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
          title: `Farewell ${activeDest} — Artisanal Souvenirs & Airport Chauffeur`,
          description: `Enjoy a leisurely breakfast followed by a final morning stroll through local boutique markets and historical avenues. Your private chauffeur escorts you to the airport terminal for your return flight with expedited check-in assistance.`,
          overnightStay: 'Departure / Return Flight',
          highlights: ['Artisanal Bazaar Walk', 'Private Airport Transfer', 'VIP Departure Assistance']
        };
      }

      const midTemplates = [
        {
          title: `Curated Heritage & Old Town Architectural Walk in ${activeDest}`,
          description: `Embark on an immersive private journey through historic architectural landmarks, UNESCO-listed fortifications, and royal grounds led by our certified local historian. Savor an exclusive chef-curated lunch of regional delicacies at a landmark restaurant.`,
          highlights: ['Certified Historian Guide', 'Architectural Landmarks', 'Regional Tasting Experience']
        },
        {
          title: `Panoramic Scenic Excursion & Natural Landscapes Trail`,
          description: `Board a first-class panoramic private vehicle journey through picturesque valleys, ancient petroglyphs, and burning mountain phenomena. Ascend to scenic viewpoints for breathtaking panoramas and photography.`,
          highlights: ['Panoramic Landscape Tour', 'Private Executive Vehicle', 'Scenic Mountain Viewpoint']
        },
        {
          title: `Exclusive Private Chartered Cruise & Golden Hour Sunset`,
          description: `Sail across tranquil azure waters aboard a private chartered yacht with vintage refreshments and hors d'oeuvres on board. Watch the dramatic sunset dip below the horizon followed by fine dining on the waterfront promenade.`,
          highlights: ['Private Chartered Boat', 'Golden Hour Sunset Toast', 'Waterfront Fine Dining']
        },
        {
          title: `Artisanal Workshops & Gastronomic Food Trail`,
          description: `Discover behind-the-scenes ateliers of master carpet weavers and copper artisans. Savor handcrafted delicacies, rare cheeses, and local vintages guided by a regional sommelier. Afternoon at leisure in your hotel spa sanctuary.`,
          highlights: ['Master Artisan Workshop', 'Gastronomic Trail', 'Luxury Spa Sanctuary']
        }
      ];

      const template = midTemplates[(dayNumber - 2) % midTemplates.length];
      return {
        dayNumber,
        title: template.title,
        description: template.description,
        overnightStay: hotelDesc,
        highlights: template.highlights
      };
    });

    onChange(generatedDays);
    setActiveDayIndex(0);
    if (onShowToast) {
      onShowToast('success', 'Itinerary Crafted', `Generated rich bespoke schedules for all ${generatedDays.length} days.`);
    }
  };

  const handleAutoFillSingleDay = () => {
    const destName = destinations[activeDayIndex % (destinations.length || 1)] || 'the destination';
    const suggestions: Record<number, { title: string; desc: string; highlights: string[] }> = {
      1: {
        title: `Arrival in ${destName} — VIP Airport Welcome & Private Transfer`,
        desc: `Arrive at the international airport terminal. Clear priority customs and meet your private chauffeur for an escorted transfer to your luxury property. Evening at leisure with signature welcome cocktails overlooking the skyline.`,
        highlights: ['VIP Arrival Meet & Greet', 'Private Chauffeur Transfer', 'Welcome Cocktail Reception']
      },
      2: {
        title: `Curated Heritage & Cultural Highlights of ${destName}`,
        desc: `Embark on an immersive private journey through historic architectural landmarks, museums, and royal grounds led by our certified local historian guide. Savor an exclusive chef-curated lunch of regional delicacies.`,
        highlights: ['Certified Historian Guide', 'Architectural Landmarks', 'Regional Tasting Experience']
      },
      3: {
        title: `Scenic Excursion & Nature Trail Expedition`,
        desc: `Board a first-class panoramic rail journey through picturesque valleys and crystal-clear lakes. Ascend to scenic viewpoints for breathtaking panoramas and light mountain hiking.`,
        highlights: ['Panoramic Rail Journey', 'Mountain Viewpoint', 'Alpine Meadow Stroll']
      },
      4: {
        title: `Exclusive Private Chartered Cruise & Golden Hour Sunset`,
        desc: `Sail across tranquil azure waters aboard a private chartered vessel with vintage refreshments on board. Watch the dramatic sunset dip below the horizon followed by fine dining.`,
        highlights: ['Private Chartered Boat', 'Sunset Champagne Toast', 'Seaside Dining']
      },
      5: {
        title: `Artisanal Workshops & Gastronomic Food Trail`,
        desc: `Discover behind-the-scenes ateliers of master artisans and savor handcrafted delicacies, rare cheeses, and local vintages. Afternoon at your resort spa sanctuary.`,
        highlights: ['Master Artisan Workshop', 'Gastronomic Trail', 'Luxury Spa Sanctuary']
      }
    };

    const template = suggestions[(activeDayIndex + 1) as keyof typeof suggestions] || {
      title: `Private Excursion & Sightseeing in ${destName}`,
      desc: `A bespoke full-day itinerary customized to your personal pace, featuring handpicked highlights, private transport, and priority skip-the-line entrance tickets throughout the day.`,
      highlights: ['Bespoke Chauffeur Vehicle', 'Skip-the-Line Tickets', 'Tailored Day Schedule']
    };

    handleUpdateCurrentDay({
      title: template.title,
      description: template.desc,
      highlights: template.highlights
    });
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim() || !currentDay) return;
    const highlights = currentDay.highlights || [];
    handleUpdateCurrentDay({ highlights: [...highlights, newHighlight.trim()] });
    setNewHighlight('');
  };

  const handleRemoveHighlight = (idx: number) => {
    if (!currentDay || !currentDay.highlights) return;
    handleUpdateCurrentDay({
      highlights: currentDay.highlights.filter((_, i) => i !== idx)
    });
  };

  if (!currentDay) {
    return null;
  }

  const matchedStay = stays.find(
    s => currentDay.dayNumber >= s.nightRangeStart && currentDay.dayNumber <= s.nightRangeEnd
  );

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* 1. Header Toolbar Card: Craft All Days + Add Day */}
      <div className="bg-white rounded-xl border border-[rgba(55,53,47,0.09)] p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-semibold text-[#37352F]">
              Day-by-Day Itinerary Schedule
            </h2>
            <span className="rounded-md bg-[#F7F7F5] border border-[rgba(55,53,47,0.08)] text-[#787774] text-[12px] font-medium px-2 py-0.5 tabular-nums">
              {days.length} {days.length === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <p className="text-[13px] text-[#787774] mt-0.5">
            Daily narrative, highlights, and overnight stays rendered chronologically on Page 2.
          </p>
        </div>

        {/* Right Actions: Craft All Days + Add Day */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCraftAllDays}
            className="tactile-button-ai h-10 px-3.5 rounded-lg text-[13.5px] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2383E2]" />
            <span>Craft All Days</span>
          </button>

          <button
            type="button"
            onClick={handleAddDay}
            className="tactile-button-primary h-10 px-3.5 rounded-lg text-[13.5px] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
            <span>Add Day</span>
          </button>
        </div>
      </div>

      {/* 2. Top Horizontal Scrollable Day Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="inline-flex items-center gap-1 bg-[#EFECE6]/80 p-1 rounded-lg border border-[rgba(55,53,47,0.08)] shrink-0">
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
                    ? 'bg-white text-[#37352F] font-semibold shadow-[0_1px_2px_rgba(15,15,15,0.06)]'
                    : 'text-[#787774] hover:text-[#37352F]'
                }`}
              >
                Day {dayNumberStr}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Focused Single-Day Workspace */}
      <div className="bg-white border border-[rgba(55,53,47,0.09)] rounded-xl shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
        {/* Workspace Card Header */}
        <div className="px-4 py-3 bg-[#F7F7F5] border-b border-[rgba(55,53,47,0.09)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#2383E2] text-white text-[11.5px] font-semibold tabular-nums shadow-[0_1px_2px_rgba(35,131,226,0.25)]">
              Day {String(currentDay.dayNumber).padStart(2, '0')}
            </span>
            <span className="text-[14px] font-semibold text-[#37352F]">
              Daily Narrative & Highlights
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFillSingleDay}
              className="text-[12.5px] text-[#2383E2] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Fill Template</span>
            </button>

            {days.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteDay(activeDayIndex)}
                className="p-1 rounded-md text-[#9B9A97] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1 text-[12px]"
                title="Delete this day"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Overnight Stay & Cover Photo Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F7F7F5] border border-[rgba(55,53,47,0.08)] text-[12.5px] text-[#37352F]">
              <Building2 className="w-3.5 h-3.5 text-[#2383E2]" strokeWidth={1.75} />
              <span className="font-medium text-[#787774]">Overnight:</span>
              <span className="font-semibold text-[#37352F]">
                {matchedStay ? `${matchedStay.hotelName} (${matchedStay.city})` : (currentDay.overnightStay || 'Hotel')}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F7F7F5] border border-[rgba(55,53,47,0.08)] text-[12.5px] text-[#37352F]">
              <ImageIcon className="w-3.5 h-3.5 text-[#787774]" strokeWidth={1.75} />
              <span className="font-medium text-[#787774]">Photo:</span>
              <span className="font-semibold text-[#37352F]">
                Destination Visual
              </span>
            </div>
          </div>

          {/* Day Title */}
          <div>
            <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
              Day Headline Title
            </label>
            <input
              type="text"
              value={currentDay.title}
              onChange={(e) => handleUpdateCurrentDay({ title: e.target.value })}
              placeholder="e.g. Mount Pilatus Golden Round Trip"
              className="h-10 w-full px-3.5 text-[14px] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] focus:border-[#2383E2] focus:ring-3 focus:ring-[#2383E2]/15 rounded-lg text-[#37352F] font-semibold transition-all outline-none"
            />
          </div>

          {/* Narrative Description Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-medium text-[#37352F]">
                Day Narrative Description
              </label>
              <span className="text-[12px] text-[#9B9A97] tabular-nums">
                {currentDay.description.length} chars
              </span>
            </div>
            <textarea
              rows={4}
              value={currentDay.description}
              onChange={(e) => handleUpdateCurrentDay({ description: e.target.value })}
              placeholder="Describe the day's excursions, historical landmarks, transfers, and evening arrangements..."
              className="w-full px-3.5 py-2.5 text-[14px] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] focus:border-[#2383E2] focus:ring-3 focus:ring-[#2383E2]/15 rounded-lg text-[#37352F] leading-relaxed resize-none transition-all outline-none"
            />
          </div>

          {/* Highlights Tags Input */}
          <div>
            <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
              Key Day Highlights & Sights
            </label>
            <div className="p-2.5 bg-[#F7F7F5]/70 border border-[rgba(55,53,47,0.09)] rounded-lg space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {(currentDay.highlights || []).map((hl, hIdx) => (
                  <span
                    key={hIdx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12.5px] bg-white text-[#37352F] border border-[rgba(55,53,47,0.09)] font-medium shadow-[0_1px_2px_rgba(15,15,15,0.04)]"
                  >
                    <span>{hl}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(hIdx)}
                      className="p-0.5 hover:bg-red-50 text-[#9B9A97] hover:text-[#DC2626] rounded cursor-pointer transition-colors"
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
                  className="h-8 flex-1 px-2.5 text-[13px] bg-white border border-[rgba(55,53,47,0.12)] focus:border-[#2383E2] rounded-md text-[#37352F] placeholder-[#9B9A97] outline-none"
                />
                {newHighlight.trim() && (
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="tactile-button-primary h-8 px-3 rounded-md text-[12px] shrink-0"
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
