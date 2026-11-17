import React from 'react';
import { Proposal } from '../../types/proposal';
import { formatDateDisplay, MEAL_PLAN_MAP } from '../../data/formatters';
import { Plane, Building2, Luggage } from 'lucide-react';

interface PdfPageFlightsStaysProps {
  proposal: Proposal;
}

export const PdfPageFlightsStays: React.FC<PdfPageFlightsStaysProps> = ({ proposal }) => {
  return (
    <div className="w-full h-full bg-[#0A131F] text-white p-6 sm:p-7 flex flex-col justify-between select-none font-sans border border-[#E5C365]/30 shadow-2xl overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between text-[8.5px] sm:text-[9.5px] tracking-widest uppercase text-[#E5C365] pb-2 border-b border-[#E5C365]/30 font-medium">
          <span>TrippyGo Curated Itinerary</span>
          <span className="font-sans text-slate-400 tabular-nums">{proposal.code}</span>
          <span>Section 03 — Transportation & Accommodations</span>
        </div>

        <div className="mt-3 mb-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] tracking-widest uppercase text-[#E5C365] font-semibold">
              TRANSPORTATION & STAYS
            </span>
            <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
              Flight Sectors & Confirmed Hotel Stays
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-0.5">
        {/* FLIGHTS BLOCK */}
        <div>
          <div className="flex items-center gap-1.5 text-[9.5px] tracking-wider text-[#E5C365] font-bold uppercase mb-2">
            <Plane className="w-3 h-3 text-[#E5C365]" strokeWidth={1.75} />
            <span>Flight Schedule & Boarding Passes</span>
          </div>

          {proposal.flights.length === 0 ? (
            <div className="p-3 rounded bg-[#0F1C2E] border border-[#E5C365]/20 text-[11px] text-slate-400 text-center">
              No flights configured in this proposal.
            </div>
          ) : (
            <div className="space-y-2">
              {proposal.flights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-[#0F1C2E] border border-[#E5C365]/25 rounded-[2px] p-2.5 sm:p-3 flex items-center justify-between gap-2.5 text-xs"
                >
                  {/* Airline & Date */}
                  <div className="min-w-[120px] max-w-[140px]">
                    <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#E5C365] block">
                      {flight.direction} Journey
                    </span>
                    <div className="font-bold text-white text-xs truncate">
                      {flight.airline}
                    </div>
                    <div className="text-[9.5px] font-sans font-semibold text-blue-300 tabular-nums">
                      {flight.flightNumber} · {formatDateDisplay(flight.date)}
                    </div>
                  </div>

                  {/* Route & Times: DEP Time / Code -> ARR Time / Code */}
                  <div className="flex-1 flex items-center justify-center gap-2 bg-[#0A131F]/60 px-2.5 py-1.5 rounded border border-white/5">
                    <div className="text-right whitespace-nowrap">
                      <div className="font-bold text-white text-xs">{flight.depAirport}</div>
                      <div className="text-[9px] text-slate-400">{flight.depTime}</div>
                    </div>

                    <div className="flex flex-col items-center px-1">
                      <span className="text-[8px] text-slate-400 tabular-nums">{flight.duration}</span>
                      <div className="w-8 h-px bg-[#E5C365]/40 my-0.5" />
                      <span className="text-[7px] text-[#E5C365] uppercase">{flight.stops}</span>
                    </div>

                    <div className="text-left whitespace-nowrap">
                      <div className="font-bold text-white text-xs">{flight.arrAirport}</div>
                      <div className="text-[9px] text-slate-400">{flight.arrTime}</div>
                    </div>
                  </div>

                  {/* Baggage */}
                  <div className="text-right min-w-[85px] shrink-0">
                    <div className="text-[9px] text-[#E5C365] font-semibold flex items-center justify-end gap-1">
                      <Luggage className="w-3 h-3" />
                      <span>{flight.baggageCheckIn}</span>
                    </div>
                    <div className="text-[8px] text-slate-400">
                      {flight.baggageCabin}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HOTEL STAYS BLOCK */}
        <div>
          <div className="flex items-center gap-1.5 text-[9.5px] tracking-wider text-[#E5C365] font-bold uppercase mb-2">
            <Building2 className="w-3 h-3 text-[#E5C365]" strokeWidth={1.75} />
            <span>Confirmed Hotel Accommodations</span>
          </div>

          {proposal.stays.length === 0 ? (
            <div className="p-3 rounded bg-[#0F1C2E] border border-[#E5C365]/20 text-[11px] text-slate-400 text-center">
              No hotel properties added.
            </div>
          ) : (
            <div className="space-y-2">
              {proposal.stays.map((stay) => {
                const planInfo = MEAL_PLAN_MAP[stay.mealPlan];
                const rangeLabel = stay.nightRangeStart === stay.nightRangeEnd
                  ? `Night ${stay.nightRangeStart}`
                  : `Nights ${stay.nightRangeStart}–${stay.nightRangeEnd}`;

                return (
                  <div
                    key={stay.id}
                    className="bg-[#0F1C2E] border border-[#E5C365]/25 rounded-[2px] p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#E5C365]/20 text-[#E5C365] text-[8.5px] font-bold uppercase tracking-wider">
                          {rangeLabel} ({stay.nights}N)
                        </span>
                        <span className="font-bold text-white text-xs truncate">
                          {stay.hotelName}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-300 mt-0.5 flex items-center gap-2">
                        <span>{stay.city}</span>
                        <span>·</span>
                        <span className="text-[#E5C365]/90">{stay.roomCategory}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[9.5px] font-bold text-[#E5C365] uppercase">
                        {stay.mealPlan} Plan
                      </div>
                      <div className="text-[8.5px] text-slate-400">
                        {planInfo?.desc || stay.mealPlan}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5C365]/20 flex items-center justify-between text-[8.5px] text-slate-400 mt-2">
        <span>TrippyGo Bespoke Itinerary</span>
        <span>Page 3 of 4</span>
      </div>
    </div>
  );
};
