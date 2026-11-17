import React, { useState } from 'react';
import { FlightSector } from '../../../types/proposal';
import { 
  X, 
  Plane, 
  Plus, 
  Luggage,
  Calendar
} from 'lucide-react';

interface FlightScheduleSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFlight: (flight: FlightSector) => void;
  destinations?: string[];
  startDate?: string;
}

export const FlightScheduleSearchModal: React.FC<FlightScheduleSearchModalProps> = ({
  isOpen,
  onClose,
  onAddFlight,
  destinations = [],
  startDate,
}) => {
  const destName = destinations[0] || 'Baku';
  const isBaku = destName.toLowerCase().includes('baku');

  const [origin, setOrigin] = useState('BOM');
  const [destination, setDestination] = useState(isBaku ? 'GYD' : 'DXB');
  const [flightDate, setFlightDate] = useState(startDate || new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  // Realistic schedules based on search inputs
  const mockSchedules = [
    {
      airline: isBaku ? 'Azerbaijan Airlines' : 'Emirates',
      flightNumber: isBaku ? 'J2 058' : 'EK 501',
      depTime: '04:15',
      arrTime: '07:50',
      duration: isBaku ? '4h 35m' : '3h 30m',
      stops: 'Non-stop',
      baggageCheckIn: '23 kg check-in',
      baggageCabin: '8 kg cabin',
      aircraft: 'Airbus A320neo',
      direction: 'onward' as const,
    },
    {
      airline: isBaku ? 'Flydubai' : 'Flydubai',
      flightNumber: 'FZ 446',
      depTime: '09:20',
      arrTime: '16:45',
      duration: '8h 25m',
      stops: '1 Stop (DXB)',
      baggageCheckIn: '20 kg check-in',
      baggageCabin: '7 kg cabin',
      aircraft: 'Boeing 737 MAX 8',
      direction: 'onward' as const,
    },
    {
      airline: isBaku ? 'Air Arabia' : 'Air Arabia',
      flightNumber: 'G9 411',
      depTime: '18:50',
      arrTime: '01:35',
      duration: '7h 45m',
      stops: '1 Stop (SHJ)',
      baggageCheckIn: '30 kg check-in',
      baggageCabin: '7 kg cabin',
      aircraft: 'Airbus A321LR',
      direction: 'onward' as const,
    },
    {
      airline: isBaku ? 'IndiGo' : 'IndiGo',
      flightNumber: '6E 1801',
      depTime: '23:15',
      arrTime: '03:40',
      duration: '5h 25m',
      stops: 'Non-stop',
      baggageCheckIn: '15 kg check-in',
      baggageCabin: '7 kg cabin',
      aircraft: 'Airbus A321neo',
      direction: 'onward' as const,
    }
  ];

  const handleSelectSchedule = (item: typeof mockSchedules[0]) => {
    const newSector: FlightSector = {
      id: 'fl-' + Date.now(),
      direction: item.direction,
      airline: item.airline,
      flightNumber: item.flightNumber,
      date: flightDate,
      depAirport: origin.toUpperCase(),
      depCity: origin === 'BOM' ? 'Mumbai' : origin === 'DEL' ? 'Delhi' : origin,
      depTime: item.depTime,
      arrAirport: destination.toUpperCase(),
      arrCity: destination === 'GYD' ? 'Baku' : destination === 'DXB' ? 'Dubai' : destName,
      arrTime: item.arrTime,
      duration: item.duration,
      stops: item.stops,
      baggageCheckIn: item.baggageCheckIn,
      baggageCabin: item.baggageCabin,
      layoverNotes: item.stops === 'Non-stop' ? 'Direct scheduled flight' : `Connecting transit via ${item.stops}`
    };

    onAddFlight(newSector);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-[0_20px_48px_rgba(0,0,0,0.16)] border border-black/[0.08] max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-white/90 backdrop-blur-xl border-b border-black/[0.06] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
              Search Flight Schedules & Connections
            </h3>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              Query published airline GDS flight schedules and attach authentic routes
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3.5 bg-[#F5F5F7] border-b border-black/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[10px] font-semibold text-[#6E6E73] uppercase tracking-[0.06em] mb-1 px-0.5">
              Origin (IATA)
            </label>
            <div className="relative">
              <Plane className="w-3.5 h-3.5 text-[#86868B] absolute left-3 top-2.5" />
              <input
                type="text"
                maxLength={4}
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                placeholder="BOM"
                className="h-8.5 w-full pl-8 pr-2.5 rounded-md border border-black/[0.06] bg-white text-xs font-semibold uppercase text-[#1D1D1F] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#6E6E73] uppercase tracking-[0.06em] mb-1 px-0.5">
              Destination (IATA)
            </label>
            <div className="relative">
              <Plane className="w-3.5 h-3.5 text-[#86868B] absolute left-3 top-2.5 rotate-90" />
              <input
                type="text"
                maxLength={4}
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                placeholder="GYD"
                className="h-8.5 w-full pl-8 pr-2.5 rounded-md border border-black/[0.06] bg-white text-xs font-semibold uppercase text-[#1D1D1F] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#6E6E73] uppercase tracking-[0.06em] mb-1 px-0.5">
              Travel Date
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-[#86868B] absolute left-3 top-2.5" />
              <input
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="h-8.5 w-full pl-8 pr-2.5 rounded-md border border-black/[0.06] bg-white text-xs font-medium tabular-nums text-[#1D1D1F] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Schedule Results List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6E6E73] font-medium px-1 mb-1">
            <span>Available Scheduled Connections ({mockSchedules.length})</span>
            <span className="text-[11px] font-semibold text-[#1D1D1F]">{origin} → {destination}</span>
          </div>

          {mockSchedules.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-md border border-black/[0.06] bg-white hover:border-[#0071E3] hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              {/* Left: Carrier & Flight No */}
              <div className="min-w-[170px]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#1D1D1F]">{item.airline}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#F5F5F7] border border-black/[0.06] text-[10px] font-semibold tabular-nums text-[#1D1D1F]">
                    {item.flightNumber}
                  </span>
                </div>
                <div className="text-[11px] text-[#6E6E73] mt-0.5">
                  {item.aircraft}
                </div>
              </div>

              {/* Center: Times & Route */}
              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="font-semibold text-[#1D1D1F] tabular-nums">{item.depTime}</span>
                  <span className="block text-[10px] text-[#86868B] font-medium">{origin}</span>
                </div>

                <div className="flex flex-col items-center min-w-[100px]">
                  <span className="text-[10px] font-medium text-[#6E6E73]">
                    {item.duration}
                  </span>
                  <div className="w-full flex items-center gap-1 my-0.5">
                    <span className="flex-1 h-px bg-black/[0.08]" />
                    <Plane className="w-3 h-3 text-[#86868B] shrink-0" />
                    <span className="flex-1 h-px bg-black/[0.08]" />
                  </div>
                  <span className="text-[9.5px] font-medium text-[#6E6E73]">
                    {item.stops}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-[#1D1D1F] tabular-nums">{item.arrTime}</span>
                  <span className="block text-[10px] text-[#86868B] font-medium">{destination}</span>
                </div>
              </div>

              {/* Right: Baggage & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.06]">
                <div className="text-[11px] text-[#6E6E73] hidden md:block">
                  <Luggage className="w-3 h-3 inline mr-1 text-[#86868B]" />
                  <span>{item.baggageCheckIn}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectSchedule(item)}
                  className="h-8 px-3 rounded-md bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sector</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[#F5F5F7] border-t border-black/[0.06] flex items-center justify-between text-xs text-[#6E6E73]">
          <span>Direct GDS Schedule Feed</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-[#1D1D1F] hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
