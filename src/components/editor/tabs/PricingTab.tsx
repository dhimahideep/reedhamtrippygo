import React from 'react';
import { 
  PricingCommercials, 
  PricingModel, 
  QuoteDisplayFormat 
} from '../../../types/proposal';
import { formatINR, calculateCommercials } from '../../../data/formatters';
import { NotionSelect } from '../../common/NotionSelect';
import { ArrowLeft, FileDown, Plane, Users, Check } from 'lucide-react';

interface PricingTabProps {
  pricing: PricingCommercials;
  onChange: (pricing: PricingCommercials) => void;
  adults: number;
  children: number;
  infants: number;
  onSwitchToOverview?: () => void;
  onNext?: () => void;
  onBack?: () => void;
}

const DISPLAY_FORMAT_OPTIONS = [
  { value: 'per_person', label: 'Per Person Breakdown', description: 'Calculates quote distributed per traveller' },
  { value: 'per_adult', label: 'Per Adult Breakdown', description: 'Displays rates based on adult count' },
  { value: 'total_package', label: 'Total Package Lump Sum', description: 'Displays a single gross package amount' },
];

export const PricingTab: React.FC<PricingTabProps> = ({
  pricing,
  onChange,
  adults,
  children,
  infants,
  onSwitchToOverview,
  onNext,
  onBack,
}) => {
  const commercials = calculateCommercials(pricing, adults, children);
  const marginPresets = [8, 10, 12, 15];

  const pricingModels: { id: PricingModel; title: string; subtitle: string }[] = [
    {
      id: 'package_flights',
      title: 'Package + Flights',
      subtitle: 'Land package DMC rate with optional flights added to final quote'
    },
    {
      id: 'custom_itemized',
      title: 'Itemized Quote',
      subtitle: 'Hotels, transfers, excursions, and ticketing itemized individually'
    },
    {
      id: 'total_only',
      title: 'Total Lump Sum',
      subtitle: 'Single lump-sum client invoice without disclosing itemized costs'
    }
  ];

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* STEP 1: Quote Structure */}
      <div className="bg-white rounded-xl border border-[rgba(55,53,47,0.09)] shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
        <div className="px-4 py-3 bg-[#F7F7F5] border-b border-[rgba(55,53,47,0.09)] flex items-center justify-between">
          <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-[#787774]">
            1. Quote Structure & Billing Format
          </h3>
          <span className="text-[12px] text-[#9B9A97]">
            Commercial billing mode
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* 3-Option Segmented Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {pricingModels.map((model) => {
              const isSelected = pricing.pricingModel === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onChange({ ...pricing, pricingModel: model.id })}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? 'border-[#2383E2] bg-[#2383E2]/[0.05] ring-1 ring-[#2383E2] shadow-[0_1px_3px_rgba(35,131,226,0.15)]'
                      : 'border-[rgba(55,53,47,0.12)] bg-[#F7F7F5]/60 hover:bg-white hover:border-[rgba(55,53,47,0.22)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[13.5px] font-semibold ${isSelected ? 'text-[#2383E2]' : 'text-[#37352F]'}`}>
                      {model.title}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#2383E2] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#787774] leading-relaxed">
                    {model.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Distribution Mode: Total vs Per Person Toggle */}
          <div className="p-3 bg-[#F7F7F5]/70 rounded-lg border border-[rgba(55,53,47,0.09)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white border border-[rgba(55,53,47,0.12)] flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-4 h-4 text-[#37352F]" />
              </div>
              <div>
                <div className="text-[13.5px] font-semibold text-[#37352F]">
                  {adults} Adult{adults === 1 ? '' : 's'} · {children} Child{children === 1 ? '' : 'ren'} · {infants} Infant{infants === 1 ? '' : 's'}
                </div>
                {onSwitchToOverview && (
                  <button
                    type="button"
                    onClick={onSwitchToOverview}
                    className="text-[12px] text-[#2383E2] hover:underline cursor-pointer"
                  >
                    Edit traveller party in Overview
                  </button>
                )}
              </div>
            </div>

            <div className="inline-flex bg-[#EFECE6]/80 p-1 rounded-lg border border-[rgba(55,53,47,0.08)]">
              <button
                type="button"
                onClick={() => onChange({ ...pricing, distributionMode: 'total' })}
                className={`px-3.5 py-1.5 text-[12.5px] rounded-md transition-all duration-150 cursor-pointer font-medium active:scale-95 ${
                  pricing.distributionMode === 'total'
                    ? 'bg-white text-[#37352F] font-semibold shadow-[0_1px_2px_rgba(15,15,15,0.06)]'
                    : 'text-[#787774] hover:text-[#37352F]'
                }`}
              >
                Total Lump Sum
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...pricing, distributionMode: 'per_person' })}
                className={`px-3.5 py-1.5 text-[12.5px] rounded-md transition-all duration-150 cursor-pointer font-medium active:scale-95 ${
                  pricing.distributionMode === 'per_person'
                    ? 'bg-white text-[#37352F] font-semibold shadow-[0_1px_2px_rgba(15,15,15,0.06)]'
                    : 'text-[#787774] hover:text-[#37352F]'
                }`}
              >
                Split Per Person
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: Cost & Agency Margin */}
      <div className="bg-white rounded-xl border border-[rgba(55,53,47,0.09)] shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
        <div className="px-4 py-3 bg-[#F7F7F5] border-b border-[rgba(55,53,47,0.09)] flex items-center justify-between">
          <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-[#787774]">
            2. Cost & Agency Margin
          </h3>
          <span className="text-[12px] text-[#9B9A97]">
            All prices in Indian Rupees (₹)
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* 2-Column Grid: Net Supplier Cost and Agency Margin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Net Supplier Cost */}
            <div>
              <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                Net Supplier Cost (Land Package DMC Rate)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#787774] font-semibold text-[14px]">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={pricing.supplierCostNetDMC}
                  onChange={(e) => onChange({ ...pricing, supplierCostNetDMC: Number(e.target.value) || 0 })}
                  className="h-10 w-full pl-8 pr-3 rounded-lg border border-[rgba(55,53,47,0.12)] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white text-[14.5px] font-semibold tabular-nums text-[#37352F] focus:border-[#2383E2] focus:ring-3 focus:ring-[#2383E2]/15 outline-none transition-all"
                />
              </div>
              <p className="text-[12px] text-[#9B9A97] mt-1">
                Base net cost quoted by local ground operators
              </p>
            </div>

            {/* Agency Margin (%) with quick preset chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-[#37352F]">
                  Agency Margin (%)
                </label>
                <span className="text-[13px] font-semibold text-[#2383E2] tabular-nums">
                  {pricing.agencyMarginPercent}% (+{formatINR(commercials.agencyMarginAmount)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={pricing.agencyMarginPercent}
                    onChange={(e) => onChange({ ...pricing, agencyMarginPercent: Number(e.target.value) || 0 })}
                    className="h-10 w-full pr-8 pl-3.5 rounded-lg border border-[rgba(55,53,47,0.12)] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white text-[14.5px] font-semibold tabular-nums text-[#37352F] focus:border-[#2383E2] focus:ring-3 focus:ring-[#2383E2]/15 outline-none transition-all"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#9B9A97] font-semibold text-[13px]">
                    %
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1">
                  {marginPresets.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => onChange({ ...pricing, agencyMarginPercent: pct })}
                      className={`h-10 px-2.5 rounded-lg border text-[12px] font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${
                        pricing.agencyMarginPercent === pct
                          ? 'bg-[#2383E2] text-white border-[#2383E2] shadow-[0_1px_2px_rgba(35,131,226,0.25)]'
                          : 'bg-[#F7F7F5] text-[#37352F] border-[rgba(55,53,47,0.12)] hover:bg-[#EFECE6]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[12px] text-[#9B9A97] mt-1">
                Confidential agency markup (never displayed on client PDF)
              </p>
            </div>
          </div>

          {/* Flight Commercials Toggle */}
          <div className="pt-3 border-t border-[rgba(55,53,47,0.08)] space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pricing.includeFlights}
                onChange={(e) => onChange({ ...pricing, includeFlights: e.target.checked })}
                className="w-4 h-4 text-[#2383E2] rounded border-[rgba(55,53,47,0.2)] focus:ring-[#2383E2] cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#2383E2]" />
                <span className="text-[13.5px] font-semibold text-[#37352F]">
                  Include Flight Tickets in Client Commercials
                </span>
              </div>
            </label>

            {pricing.includeFlights && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 bg-[#F7F7F5]/70 border border-[rgba(55,53,47,0.09)] rounded-xl animate-in fade-in duration-100">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#37352F] mb-1">
                    Flight Cost Per Person (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787774] font-semibold text-[13.5px]">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={pricing.flightCostPerPax}
                      onChange={(e) => onChange({ ...pricing, flightCostPerPax: Number(e.target.value) || 0 })}
                      className="h-9 w-full pl-7 pr-3 rounded-lg border border-[rgba(55,53,47,0.12)] bg-white text-[13.5px] font-semibold tabular-nums text-[#37352F] focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/15 outline-none transition-all"
                    />
                  </div>
                  <span className="text-[11.5px] text-[#787774] mt-0.5 block tabular-nums">
                    Total: {formatINR(commercials.totalFlightCost)} for {commercials.totalPayingPax} pax
                  </span>
                </div>

                <div>
                  <label className="block text-[12.5px] font-medium text-[#37352F] mb-1">
                    Fare Class / Airline Note
                  </label>
                  <input
                    type="text"
                    value={pricing.flightNote || ''}
                    onChange={(e) => onChange({ ...pricing, flightNote: e.target.value })}
                    placeholder="e.g. Economy Flex fare with 23kg check-in"
                    className="h-9 w-full px-3 rounded-lg border border-[rgba(55,53,47,0.12)] bg-white text-[13.5px] text-[#37352F] focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/15 outline-none transition-all"
                  />
                  <span className="text-[11.5px] text-[#9B9A97] mt-0.5 block">
                    Printed under the commercial notes on Page 4
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STEP 3: Client Quote Summary */}
      <div className="bg-white rounded-xl border border-[rgba(55,53,47,0.09)] shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
        <div className="px-4 py-3 bg-[#F7F7F5] border-b border-[rgba(55,53,47,0.09)] flex items-center justify-between">
          <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-[#787774]">
            3. Client Quote Summary
          </h3>
          <span className="text-[12px] text-[#2383E2] font-semibold">
            Final Client Total
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* Summary Breakdown Card */}
          <div className="p-4 sm:p-5 bg-[#F7F7F5]/70 rounded-xl border border-[rgba(55,53,47,0.09)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            {/* Left Breakdown */}
            <div className="space-y-2 text-[13.5px]">
              <div className="flex items-center gap-3">
                <span className="text-[#787774] w-36">Land Package Net:</span>
                <span className="font-semibold tabular-nums text-[#37352F]">
                  {formatINR(commercials.supplierNetLand)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#787774] w-36">
                  Agency Margin ({commercials.agencyMarginPercent}%):
                </span>
                <span className="font-semibold tabular-nums text-[#2383E2]">
                  +{formatINR(commercials.agencyMarginAmount)}
                </span>
              </div>

              {pricing.includeFlights && (
                <div className="flex items-center gap-3">
                  <span className="text-[#787774] w-36">
                    Flight Tickets ({commercials.totalPayingPax} pax):
                  </span>
                  <span className="font-semibold tabular-nums text-[#37352F]">
                    +{formatINR(commercials.totalFlightCost)}
                  </span>
                </div>
              )}

              <div className="text-[11.5px] text-[#9B9A97] pt-2 border-t border-[rgba(55,53,47,0.08)]">
                Confidential agency breakdown — only final total is presented on client PDF
              </div>
            </div>

            {/* Right: Big Bold Final Client Total */}
            <div className="sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-[rgba(55,53,47,0.08)]">
              <div className="text-[11.5px] uppercase tracking-wider text-[#787774] font-bold mb-0.5">
                Final Client Total (Gross)
              </div>
              <div className="text-3xl font-extrabold tabular-nums text-[#2383E2] tracking-tight">
                {formatINR(commercials.totalClientSellingPrice)}
              </div>
              <div className="text-[13px] text-[#787774] tabular-nums mt-1 font-medium">
                {formatINR(commercials.pricePerAdult)} per adult
              </div>
            </div>
          </div>

          {/* Quote Display Format & Validity Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                Quote Display Format on PDF
              </label>
              <NotionSelect
                value={pricing.displayFormat}
                options={DISPLAY_FORMAT_OPTIONS}
                onChange={(val) => onChange({ ...pricing, displayFormat: val as QuoteDisplayFormat })}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                Quotation Valid Until
              </label>
              <input
                type="date"
                value={pricing.quoteValidUntil}
                onChange={(e) => onChange({ ...pricing, quoteValidUntil: e.target.value })}
                className="h-10 w-full px-3.5 rounded-lg border border-[rgba(55,53,47,0.12)] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white text-[13.5px] text-[#37352F] tabular-nums focus:border-[#2383E2] focus:ring-3 focus:ring-[#2383E2]/15 outline-none transition-all"
              />
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
            <span>Back: Inclusions</span>
          </button>
        ) : <div />}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="tactile-button-primary inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-[13.5px] font-medium cursor-pointer whitespace-nowrap"
          >
            <FileDown className="w-4 h-4" />
            <span>Generate Proposal PDF</span>
          </button>
        )}
      </div>
    </div>
  );
};
