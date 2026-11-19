import React, { useState, useEffect } from 'react';
import { FlightSector } from '../../../types/proposal';
import { 
  X, 
  Plane, 
  UploadCloud, 
  Wand2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Repeat
} from 'lucide-react';

interface FlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightSector | null;
  initialTab?: 'manual' | 'import' | 'suggest';
  destinations?: string[];
  startDate?: string;
  endDate?: string;
  onSave: (flight: FlightSector) => void;
  onSaveMultiple?: (flights: FlightSector[]) => void;
  onDuplicateReturn?: (flight: FlightSector) => void;
}

export const FlightModal: React.FC<FlightModalProps> = ({
  isOpen,
  onClose,
  flight,
  initialTab = 'manual',
  destinations = [],
  startDate,
  endDate,
  onSave,
  onSaveMultiple,
  onDuplicateReturn,
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'import' | 'suggest'>(initialTab);
  const [showLayover, setShowLayover] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'parsing' | 'done'>('idle');

  const defaultDirection = flight?.direction || 'onward';
  const initialShowLayover = Boolean(flight?.layoverNotes);

  const [formData, setFormData] = useState<FlightSector>({
    id: '',
    direction: defaultDirection,
    airline: 'IndiGo',
    flightNumber: '6E 1803',
    cabinClass: 'Economy',
    pnr: '',
    date: startDate || new Date().toISOString().split('T')[0],
    arrDate: startDate || new Date().toISOString().split('T')[0],
    depAirport: 'BOM',
    depCity: 'Mumbai',
    depTime: '06:15',
    depTerminal: 'T2',
    arrAirport: destinations[0]?.toLowerCase().includes('baku') ? 'GYD' : 'DXB',
    arrCity: destinations[0] || 'Dubai',
    arrTime: '10:45',
    arrTerminal: 'T1',
    duration: '4h 30m',
    stops: 'Non-stop',
    baggageCheckIn: '20 kg Check-in',
    baggageCabin: '7 kg Cabin',
    layoverNotes: '',
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (flight) {
      setFormData(flight);
      setShowLayover(Boolean(flight.layoverNotes));
    } else {
      setFormData({
        id: 'flight-' + Date.now(),
        direction: defaultDirection,
        airline: 'IndiGo',
        flightNumber: '6E 1803',
        cabinClass: 'Economy',
        pnr: '',
        date: startDate || new Date().toISOString().split('T')[0],
        arrDate: startDate || new Date().toISOString().split('T')[0],
        depAirport: 'BOM',
        depCity: 'Mumbai',
        depTime: '06:15',
        depTerminal: 'T2',
        arrAirport: destinations[0]?.toLowerCase().includes('baku') ? 'GYD' : 'DXB',
        arrCity: destinations[0] || 'Dubai',
        arrTime: '10:45',
        arrTerminal: 'T1',
        duration: '4h 30m',
        stops: 'Non-stop',
        baggageCheckIn: '20 kg Check-in',
        baggageCabin: '7 kg Cabin',
        layoverNotes: initialShowLayover ? '1 Stop via connecting transit hub' : '',
      });
      setShowLayover(initialShowLayover);
    }
    setImportStatus('idle');
  }, [flight, defaultDirection, initialShowLayover, isOpen, startDate, destinations]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleSimulateImport = () => {
    setImportStatus('parsing');
    setTimeout(() => {
      setImportStatus('done');
      setTimeout(() => {
        const importedFlight: FlightSector = {
          id: 'fl-import-' + Date.now(),
          direction: formData.direction || 'onward',
          airline: 'SpiceJet',
          flightNumber: 'SG 121',
          cabinClass: 'Economy',
          date: startDate || '2026-11-23',
          arrDate: startDate || '2026-11-23',
          depAirport: 'DEL',
          depCity: 'Delhi',
          depTime: '08:45',
          depTerminal: 'T3',
          arrAirport: 'IXL',
          arrCity: 'Leh Ladakh',
          arrTime: '10:15',
          arrTerminal: 'T1',
          duration: '1h 30m',
          stops: 'Non-stop',
          baggageCheckIn: '15 kg Check-in',
          baggageCabin: '7 kg Cabin',
          pnr: 'Q7P9LK',
          layoverNotes: 'Direct non-stop sector'
        };
        onSave(importedFlight);
        onClose();
      }, 700);
    }, 900);
  };

  const handleApplyAutoSuggest = () => {
    const primaryDest = destinations[0] || 'Baku';
    const isBaku = primaryDest.toLowerCase().includes('baku');

    const onward: FlightSector = {
      id: 'fl-sug-modal-1-' + Date.now(),
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
      layoverNotes: 'Outbound journey sector'
    };

    const ret: FlightSector = {
      id: 'fl-sug-modal-2-' + Date.now(),
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

    if (onSaveMultiple) {
      onSaveMultiple([onward, ret]);
    } else {
      onSave(onward);
    }
    onClose();
  };

  const cabinClassOptions = [
    { value: 'Economy', label: 'Economy Class', description: 'Standard seating' },
    { value: 'Premium Economy', label: 'Premium Economy', description: 'Extra legroom' },
    { value: 'Business', label: 'Business Class', description: 'Lie-flat bed & lounge access' },
    { value: 'First', label: 'First Class', description: 'Private suite & luxury dining' },
  ];

  const stopsOptions = [
    { value: 'Non-stop', label: 'Non-stop (Direct Flight)', description: 'Direct point-to-point journey' },
    { value: '1 Stop', label: '1 Stop via Connecting City', description: 'Single intermediate layover' },
    { value: '2 Stops', label: '2 Stops', description: 'Multi-leg flight routing' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-md transition-opacity duration-200 select-none animate-in fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      {/* Centered Modal Card */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-xl border border-black/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.16)] overflow-hidden z-10 transition-all duration-200 ease-out animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-black/[0.08] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1D1D1F] tracking-tight">
              {flight ? 'Edit Flight Sector' : 'Flight Sector Manager'}
            </h2>
            <p className="text-[12.5px] text-[#6E6E73] mt-0.5 font-medium">
              Configured flights render as authentic boarding passes on Page 3 of the proposal.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* 3 Top Tabs: Manual Entry | Import Screenshot | Auto-Suggest Route */}
        {!flight && (
          <div className="px-5 pt-3 pb-0 bg-[#F5F5F7] border-b border-black/[0.08]">
            <div className="inline-flex bg-[#E5E5EA]/70 p-1 rounded-lg border border-black/[0.06] w-full">
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-1.5 text-[13px] rounded-[6px] transition-all duration-150 cursor-pointer font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                  activeTab === 'manual'
                    ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Manual Entry</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('import')}
                className={`flex-1 py-1.5 text-[13px] rounded-[6px] transition-all duration-150 cursor-pointer font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                  activeTab === 'import'
                    ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Import Screenshot / PNR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('suggest')}
                className={`flex-1 py-1.5 text-[13px] rounded-[6px] transition-all duration-150 cursor-pointer font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                  activeTab === 'suggest'
                    ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Suggest Route</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: MANUAL FORM */}
        {activeTab === 'manual' && (
          <form id="flight-modal-form" onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
            {/* Direction Segmented Control */}
            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                Flight Direction / Route Type
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#E5E5EA]/70 p-1 rounded-lg border border-black/[0.06]">
                {(['onward', 'return', 'intercity'] as const).map((dir) => {
                  const label = dir === 'onward' ? 'Outbound (Onward)' : dir === 'return' ? 'Return Journey' : 'Intercity / Domestic';
                  const isSelected = formData.direction === dir;
                  return (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, direction: dir }))}
                      className={`py-1.5 text-[12.5px] rounded-md transition-all duration-150 cursor-pointer font-medium text-center active:scale-95 ${
                        isSelected
                          ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                          : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Airline, Flight #, Cabin Class */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Airline Carrier
                </label>
                <input
                  type="text"
                  value={formData.airline}
                  onChange={(e) => setFormData(prev => ({ ...prev, airline: e.target.value }))}
                  placeholder="e.g. Emirates"
                  required
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 rounded-lg text-[#1D1D1F] font-semibold transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Flight Number / Code
                </label>
                <input
                  type="text"
                  value={formData.flightNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, flightNumber: e.target.value }))}
                  placeholder="e.g. EK 501"
                  required
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] focus:ring-2 focus:ring-black/10 rounded-lg text-[#1D1D1F] font-semibold transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Cabin Class
                </label>
                <select
                  value={formData.cabinClass}
                  onChange={(e) => setFormData(prev => ({ ...prev, cabinClass: e.target.value }))}
                  className="h-10 w-full px-3 text-[13.5px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-lg text-[#1D1D1F] outline-none"
                >
                  {cabinClassOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Departure Section */}
            <div className="p-3.5 bg-[#F5F5F7] rounded-xl border border-black/[0.08] space-y-3">
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#6E6E73] block">
                Departure Details
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                    Airport Code (IATA)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.depAirport}
                    onChange={(e) => setFormData(prev => ({ ...prev, depAirport: e.target.value.toUpperCase() }))}
                    placeholder="BOM"
                    required
                    className="h-9 w-full px-3 text-[14px] font-bold uppercase text-[#1D1D1F] bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                    Departure City
                  </label>
                  <input
                    type="text"
                    value={formData.depCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, depCity: e.target.value }))}
                    placeholder="Mumbai"
                    required
                    className="h-9 w-full px-3 text-[13.5px] text-[#1D1D1F] bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={formData.depTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, depTime: e.target.value }))}
                    required
                    className="h-9 w-full px-3 text-[13.5px] font-semibold text-[#1D1D1F] tabular-nums bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                    Terminal (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.depTerminal || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, depTerminal: e.target.value }))}
                    placeholder="T2"
                    className="h-9 w-full px-3 text-[13.5px] text-[#1D1D1F] bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Arrival Section */}
            <div className="p-3.5 bg-[#F5F5F7] rounded-xl border border-black/[0.08] space-y-3">
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#6E6E73] block">
                Arrival Details
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                    Airport Code (IATA)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.arrAirport}
                    onChange={(e) => setFormData(prev => ({ ...prev, arrAirport: e.target.value.toUpperCase() }))}
                    placeholder="DXB"
                    required
                    className="h-9 w-full px-3 text-[14px] font-bold uppercase text-[#1D1D1F] bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                    Arrival City
                  </label>
                  <input
                    type="text"
                    value={formData.arrCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, arrCity: e.target.value }))}
                    placeholder="Dubai"
                    required
                    className="h-9 w-full px-3 text-[13.5px] text-[#1D1D1F] bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    value={formData.arrTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, arrTime: e.target.value }))}
                    required
                    className="h-9 w-full px-3 text-[13.5px] font-semibold text-[#1D1D1F] tabular-nums bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">
                    Terminal (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.arrTerminal || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, arrTerminal: e.target.value }))}
                    placeholder="T1"
                    className="h-9 w-full px-3 text-[13.5px] text-[#1D1D1F] bg-white border border-[#D2D2D7] focus:border-[#1D1D1F] rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Travel Dates & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg text-[#1D1D1F] tabular-nums outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Arrival Date
                </label>
                <input
                  type="date"
                  value={formData.arrDate || formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, arrDate: e.target.value }))}
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg text-[#1D1D1F] tabular-nums outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Flight Duration
                </label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g. 4h 30m"
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg text-[#1D1D1F] outline-none"
                />
              </div>
            </div>

            {/* Stops & Baggage */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Stops / Routing
                </label>
                <select
                  value={formData.stops}
                  onChange={(e) => setFormData(prev => ({ ...prev, stops: e.target.value }))}
                  className="h-10 w-full px-3 text-[13.5px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg text-[#1D1D1F] outline-none"
                >
                  {stopsOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Check-in Baggage
                </label>
                <input
                  type="text"
                  value={formData.baggageCheckIn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, baggageCheckIn: e.target.value }))}
                  placeholder="e.g. 23 kg Check-in"
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg text-[#1D1D1F] outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Cabin Baggage
                </label>
                <input
                  type="text"
                  value={formData.baggageCabin || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, baggageCabin: e.target.value }))}
                  placeholder="e.g. 7 kg Cabin"
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg text-[#1D1D1F] outline-none"
                />
              </div>
            </div>

            {/* Collapsible Layover / Connecting Section */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowLayover(!showLayover)}
                className="text-[13px] font-medium text-[#1D1D1F] hover:underline flex items-center gap-1.5 cursor-pointer py-1"
              >
                {showLayover ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showLayover ? 'Hide Layover & Transit Notes' : 'Add Connecting Layover / Transit Notes'}</span>
              </button>

              {showLayover && (
                <div className="mt-2 p-3 bg-[#F5F5F7] border border-black/[0.08] rounded-lg space-y-2">
                  <label className="block text-[12px] font-semibold text-[#1D1D1F]">
                    Layover & Transit Information
                  </label>
                  <textarea
                    rows={2}
                    value={formData.layoverNotes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, layoverNotes: e.target.value }))}
                    placeholder="e.g. 2h 15m Layover in Dubai International (DXB). Luggage checked through to final destination."
                    className="w-full px-3 py-2 text-[13.5px] bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:border-[#1D1D1F] text-[#1D1D1F] resize-none"
                  />
                </div>
              )}
            </div>

            {/* Mirrored Return Action */}
            {onDuplicateReturn && formData.direction === 'onward' && (
              <div className="p-3 bg-[#F5F5F7] rounded-lg border border-black/[0.08] flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-semibold text-[#1D1D1F]">
                    Quick Mirrored Return Helper
                  </div>
                  <div className="text-[12px] text-[#6E6E73]">
                    Inverts departure & arrival airports for return journey
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDuplicateReturn(formData)}
                  className="tactile-button-secondary h-8 px-3 rounded-lg text-[12.5px] font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Repeat className="w-3.5 h-3.5 text-[#6E6E73]" />
                  <span>Generate Return Leg</span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* TAB 2: IMPORT SCREENSHOT / PNR */}
        {activeTab === 'import' && (
          <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
            <div className="text-center max-w-md mx-auto space-y-1">
              <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
                Smart Extraction from Screenshot or E-Ticket
              </h3>
              <p className="text-[13px] text-[#6E6E73]">
                Drop or browse a booking confirmation screenshot, PDF e-ticket, or paste PNR text.
              </p>
            </div>

            <div 
              onClick={importStatus === 'idle' ? handleSimulateImport : undefined}
              className="border-2 border-dashed border-[#D2D2D7] hover:border-[#1D1D1F] rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#F5F5F7] max-w-lg mx-auto"
            >
              {importStatus === 'idle' && (
                <div className="space-y-2.5">
                  <UploadCloud className="w-10 h-10 text-[#1D1D1F] mx-auto" strokeWidth={1.75} />
                  <div className="text-[14px] font-semibold text-[#1D1D1F]">
                    Click to browse or drop flight ticket image
                  </div>
                  <div className="text-[12px] text-[#86868B]">
                    Extracts carrier, flight code, terminals, times, and baggage automatically
                  </div>
                </div>
              )}

              {importStatus === 'parsing' && (
                <div className="space-y-2 py-4">
                  <div className="w-7 h-7 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-[14px] font-semibold text-[#1D1D1F]">
                    Scanning ticket details...
                  </div>
                  <div className="text-[12px] text-[#86868B]">
                    Detecting route schedule and booking codes
                  </div>
                </div>
              )}

              {importStatus === 'done' && (
                <div className="space-y-2 py-2">
                  <div className="w-8 h-8 bg-[#1D1D1F] text-white rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div className="text-[14px] font-semibold text-[#1D1D1F]">
                    Imported SpiceJet SG 121 (DEL → IXL)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AUTO-SUGGEST ROUTE */}
        {activeTab === 'suggest' && (
          <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
            <div className="text-center max-w-md mx-auto space-y-1">
              <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
                Auto-Suggest Recommended Flight Sectors
              </h3>
              <p className="text-[13px] text-[#6E6E73]">
                Generates best-fit round-trip flight sectors based on destination ({destinations[0] || 'Baku'}) and trip duration.
              </p>
            </div>

            <div className="max-w-lg mx-auto bg-[#F5F5F7] border border-black/[0.08] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
                <span className="text-[12px] font-semibold uppercase text-[#6E6E73]">
                  Proposed Route
                </span>
                <span className="text-[12px] font-medium text-[#1D1D1F] bg-white px-2 py-0.5 rounded-md border border-[#D2D2D7] shadow-2xs">
                  Round-Trip (2 Sectors)
                </span>
              </div>

              <div className="space-y-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1D1D1F]">Outbound:</span>
                  <span>BOM (04:15) → GYD (07:50) • Azerbaijan Airlines J2 058</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1D1D1F]">Return:</span>
                  <span>GYD (19:40) → BOM (01:55) • Azerbaijan Airlines J2 057</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyAutoSuggest}
                className="tactile-button-primary w-full mt-2 h-10 rounded-lg text-[13.5px] font-medium cursor-pointer flex items-center justify-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>Apply Recommended Round-Trip</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        {activeTab === 'manual' && (
          <div className="px-5 py-3.5 bg-[#F5F5F7] border-t border-black/[0.08] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="tactile-button-secondary h-10 px-4 rounded-lg text-[13.5px] font-medium whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="flight-modal-form"
              className="tactile-button-primary h-10 px-5 rounded-lg text-[13.5px] font-medium whitespace-nowrap"
            >
              Save Flight Sector
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
