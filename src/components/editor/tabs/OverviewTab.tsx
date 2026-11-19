import React, { useState } from 'react';
import { Proposal } from '../../../types/proposal';
import { NumericStepper } from '../../shared/NumericStepper';
import { 
  MapPin, 
  X, 
  Image as ImageIcon, 
  ChevronDown, 
  ChevronUp, 
  Check,
  ArrowRight
} from 'lucide-react';

interface OverviewTabProps {
  proposal: Proposal;
  onChange: (partial: Partial<Proposal>) => void;
  onNext?: () => void;
}

const PRESET_COVER_IMAGES = [
  {
    name: 'Swiss Alps & Glaciers',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Baku Flame Towers & Caspian',
    url: 'https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Santorini Sunset Caldera',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Kyoto Bamboo Forest',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
  },
];

export const OverviewTab: React.FC<OverviewTabProps> = ({
  proposal,
  onChange,
  onNext,
}) => {
  const [newDestination, setNewDestination] = useState('');
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleAddDestination = () => {
    if (!newDestination.trim()) return;
    const trimmed = newDestination.trim();
    if (!proposal.destinations.includes(trimmed)) {
      onChange({ destinations: [...proposal.destinations, trimmed] });
    }
    setNewDestination('');
  };

  const handleRemoveDestination = (destToRemove: string) => {
    if (proposal.destinations.length <= 1) return;
    onChange({ destinations: proposal.destinations.filter((d) => d !== destToRemove) });
  };

  const handleNightsChange = (newNights: number) => {
    const validNights = Math.max(1, newNights);
    const newDays = validNights + 1;

    let computedEndDate = proposal.endDate;
    if (proposal.startDate) {
      try {
        const start = new Date(proposal.startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + validNights);
        computedEndDate = end.toISOString().split('T')[0];
      } catch (e) {
        console.error('Date compute error', e);
      }
    }

    onChange({
      nights: validNights,
      days: newDays,
      endDate: computedEndDate,
    });
  };

  const handleStartDateChange = (dateStr: string) => {
    let computedEndDate = proposal.endDate;
    if (dateStr) {
      try {
        const start = new Date(dateStr);
        const end = new Date(start);
        end.setDate(end.getDate() + (proposal.nights || 5));
        computedEndDate = end.toISOString().split('T')[0];
      } catch (e) {
        console.error('Date compute error', e);
      }
    }

    onChange({
      startDate: dateStr,
      endDate: computedEndDate,
    });
  };

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* SECTION 1: Proposal Metadata Card */}
      <div className="bg-white border border-black/[0.08] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-4 py-3 bg-[#F5F5F7] border-b border-black/[0.08] flex items-center justify-between">
          <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-[#6E6E73]">
            1. Itinerary Header & Identity
          </h3>
          <span className="text-[12px] font-mono text-[#86868B] tabular-nums">
            ID: {proposal.code}
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* Package Title & Client Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                Package Title <span className="text-[#86868B] font-normal">(Page 1 Cover)</span>
              </label>
              <input
                type="text"
                value={proposal.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="e.g. Exquisite Swiss Alps & Scenic Glaciers"
                className="h-10 w-full px-3.5 text-[14.5px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 rounded-lg text-[#1D1D1F] font-semibold transition-all duration-150 outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                Primary Client Name <span className="text-[#86868B] font-normal">(Quotation Lead)</span>
              </label>
              <input
                type="text"
                value={proposal.clientName}
                onChange={(e) => onChange({ clientName: e.target.value })}
                placeholder="e.g. Dr. Vikram & Ananya Singhania"
                className="h-10 w-full px-3.5 text-[14.5px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 rounded-lg text-[#1D1D1F] font-medium transition-all duration-150 outline-none"
              />
            </div>
          </div>

          {/* Destination Circuit Tags */}
          <div>
            <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
              Destination Circuit <span className="text-[#86868B] font-normal">(Travel Route)</span>
            </label>
            <div className="p-2.5 bg-[#F5F5F7] border border-black/[0.08] rounded-lg flex flex-wrap items-center gap-2">
              {proposal.destinations.map((dest) => (
                <span
                  key={dest}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-medium bg-white text-[#1D1D1F] border border-[#D2D2D7] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1D1D1F]" strokeWidth={2} />
                  <span>{dest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDestination(dest)}
                    className="p-0.5 hover:bg-black/5 text-[#86868B] hover:text-[#1D1D1F] rounded transition-colors cursor-pointer"
                    title={`Remove ${dest}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="inline-flex items-center gap-1.5">
                <input
                  type="text"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDestination();
                    }
                  }}
                  placeholder="Add city (Enter)..."
                  className="h-8 px-2.5 text-[13px] bg-white border border-[#D2D2D7] rounded-md focus:outline-none focus:border-[#1D1D1F] text-[#1D1D1F] placeholder-[#86868B]"
                />
                {newDestination.trim() && (
                  <button
                    type="button"
                    onClick={handleAddDestination}
                    className="h-8 px-2.5 text-[12px] font-medium text-white bg-[#1D1D1F] hover:bg-[#000000] active:scale-95 rounded-md cursor-pointer shadow-xs transition-all"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cover Photo Selector with Live Preview */}
          <div className="pt-1">
            <div className="flex items-center justify-between p-3 bg-[#F5F5F7] border border-black/[0.08] rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-16 h-12 rounded-md overflow-hidden bg-zinc-200 border border-black/[0.08] shrink-0 shadow-xs">
                  <img
                    src={proposal.coverImage}
                    alt="Active cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-[#1D1D1F]">
                    Cover Photography
                  </div>
                  <div className="text-[12px] text-[#6E6E73]">
                    Full-bleed hero banner displayed on Page 1 PDF Cover
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(!isPhotoPickerOpen)}
                className="tactile-button-secondary h-9 px-3 rounded-lg text-[13px] font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#6E6E73]" />
                <span>{isPhotoPickerOpen ? 'Hide Gallery' : 'Change Cover Photo'}</span>
              </button>
            </div>

            {/* Collapsible Photo Picker Gallery */}
            {isPhotoPickerOpen && (
              <div className="mt-3 p-3 bg-[#F5F5F7] border border-black/[0.08] rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-100">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_COVER_IMAGES.map((preset) => {
                    const isSelected = proposal.coverImage === preset.url;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          onChange({ coverImage: preset.url });
                          setIsPhotoPickerOpen(false);
                        }}
                        className={`relative rounded-lg overflow-hidden border text-left cursor-pointer transition-all active:scale-[0.98] ${
                          isSelected
                            ? 'border-[#1D1D1F] ring-2 ring-black/15 shadow-xs'
                            : 'border-[#D2D2D7] hover:border-[#1D1D1F]'
                        }`}
                      >
                        <div className="h-16 w-full overflow-hidden bg-zinc-200">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-1.5 bg-white">
                          <div className="text-[12px] font-semibold text-[#1D1D1F] truncate">
                            {preset.name}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#1D1D1F] text-white p-0.5 rounded-md shadow-xs">
                            <Check className="w-3 h-3" strokeWidth={2.5} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste custom image URL..."
                    className="flex-1 h-9 px-3 text-[13.5px] bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:border-[#1D1D1F] text-[#1D1D1F]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customImageUrl.trim()) {
                        onChange({ coverImage: customImageUrl.trim() });
                        setCustomImageUrl('');
                        setIsPhotoPickerOpen(false);
                      }
                    }}
                    className="tactile-button-secondary h-9 px-3.5 text-[13px] font-medium rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Client Contact & Agency Notes */}
        <div className="border-t border-black/[0.08]">
          <button
            type="button"
            onClick={() => setIsContactOpen(!isContactOpen)}
            className="w-full px-4 py-2.5 flex items-center justify-between bg-white hover:bg-[#F5F5F7] transition-colors text-left cursor-pointer"
          >
            <span className="text-[12px] font-semibold tracking-wider uppercase text-[#6E6E73]">
              Optional: Client Contact & Confidential Notes
            </span>
            {isContactOpen ? (
              <ChevronUp className="w-4 h-4 text-[#6E6E73]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6E6E73]" />
            )}
          </button>

          {isContactOpen && (
            <div className="px-4 py-3 bg-[#F5F5F7] border-t border-black/[0.08] space-y-3 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1D1D1F] mb-1">
                    Client Email Address
                  </label>
                  <input
                    type="email"
                    value={proposal.clientEmail}
                    onChange={(e) => onChange({ clientEmail: e.target.value })}
                    placeholder="client@email.com"
                    className="h-10 w-full px-3.5 text-[14px] bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:border-[#1D1D1F] text-[#1D1D1F]"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1D1D1F] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={proposal.clientPhone}
                    onChange={(e) => onChange({ clientPhone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="h-10 w-full px-3.5 text-[14px] bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:border-[#1D1D1F] text-[#1D1D1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#1D1D1F] mb-1">
                  Internal Agency Notes <span className="text-[#86868B] font-normal">(Confidential — not printed on PDF)</span>
                </label>
                <textarea
                  rows={2}
                  value={proposal.agencyNotes || ''}
                  onChange={(e) => onChange({ agencyNotes: e.target.value })}
                  placeholder="Special requirements, VIP status, dietary restrictions, preferred floor..."
                  className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:border-[#1D1D1F] text-[#1D1D1F] resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Dates & Traveller Party */}
      <div className="bg-white border border-black/[0.08] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-4 py-3 bg-[#F5F5F7] border-b border-black/[0.08] flex items-center justify-between">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6E73]">
            2. Dates & Traveller Party
          </h3>
          <span className="text-[12px] font-medium text-[#1D1D1F] bg-white border border-[#D2D2D7] px-2.5 py-0.5 rounded-md tabular-nums">
            {proposal.nights}N / {proposal.days}D
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* Dates & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Start Date */}
            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                Departure Start Date
              </label>
              <input
                type="date"
                value={proposal.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="h-10 w-full px-3.5 text-[14.5px] font-semibold tabular-nums bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:border-[#1D1D1F] text-[#1D1D1F] cursor-pointer transition-all duration-150"
              />
            </div>

            {/* Nights Stepper & Return Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-[#1D1D1F]">
                  Total Duration (Nights)
                </label>
                <span className="text-[12px] text-[#6E6E73] tabular-nums font-medium">
                  Returns: {proposal.endDate || 'Auto-computed'}
                </span>
              </div>
              <NumericStepper
                value={proposal.nights}
                min={1}
                max={60}
                onChange={handleNightsChange}
                labelFormat={(v) => `${v} Nights (${v + 1} Days)`}
                className="w-full"
              />
            </div>
          </div>

          {/* Travellers & Rooms 4-Column Steppers */}
          <div>
            <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
              Travellers & Accommodation Requirement
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Adults */}
              <div className="p-3 bg-[#F5F5F7] border border-black/[0.08] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#1D1D1F]">Adults</span>
                  <span className="text-[11px] text-[#86868B]">12+ yrs</span>
                </div>
                <NumericStepper
                  value={proposal.adults}
                  min={1}
                  onChange={(val) => onChange({ adults: val })}
                  className="w-full"
                />
              </div>

              {/* Children */}
              <div className="p-3 bg-[#F5F5F7] border border-black/[0.08] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#1D1D1F]">Children</span>
                  <span className="text-[11px] text-[#86868B]">2–11 yrs</span>
                </div>
                <NumericStepper
                  value={proposal.children}
                  min={0}
                  onChange={(val) => onChange({ children: val })}
                  className="w-full"
                />
              </div>

              {/* Infants */}
              <div className="p-3 bg-[#F5F5F7] border border-black/[0.08] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#1D1D1F]">Infants</span>
                  <span className="text-[11px] text-[#86868B]">&lt; 2 yrs</span>
                </div>
                <NumericStepper
                  value={proposal.infants}
                  min={0}
                  onChange={(val) => onChange({ infants: val })}
                  className="w-full"
                />
              </div>

              {/* Rooms */}
              <div className="p-3 bg-[#F5F5F7] border border-black/[0.08] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#1D1D1F]">Rooms</span>
                  <span className="text-[11px] text-[#86868B]">Req.</span>
                </div>
                <NumericStepper
                  value={proposal.rooms}
                  min={1}
                  onChange={(val) => onChange({ rooms: val })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP PROGRESSION FOOTER */}
      {onNext && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="tactile-button-primary inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-[14px] font-medium cursor-pointer whitespace-nowrap"
          >
            <span>Save & Continue to Flights</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
