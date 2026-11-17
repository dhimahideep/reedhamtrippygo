import React from 'react';
import { Proposal } from '../../types/proposal';
import { Building2 } from 'lucide-react';

interface PdfPageItineraryProps {
  proposal: Proposal;
}

export const PdfPageItinerary: React.FC<PdfPageItineraryProps> = ({ proposal }) => {
  return (
    <div className="w-full h-full bg-[#0A131F] text-white p-6 sm:p-7 flex flex-col justify-between select-none font-sans border border-[#E5C365]/30 shadow-2xl overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between text-[8.5px] sm:text-[9.5px] tracking-widest uppercase text-[#E5C365] pb-2 border-b border-[#E5C365]/30 font-medium">
          <span>TrippyGo Curated Itinerary</span>
          <span className="font-sans text-slate-400 tabular-nums">{proposal.code}</span>
          <span>Section 02 — Day-by-Day Experience</span>
        </div>

        <div className="mt-3 mb-3">
          <span className="text-[9px] tracking-widest uppercase text-[#E5C365] font-semibold">
            DAY-BY-DAY CURATED ITINERARY
          </span>
          <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
            Your Private Journey Narrative
          </h2>
        </div>
      </div>

      {/* Days Timeline View */}
      <div className="space-y-2.5 flex-1 pr-1 overflow-y-auto">
        {proposal.daysList.map((day) => {
          const dayNumStr = String(day.dayNumber).padStart(2, '0');

          return (
            <div
              key={day.dayNumber}
              className="bg-[#0F1C2E] border border-[#E5C365]/20 rounded-[2px] p-2.5 sm:p-3 text-xs space-y-1.5"
            >
              {/* Day Header: DAY 01 badge + Day Title */}
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-[#E5C365] text-[#0A131F] text-[9.5px] font-bold uppercase tracking-wider shrink-0 tabular-nums">
                  DAY {dayNumStr}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-xs leading-snug">
                    {day.title}
                  </h3>
                </div>
              </div>

              {/* Narrative Paragraph */}
              <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed pl-0.5">
                {day.description}
              </p>

              {/* Linked Overnight Stay Pill & Highlights */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#E5C365]/10 text-[9px]">
                {day.overnightStay && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0A131F] text-[#E5C365] border border-[#E5C365]/30 font-medium">
                    <Building2 className="w-2.5 h-2.5" />
                    <span>Stay: {day.overnightStay}</span>
                  </span>
                )}

                {(day.highlights || []).map((hl, hIdx) => (
                  <span
                    key={hIdx}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 text-slate-300"
                  >
                    <span>·</span>
                    <span>{hl}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5C365]/20 flex items-center justify-between text-[8.5px] text-slate-400 mt-2">
        <span>Curated for {proposal.clientName}</span>
        <span>Page 2 of 4</span>
      </div>
    </div>
  );
};
