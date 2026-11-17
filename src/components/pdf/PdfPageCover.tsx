import React from 'react';
import { Proposal } from '../../types/proposal';
import { formatDateDisplay, MEAL_PLAN_MAP } from '../../data/formatters';
import { Compass, MapPin, Building2 } from 'lucide-react';

interface PdfPageCoverProps {
  proposal: Proposal;
}

export const PdfPageCover: React.FC<PdfPageCoverProps> = ({ proposal }) => {
  const primaryStay = proposal.stays[0];
  const routeString = proposal.destinations.join(' → ');

  return (
    <div className="w-full h-full bg-[#0A131F] text-white flex flex-col justify-between relative overflow-hidden select-none font-sans border border-[#E5C365]/30 shadow-2xl">
      {/* Background Subtle Luxury Watermark Graphic */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-[#E5C365]/5 pointer-events-none" />
      <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full border border-[#E5C365]/10 pointer-events-none" />

      {/* Top Section (Deep Navy #0A131F) */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        {/* Top Luxury Header Bar */}
        <div>
          <div className="flex items-center justify-between text-[8.5px] sm:text-[9.5px] tracking-widest uppercase text-[#E5C365] pb-2 border-b border-[#E5C365]/30 font-medium">
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E5C365]" />
              1M+ Travellers
            </span>
            <span className="font-bold tracking-wider text-slate-200">
              TrippyGo — A Unit of Friends Travels
            </span>
            <span>18+ Years Experience</span>
          </div>

          {/* Eyebrow & Brand */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#E5C365]/40 text-[#E5C365] text-[8.5px] tracking-widest uppercase font-semibold bg-[#E5C365]/5">
              <Compass className="w-2.5 h-2.5 text-[#E5C365]" strokeWidth={1.75} />
              CURATED PRIVATE ITINERARY
            </div>

            <h1 className="mt-2 text-lg sm:text-xl font-serif font-bold text-white tracking-wide leading-snug px-3 max-w-sm mx-auto">
              {proposal.title}
            </h1>

            <div className="mt-1 text-[10px] sm:text-[11px] font-sans tracking-wider uppercase text-[#E5C365] font-semibold">
              SPECIALLY PREPARED FOR {proposal.clientName ? proposal.clientName.toUpperCase() : 'VALUED GUEST'}
            </div>
          </div>
        </div>

        {/* Hero Destination Cover Photo with Dark Gradient Vignette */}
        <div className="my-3 relative">
          <div className="relative rounded-md overflow-hidden border border-[#E5C365]/40 shadow-lg aspect-16/9 bg-slate-900 max-h-44 sm:max-h-48">
            <img
              src={proposal.coverImage}
              alt={proposal.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A131F]/90 via-transparent to-transparent pointer-events-none" />

            {/* Destination circuit line over image */}
            <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 justify-center">
              {proposal.destinations.map((dest, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[9px] font-semibold bg-[#0A131F]/85 text-[#E5C365] border border-[#E5C365]/40 backdrop-blur-2xs"
                >
                  {dest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Column Metadata Box: DURATION, TRAVELLERS, TRAVEL DATES */}
        <div className="bg-[#0F1C2E] border border-[#E5C365]/35 rounded-[2px] p-2.5 sm:p-3 grid grid-cols-3 divide-x divide-[#E5C365]/20 text-center shadow-md">
          {/* Col 1: DURATION */}
          <div className="px-1.5">
            <div className="text-[8.5px] sm:text-[9px] tracking-wider text-[#E5C365] uppercase font-semibold">
              DURATION
            </div>
            <div className="text-xs font-bold text-white tabular-nums mt-0.5">
              {proposal.nights}N / {proposal.days}D
            </div>
            <div className="text-[8.5px] text-slate-400 mt-0.5">
              {proposal.days} Days Itinerary
            </div>
          </div>

          {/* Col 2: TRAVELLERS */}
          <div className="px-1.5">
            <div className="text-[8.5px] sm:text-[9px] tracking-wider text-[#E5C365] uppercase font-semibold">
              TRAVELLERS
            </div>
            <div className="text-xs font-bold text-white tabular-nums mt-0.5">
              {proposal.adults} Adults{proposal.children > 0 ? `, ${proposal.children} Ch` : ''}
            </div>
            <div className="text-[8.5px] text-slate-400 mt-0.5">
              {proposal.rooms} Private Suite{proposal.rooms > 1 ? 's' : ''}
            </div>
          </div>

          {/* Col 3: TRAVEL DATES */}
          <div className="px-1.5">
            <div className="text-[8.5px] sm:text-[9px] tracking-wider text-[#E5C365] uppercase font-semibold">
              TRAVEL DATES
            </div>
            <div className="text-xs font-bold text-white tabular-nums mt-0.5 truncate">
              {formatDateDisplay(proposal.startDate)}
            </div>
            <div className="text-[8.5px] text-slate-400 mt-0.5 truncate">
              Until {formatDateDisplay(proposal.endDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Crisp White Bottom Summary Section (OVERVIEW // AT A GLANCE) */}
      <div className="bg-white text-slate-900 p-4 sm:p-5 border-t-2 border-[#E5C365] space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-[2px] h-3 bg-[#DC2626]" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900">
              OVERVIEW // AT A GLANCE
            </h4>
          </div>
          <span className="text-[9px] font-sans font-medium text-slate-400 tabular-nums">
            {proposal.code}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Route Circuit */}
          <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
            <div className="flex items-center gap-1 text-[9.5px] font-bold text-slate-600 uppercase mb-1">
              <MapPin className="w-3 h-3 text-[#1D4ED8]" />
              <span>Route Circuit</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-900 truncate">
              {routeString}
            </div>
            <div className="text-[9.5px] text-slate-500 mt-0.5">
              {proposal.destinations.length} Destination{proposal.destinations.length > 1 ? 's' : ''} Included
            </div>
          </div>

          {/* Primary Accommodation */}
          <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
            <div className="flex items-center gap-1 text-[9.5px] font-bold text-slate-600 uppercase mb-1">
              <Building2 className="w-3 h-3 text-[#1D4ED8]" />
              <span>Primary Accommodation</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-900 truncate">
              {primaryStay ? primaryStay.hotelName : '5-Star Curated Hotel / Resort'}
            </div>
            <div className="text-[9.5px] text-slate-500 mt-0.5 truncate">
              {primaryStay ? `${primaryStay.roomCategory} · ${MEAL_PLAN_MAP[primaryStay.mealPlan]?.name || primaryStay.mealPlan}` : 'Luxury Suite Stay'}
            </div>
          </div>
        </div>

        {/* Credentials Footer */}
        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[8.5px] text-slate-500">
          <span>TrippyGo Bespoke Travel Documentation</span>
          <span>Certified Luxury Travel Advisor · Roodram</span>
        </div>
      </div>
    </div>
  );
};
