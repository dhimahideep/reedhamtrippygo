import React from 'react';
import { Proposal } from '../../types/proposal';
import { formatINR, formatDateDisplay, calculateCommercials } from '../../data/formatters';
import { Check, X } from 'lucide-react';

interface PdfPagePricingProps {
  proposal: Proposal;
}

export const PdfPagePricing: React.FC<PdfPagePricingProps> = ({ proposal }) => {
  const commercials = calculateCommercials(proposal.pricing, proposal.adults, proposal.children);
  const showPerPerson = 
    proposal.pricing.distributionMode === 'per_person' || 
    proposal.pricing.displayFormat === 'per_person' || 
    proposal.pricing.displayFormat === 'per_adult' || 
    proposal.pricing.displayFormat === 'itemized_per_pax';

  return (
    <div className="w-full h-full bg-[#0A131F] text-white p-6 sm:p-7 flex flex-col justify-between select-none font-sans border border-[#E5C365]/30 shadow-2xl overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between text-[8.5px] sm:text-[9.5px] tracking-widest uppercase text-[#E5C365] pb-2 border-b border-[#E5C365]/30 font-medium">
          <span>TrippyGo Curated Itinerary</span>
          <span className="font-sans text-slate-400 tabular-nums">{proposal.code}</span>
          <span>Section 04 — Inclusions & Commercial Quote</span>
        </div>

        <div className="mt-3 mb-3">
          <span className="text-[9px] tracking-widest uppercase text-[#E5C365] font-semibold">
            TERMS & COMMERCIAL SUMMARY
          </span>
          <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
            Inclusions, Exclusions & Total Investment
          </h2>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-3.5 flex-1 overflow-y-auto pr-0.5">
        {/* High-contrast dark investment summary card */}
        <div className="bg-[#080E17] border-2 border-[#E5C365]/60 rounded-[2px] p-3.5 sm:p-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5C365]/20">
            <div>
              <span className="text-[8.5px] font-bold uppercase tracking-widest text-[#E5C365]">
                Commercial Quotation Summary
              </span>
              <div className="text-xs font-semibold text-white">
                Bespoke Package Investment for {commercials.totalPayingPax} Guests
              </div>
            </div>

            <div className="text-right">
              <span className="text-[8.5px] text-slate-400 block">Valid Until</span>
              <span className="text-[9.5px] font-bold text-[#E5C365] tabular-nums">
                {formatDateDisplay(proposal.pricing.quoteValidUntil)}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-[10px] text-slate-300">
                {proposal.pricing.includeFlights ? 'Includes 5-Star Land Package + Flight Tickets' : 'Land Package Only (Flights Optional)'}
              </div>
              <div className="text-[8.5px] text-slate-400 mt-0.5">
                All resort taxes, fuel surcharges & service fees included
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl sm:text-2xl font-serif font-bold text-white tabular-nums tracking-tight">
                {formatINR(commercials.totalClientSellingPrice)}
              </div>
              {showPerPerson && (
                <div className="text-[9.5px] text-[#E5C365] tabular-nums font-semibold mt-0.5">
                  {formatINR(commercials.pricePerAdult)} / Adult Guest
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two-Column Included / Excluded Checklists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Inclusions */}
          <div className="bg-[#0F1C2E] border border-[#E5C365]/25 rounded-[2px] p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-[#E5C365]">
              <Check className="w-3.5 h-3.5 text-[#E5C365]" strokeWidth={2.5} />
              <span>Package Inclusions</span>
            </div>
            <ul className="space-y-1.5 text-[9.5px] text-slate-300">
              {proposal.inclusions.slice(0, 7).map((inc, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-[#E5C365] font-bold">•</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="bg-[#0F1C2E] border border-white/10 rounded-[2px] p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
              <X className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
              <span>Package Exclusions</span>
            </div>
            <ul className="space-y-1.5 text-[9.5px] text-slate-400">
              {proposal.exclusions.slice(0, 6).map((exc, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-slate-500 font-bold">•</span>
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Important Client Notes & Signature */}
        <div className="grid grid-cols-2 gap-3 pt-1 text-[8.5px] text-slate-400">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-300 uppercase tracking-wider block">
              Booking Policy & Compliance
            </span>
            <p className="leading-relaxed">
              Standard 25% deposit required upon confirmation. Passport must hold minimum 6 months validity. TCS applicable as per GOI guidelines.
            </p>
          </div>

          <div className="text-right space-y-0.5">
            <span className="font-bold text-[#E5C365] uppercase tracking-wider block">
              TrippyGo Authorized Desk
            </span>
            <p className="text-slate-300 font-medium">
              Prepared by Roodram · Sales & Bespoke Lead
            </p>
            <p className="text-slate-400">
              concierge@trippygo.travel · +91 98200 00000
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5C365]/20 flex items-center justify-between text-[8.5px] text-slate-400 mt-2">
        <span>TrippyGo — A Unit of Friends Travels</span>
        <span>Page 4 of 4</span>
      </div>
    </div>
  );
};
