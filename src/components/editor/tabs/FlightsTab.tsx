import React, { useState } from 'react';
import { FlightSector } from '../../../types/proposal';
import { FlightModal } from './FlightModal';
import { FlightScreenshotExtractor } from './FlightScreenshotExtractor';
import { 
  Plane, 
  Plus, 
  Trash2, 
  Luggage, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface FlightsTabProps {
  flights: FlightSector[];
  onChange: (flights: FlightSector[]) => void;
  startDate?: string;
  endDate?: string;
  destinations?: string[];
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const FlightsTab: React.FC<FlightsTabProps> = ({
  flights,
  onChange,
  startDate,
  endDate,
  destinations = [],
  onShowToast,
  onNext,
  onBack,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightSector | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'manual' | 'import' | 'suggest'>('manual');
  const [filterDirection, setFilterDirection] = useState<'all' | 'onward' | 'return' | 'intercity'>('all');

  const outboundCount = flights.filter(f => f.direction === 'onward').length;
  const returnCount = flights.filter(f => f.direction === 'return').length;
  const intercityCount = flights.filter(f => f.direction === 'intercity').length;

  const filteredFlights = flights.filter(f => {
    if (filterDirection === 'all') return true;
    return f.direction === filterDirection;
  });

  const handleOpenAdd = () => {
    setEditingFlight(null);
    setModalInitialTab('manual');
    setModalOpen(true);
  };

  const handleOpenEdit = (flight: FlightSector) => {
    setEditingFlight(flight);
    setModalInitialTab('manual');
    setModalOpen(true);
  };

  const handleAutoSuggest = () => {
    const primaryDest = destinations[0] || 'Baku';
    const isBaku = primaryDest.toLowerCase().includes('baku');

    const onward: FlightSector = {
      id: 'fl-sug-1-' + Date.now(),
      direction: 'onward',
      airline: isBaku ? 'Azerbaijan Airlines' : 'Emirates',
      flightNumber: isBaku ? 'J2 058' : 'EK 501',
      cabinClass: 'Economy',
      date: startDate || '2026-11-23',
      arrDate: startDate || '2026-11-23',
      depAirport: 'BOM',
      depCity: 'Mumbai',
      depTime: '04:15',
      depTerminal: 'T2',
      arrAirport: isBaku ? 'GYD' : 'DXB',
      arrCity: primaryDest,
      arrTime: '07:50',
      arrTerminal: 'T1',
      duration: '4h 35m',
      stops: 'Non-stop',
      baggageCheckIn: '23 kg Check-in',
      baggageCabin: '8 kg Cabin',
      layoverNotes: 'Direct non-stop flight'
    };

    const ret: FlightSector = {
      id: 'fl-sug-2-' + Date.now(),
      direction: 'return',
      airline: isBaku ? 'Azerbaijan Airlines' : 'Emirates',
      flightNumber: isBaku ? 'J2 057' : 'EK 502',
      cabinClass: 'Economy',
      date: endDate || '2026-11-28',
      arrDate: endDate || '2026-11-29',
      depAirport: isBaku ? 'GYD' : 'DXB',
      depCity: primaryDest,
      depTime: '19:40',
      depTerminal: 'T1',
      arrAirport: 'BOM',
      arrCity: 'Mumbai',
      arrTime: '01:55',
      arrTerminal: 'T2',
      duration: '4h 45m',
      stops: 'Non-stop',
      baggageCheckIn: '23 kg Check-in',
      baggageCabin: '8 kg Cabin',
      layoverNotes: 'Return journey sector'
    };

    onChange([...flights, onward, ret]);
    if (onShowToast) {
      onShowToast('success', 'Auto-Suggested Flights Added', `Populated round-trip sectors for ${primaryDest}.`);
    }
  };

  const handleDelete = (id: string) => {
    onChange(flights.filter(f => f.id !== id));
  };

  const handleSaveFlight = (savedFlight: FlightSector) => {
    const exists = flights.some(f => f.id === savedFlight.id);
    if (exists) {
      onChange(flights.map(f => (f.id === savedFlight.id ? savedFlight : f)));
    } else {
      onChange([...flights, savedFlight]);
    }
    setModalOpen(false);
  };

  const handleSaveMultiple = (newFlights: FlightSector[]) => {
    onChange([...flights, ...newFlights]);
    setModalOpen(false);
    if (onShowToast) {
      onShowToast('success', 'Flights Added', `Added ${newFlights.length} flight sectors.`);
    }
  };

  const handleAddExtractedFlights = (newFlights: FlightSector[]) => {
    onChange([...flights, ...newFlights]);
  };

  const formatBaggage = (checkIn?: string, cabin?: string) => {
    const parts = [];
    if (checkIn) parts.push(checkIn.includes('Check-in') || checkIn.includes('check-in') ? checkIn : `${checkIn} Check-in`);
    if (cabin) parts.push(cabin.includes('Cabin') || cabin.includes('cabin') ? cabin : `${cabin} Cabin`);
    return parts.length > 0 ? parts.join(' • ') : '20 kg Check-in • 7 kg Cabin';
  };

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* 1. Header Toolbar Card */}
      <div className="bg-white rounded-xl border border-black/[0.08] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[16px] font-semibold text-[#1D1D1F] tracking-tight">
              Travel Flights & Boarding Passes
            </h2>
            <span className="rounded-md bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] text-[12px] font-medium px-2 py-0.5 tabular-nums">
              {flights.length} {flights.length === 1 ? 'Flight' : 'Flights'}
            </span>
          </div>
          <p className="text-[13px] text-[#6E6E73] mt-0.5 font-medium">
            Configured flights render as boarding passes on Page 3 of the client proposal.
          </p>
        </div>

        {/* Right Actions: Tactile AI Auto-Suggest + Tactile Primary Add Flight */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAutoSuggest}
            className="tactile-button-ai h-10 px-3.5 rounded-lg text-[13.5px] font-medium inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#1D1D1F]" />
            <span>Auto-Suggest</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="tactile-button-primary h-10 px-4 rounded-lg text-[13.5px] font-medium cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
            <span>Add Flight</span>
          </button>
        </div>
      </div>

      {/* 2. B2B Flight Screenshot & E-Ticket Uploader / Review Panel */}
      <FlightScreenshotExtractor
        destinations={destinations}
        startDate={startDate}
        endDate={endDate}
        onAddFlights={handleAddExtractedFlights}
        onOpenManualModal={handleOpenAdd}
        onShowToast={onShowToast}
      />

      {/* 3. Single Unified Flight List Card with Segmented Direction Filter */}
      <div className="bg-white rounded-xl border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Segmented Filter Bar */}
        <div className="px-4 py-3 bg-[#F5F5F7] border-b border-black/[0.08] flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex bg-[#E5E5EA]/70 p-1 rounded-lg border border-black/[0.06]">
            {(['all', 'onward', 'return', 'intercity'] as const).map((dir) => {
              const count = dir === 'all' ? flights.length : dir === 'onward' ? outboundCount : dir === 'return' ? returnCount : intercityCount;
              const label = dir === 'all' ? 'All' : dir === 'onward' ? 'Outbound' : dir === 'return' ? 'Return' : 'Intercity';
              const isSelected = filterDirection === dir;
              return (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setFilterDirection(dir)}
                  className={`px-3 py-1 text-[12.5px] rounded-md transition-all duration-150 cursor-pointer font-medium active:scale-95 ${
                    isSelected
                      ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          <div className="text-[12px] text-[#86868B] font-medium">
            Total {flights.length} sectors configured
          </div>
        </div>

        {/* Flight Cards List / Empty State */}
        {filteredFlights.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Plane className="w-8 h-8 text-[#86868B]/40 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-[14.5px] font-semibold text-[#1D1D1F]">
              {flights.length === 0 ? 'No flight sectors configured yet' : 'No flights in this direction'}
            </p>
            <p className="text-[12.5px] text-[#6E6E73] mt-1 max-w-sm mx-auto">
              Click "Add Flight" to manually create a flight, or use "Auto-Suggest" to populate recommended round-trip sectors.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.06]">
            {filteredFlights.map((flight, idx) => {
              const baggageText = formatBaggage(flight.baggageCheckIn, flight.baggageCabin);
              return (
                <div
                  key={flight.id}
                  className="px-4 py-3.5 hover:bg-[#F5F5F7]/70 transition-colors"
                >
                  {/* Top Meta Line: Airline, Flight Code, Cabin Class, Baggage | Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded-md bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] text-[11px] font-bold tabular-nums shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="text-[14px] font-semibold text-[#1D1D1F] truncate">
                        {flight.airline} • {flight.flightNumber}
                      </span>
                      <span className="text-[11.5px] text-[#6E6E73] bg-[#F5F5F7] border border-[#D2D2D7] px-2 py-0.5 rounded-md shrink-0 font-medium">
                        {flight.cabinClass || 'Economy'}
                      </span>
                      <span className="text-[12px] text-[#6E6E73] inline-flex items-center gap-1 shrink-0 font-medium hidden sm:inline-flex">
                        <Luggage className="w-3.5 h-3.5 text-[#86868B]" />
                        <span className="tabular-nums">{baggageText}</span>
                      </span>
                      {flight.pnr && (
                        <span className="text-[11px] text-[#6E6E73] font-mono bg-[#F5F5F7] border border-[#D2D2D7] px-1.5 py-0.5 rounded-md shrink-0">
                          PNR: {flight.pnr}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(flight)}
                        className="tactile-button-secondary h-7 px-2.5 rounded-lg text-[12.5px] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(flight.id)}
                        title="Delete flight sector"
                        className="p-1 rounded-md text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>

                  {/* Main Route Timeline */}
                  <div className="mt-2.5 grid grid-cols-12 items-center gap-2">
                    {/* Departure */}
                    <div className="col-span-4 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[18px] font-bold text-[#1D1D1F] tabular-nums leading-none">
                          {flight.depTime || '--:--'}
                        </span>
                        <span className="text-[14px] font-semibold text-[#1D1D1F] leading-none">
                          {flight.depAirport}
                        </span>
                      </div>
                      <div className="text-[12.5px] text-[#6E6E73] font-medium truncate mt-1">
                        {flight.depCity}{flight.depTerminal ? ` · T${flight.depTerminal.replace(/^T/i, '')}` : ''}
                      </div>
                      <div className="text-[12px] text-[#86868B] tabular-nums mt-0.5">
                        {flight.date}
                      </div>
                    </div>

                    {/* Flight Path */}
                    <div className="col-span-4 flex flex-col items-center justify-center px-2">
                      <span className="text-[12px] text-[#6E6E73] tabular-nums font-medium mb-1">
                        {flight.duration || 'Direct'}
                      </span>
                      <div className="w-full flex items-center gap-1.5">
                        <div className="flex-1 h-px bg-black/[0.12]" />
                        <Plane className="w-3.5 h-3.5 text-[#86868B] shrink-0 rotate-90" />
                        <div className="flex-1 h-px bg-black/[0.12]" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#1D1D1F] uppercase tracking-wider mt-1 px-1.5 py-0.2 rounded-md bg-[#F5F5F7] border border-[#D2D2D7]">
                        {flight.stops || 'Non-stop'}
                      </span>
                    </div>

                    {/* Arrival */}
                    <div className="col-span-4 min-w-0 text-right">
                      <div className="flex items-baseline justify-end gap-2">
                        <span className="text-[14px] font-semibold text-[#1D1D1F] leading-none">
                          {flight.arrAirport}
                        </span>
                        <span className="text-[18px] font-bold text-[#1D1D1F] tabular-nums leading-none">
                          {flight.arrTime || '--:--'}
                        </span>
                      </div>
                      <div className="text-[12.5px] text-[#6E6E73] font-medium truncate mt-1">
                        {flight.arrCity}{flight.arrTerminal ? ` · T${flight.arrTerminal.replace(/^T/i, '')}` : ''}
                      </div>
                      <div className="text-[12px] text-[#86868B] tabular-nums mt-0.5">
                        {flight.arrDate || flight.date}
                      </div>
                    </div>
                  </div>

                  {/* Layover Note Bar */}
                  {flight.layoverNotes && (
                    <div className="mt-2.5 px-3 py-1.5 bg-[#F5F5F7] rounded-lg border border-[#D2D2D7] text-[12px] text-[#1D1D1F] flex items-center gap-2">
                      <span className="font-semibold text-[#6E6E73]">Layover:</span>
                      <span>{flight.layoverNotes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Centered Modal */}
      <FlightModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        flight={editingFlight}
        initialTab={modalInitialTab}
        destinations={destinations}
        startDate={startDate}
        endDate={endDate}
        onSave={handleSaveFlight}
        onSaveMultiple={handleSaveMultiple}
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
            <span>Back: Overview</span>
          </button>
        ) : <div />}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="tactile-button-primary inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-[13.5px] font-medium cursor-pointer whitespace-nowrap"
          >
            <span>Save & Continue to Stays</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
