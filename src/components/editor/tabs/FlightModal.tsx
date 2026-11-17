import React, { useState, useEffect } from 'react';
import { FlightSector, FlightDirection } from '../../../types/proposal';
import { NotionSelect } from '../../common/NotionSelect';
import { 
  X, 
  Repeat, 
  ChevronDown, 
  ChevronUp,
  UploadCloud,
  Check,
  Wand2,
  Plane
} from 'lucide-react';

interface FlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightSector | null;
  defaultDirection?: FlightDirection;
  initialShowLayover?: boolean;
  initialTab?: 'manual' | 'import' | 'suggest';
  destinations?: string[];
  startDate?: string;
  endDate?: string;
  onSave: (flight: FlightSector) => void;
  onSaveMultiple?: (flights: FlightSector[]) => void;
  onDuplicateReturn?: (originalFlight: FlightSector) => void;
}

export const FlightModal: React.FC<FlightModalProps> = ({
  isOpen,
  onClose,
  flight,
  defaultDirection = 'onward',
  initialShowLayover = false,
  initialTab = 'manual',
  destinations = [],
  startDate,
  endDate,
  onSave,
  onSaveMultiple,
  onDuplicateReturn,
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'import' | 'suggest'>(initialTab);
  const [showLayover, setShowLayover] = useState(initialShowLayover);

  const [formData, setFormData] = useState<FlightSector>({
    id: '',
    direction: defaultDirection,
    airline: '',
    flightNumber: '',
    cabinClass: 'Economy',
    pnr: '',
    date: '',
    arrDate: '',
    depAirport: '',
    depCity: '',
    depTime: '',
    depTerminal: '',
    arrAirport: '',
    arrCity: '',
    arrTime: '',
    arrTerminal: '',
    duration: '',
    stops: 'Non-stop',
    baggageCheckIn: '20 kg Check-in',
    baggageCabin: '7 kg Cabin',
    layoverNotes: '',
  });

  // Import state
  const [importStatus, setImportStatus] = useState<'idle' | 'parsing' | 'done'>('idle');

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
          pnr: 'SPJ904',
          layoverNotes: ''
        };
        onSave(importedFlight);
        onClose();
      }, 700);
    }, 1200);
  };

  const handleApplyAutoSuggest = () => {
    const destName = destinations[0] || 'Baku';
    const destCode = destName.toLowerCase().includes('baku') ? 'GYD' : 'DXB';
    const onward: FlightSector = {
      id: 'fl-sug-' + Date.now(),
      direction: 'onward',
      airline: 'Azerbaijan Airlines',
      flightNumber: 'J2 058',
      cabinClass: 'Economy',
      date: startDate || '2026-11-23',
      arrDate: startDate || '2026-11-23',
      depAirport: 'BOM',
      depCity: 'Mumbai',
      depTime: '04:15',
      depTerminal: 'T2',
      arrAirport: destCode,
      arrCity: destName,
      arrTime: '07:50',
      arrTerminal: 'T1',
      duration: '4h 35m',
      stops: 'Non-stop',
      baggageCheckIn: '23 kg Check-in',
      baggageCabin: '8 kg Cabin',
      layoverNotes: 'Direct non-stop flight'
    };

    const ret: FlightSector = {
      id: 'fl-sug-' + (Date.now() + 1),
      direction: 'return',
      airline: 'Azerbaijan Airlines',
      flightNumber: 'J2 057',
      cabinClass: 'Economy',
      date: endDate || '2026-11-28',
      arrDate: endDate || '2026-11-28',
      depAirport: destCode,
      depCity: destName,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Centered Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl border border-[rgba(55,53,47,0.1)] shadow-[0_20px_48px_rgba(15,15,15,0.16)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[rgba(55,53,47,0.09)] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-[16px] font-semibold text-[#37352F] tracking-tight">
              {flight ? 'Edit Flight Sector' : 'Flight Sector Manager'}
            </h2>
            <p className="text-[12.5px] text-[#787774] mt-0.5">
              Configured flights render as authentic boarding passes on Page 3 of the proposal.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#9B9A97] hover:text-[#37352F] hover:bg-[#F7F7F5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* 3 Top Tabs: Manual Entry | Import Screenshot | Auto-Suggest Route */}
        {!flight && (
          <div className="px-5 pt-3 pb-0 bg-[#F7F7F5] border-b border-[rgba(55,53,47,0.09)]">
            <div className="inline-flex bg-[#EFECE6]/80 p-1 rounded-lg border border-[rgba(55,53,47,0.08)] w-full">
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-1.5 text-[13px] rounded-[6px] transition-all duration-150 cursor-pointer font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                  activeTab === 'manual'
                    ? 'bg-white text-[#37352F] font-semibold shadow-[0_1px_2px_rgba(15,15,15,0.06),0_0_0_1px_rgba(55,53,47,0.06)]'
                    : 'text-[#787774] hover:text-[#37352F]'
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
                    ? 'bg-white text-[#37352F] font-semibold shadow-[0_1px_2px_rgba(15,15,15,0.06),0_0_0_1px_rgba(55,53,47,0.06)]'
                    : 'text-[#787774] hover:text-[#37352F]'
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
                    ? 'bg-white text-[#37352F] font-semibold shadow-[0_1px_2px_rgba(15,15,15,0.06),0_0_0_1px_rgba(55,53,47,0.06)]'
                    : 'text-[#787774] hover:text-[#37352F]'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-[#2383E2]" />
                <span>Auto-Suggest Route</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: MANUAL ENTRY */}
        {activeTab === 'manual' && (
          <form id="flight-modal-form" onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
            {/* Journey Direction Segmented Switcher */}
            <div>
              <label className="block text-[12.5px] font-medium text-[#37352F] mb-1.5">
                Journey Direction
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#EFECE6]/80 p-1 rounded-lg border border-[rgba(55,53,47,0.08)]">
                {(['onward', 'return', 'intercity'] as FlightDirection[]).map((dir) => {
                  const isSelected = formData.direction === dir;
                  const labelMap = {
                    onward: 'Outbound (Onward)',
                    return: 'Return (Inbound)',
                    intercity: 'Intercity'
                  };
                  return (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, direction: dir }))}
                      className={`py-1.5 text-[13px] rounded-[6px] transition-all duration-150 cursor-pointer font-medium active:scale-95 ${
                        isSelected
                          ? 'bg-white text-[#37352F] font-semibold shadow-[0_1px_2px_rgba(15,15,15,0.06),0_0_0_1px_rgba(55,53,47,0.06)]'
                          : 'text-[#787774] hover:text-[#37352F]'
                      }`}
                    >
                      {labelMap[dir]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carrier Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                  Airline Name
                </label>
                <input
                  type="text"
                  value={formData.airline}
                  onChange={(e) => setFormData(prev => ({ ...prev, airline: e.target.value }))}
                  placeholder="e.g. IndiGo, Emirates, SWISS"
                  required
                  className="h-10 w-full px-3.5 text-[14.5px] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] focus:ring-3 focus:ring-[#2383E2]/15 text-[#37352F] transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                  Flight Number
                </label>
                <input
                  type="text"
                  value={formData.flightNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, flightNumber: e.target.value }))}
                  placeholder="e.g. 6E 1803, EK 501"
                  required
                  className="h-10 w-full px-3.5 text-[14.5px] font-semibold uppercase bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] focus:ring-3 focus:ring-[#2383E2]/15 text-[#37352F] transition-all duration-150"
                />
              </div>
            </div>

            {/* Cabin Class & PNR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                  Cabin Class
                </label>
                <NotionSelect
                  value={formData.cabinClass || 'Economy'}
                  options={cabinClassOptions}
                  onChange={(val) => setFormData(prev => ({ ...prev, cabinClass: val }))}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                  PNR / Booking Ref <span className="text-[#9B9A97] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.pnr || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, pnr: e.target.value }))}
                  placeholder="e.g. WX9KL2"
                  className="h-10 w-full px-3.5 text-[14px] font-mono uppercase bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                />
              </div>
            </div>

            {/* Departure & Arrival Side-by-Side Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Departure Point Card */}
              <div className="p-3.5 bg-[#F7F7F5] rounded-xl border border-[rgba(55,53,47,0.09)] space-y-2.5">
                <div className="flex items-center gap-1.5 pb-2 border-b border-[rgba(55,53,47,0.09)]">
                  <span className="w-2 h-2 rounded-full bg-[#EB5757]" />
                  <span className="text-[11.5px] font-bold tracking-wider text-[#37352F] uppercase">
                    Departure Point
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#787774] mb-1">City</label>
                    <input
                      type="text"
                      value={formData.depCity}
                      onChange={(e) => setFormData(prev => ({ ...prev, depCity: e.target.value }))}
                      placeholder="e.g. Mumbai"
                      required
                      className="h-9 w-full px-2.5 text-[13.5px] bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#787774] mb-1">Airport Code</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.depAirport}
                      onChange={(e) => setFormData(prev => ({ ...prev, depAirport: e.target.value.toUpperCase() }))}
                      placeholder="BOM"
                      required
                      className="h-9 w-full px-2.5 text-[13.5px] font-bold uppercase bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#787774] mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                      className="h-9 w-full px-2 text-[13px] tabular-nums bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#787774] mb-1">Time (24h)</label>
                    <input
                      type="text"
                      value={formData.depTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, depTime: e.target.value }))}
                      placeholder="06:15"
                      required
                      className="h-9 w-full px-2 text-[13px] font-semibold tabular-nums bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#787774] mb-1">
                    Terminal <span className="text-[#9B9A97] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.depTerminal || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, depTerminal: e.target.value }))}
                    placeholder="e.g. T2"
                    className="h-8.5 w-full px-2.5 text-[13px] bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                  />
                </div>
              </div>

              {/* Arrival Point Card */}
              <div className="p-3.5 bg-[#F7F7F5] rounded-xl border border-[rgba(55,53,47,0.09)] space-y-2.5">
                <div className="flex items-center gap-1.5 pb-2 border-b border-[rgba(55,53,47,0.09)]">
                  <span className="w-2 h-2 rounded-full bg-[#2383E2]" />
                  <span className="text-[11.5px] font-bold tracking-wider text-[#37352F] uppercase">
                    Arrival Point
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#787774] mb-1">City</label>
                    <input
                      type="text"
                      value={formData.arrCity}
                      onChange={(e) => setFormData(prev => ({ ...prev, arrCity: e.target.value }))}
                      placeholder="e.g. Baku"
                      required
                      className="h-9 w-full px-2.5 text-[13.5px] bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#787774] mb-1">Airport Code</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.arrAirport}
                      onChange={(e) => setFormData(prev => ({ ...prev, arrAirport: e.target.value.toUpperCase() }))}
                      placeholder="GYD"
                      required
                      className="h-9 w-full px-2.5 text-[13.5px] font-bold uppercase bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#787774] mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.arrDate || formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, arrDate: e.target.value }))}
                      required
                      className="h-9 w-full px-2 text-[13px] tabular-nums bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#787774] mb-1">Time (24h)</label>
                    <input
                      type="text"
                      value={formData.arrTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, arrTime: e.target.value }))}
                      placeholder="10:45"
                      required
                      className="h-9 w-full px-2 text-[13px] font-semibold tabular-nums bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#787774] mb-1">
                    Terminal <span className="text-[#9B9A97] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.arrTerminal || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, arrTerminal: e.target.value }))}
                    placeholder="e.g. T1"
                    className="h-8.5 w-full px-2.5 text-[13px] bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                  />
                </div>
              </div>
            </div>

            {/* Duration & Stops */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                  Flight Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g. 4h 30m"
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                  Flight Routing / Stops
                </label>
                <NotionSelect
                  value={formData.stops || 'Non-stop'}
                  options={stopsOptions}
                  onChange={(val) => setFormData(prev => ({ ...prev, stops: val }))}
                />
              </div>
            </div>

            {/* Baggage Allowances */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                  Check-in Baggage Allowance
                </label>
                <input
                  type="text"
                  value={formData.baggageCheckIn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, baggageCheckIn: e.target.value }))}
                  placeholder="e.g. 20 kg Check-in"
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#37352F] mb-1.5">
                  Cabin Baggage Allowance
                </label>
                <input
                  type="text"
                  value={formData.baggageCabin || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, baggageCabin: e.target.value }))}
                  placeholder="e.g. 7 kg Cabin"
                  className="h-10 w-full px-3.5 text-[14px] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F]"
                />
              </div>
            </div>

            {/* Collapsible Layover / Connecting Section */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowLayover(!showLayover)}
                className="text-[13px] font-medium text-[#2383E2] hover:underline flex items-center gap-1.5 cursor-pointer py-1"
              >
                {showLayover ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showLayover ? 'Hide Layover & Transit Notes' : 'Add Connecting Layover / Transit Notes'}</span>
              </button>

              {showLayover && (
                <div className="mt-2 p-3 bg-[#F7F7F5] border border-[rgba(55,53,47,0.09)] rounded-lg space-y-2">
                  <label className="block text-[12px] font-semibold text-[#37352F]">
                    Layover & Transit Information
                  </label>
                  <textarea
                    rows={2}
                    value={formData.layoverNotes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, layoverNotes: e.target.value }))}
                    placeholder="e.g. 2h 15m Layover in Dubai International (DXB). Luggage checked through to final destination."
                    className="w-full px-3 py-2 text-[13.5px] bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] text-[#37352F] resize-none"
                  />
                </div>
              )}
            </div>

            {/* Mirrored Return Action */}
            {onDuplicateReturn && formData.direction === 'onward' && (
              <div className="p-3 bg-[#F7F7F5]/80 rounded-lg border border-[rgba(55,53,47,0.09)] flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-semibold text-[#37352F]">
                    Quick Mirrored Return Helper
                  </div>
                  <div className="text-[12px] text-[#787774]">
                    Inverts departure & arrival airports for return journey
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDuplicateReturn(formData)}
                  className="tactile-button-secondary h-8 px-3 rounded-lg text-[12.5px] font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Repeat className="w-3.5 h-3.5 text-[#787774]" />
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
              <h3 className="text-[16px] font-semibold text-[#37352F]">
                Smart Extraction from Screenshot or E-Ticket
              </h3>
              <p className="text-[13px] text-[#787774]">
                Drop or browse a booking confirmation screenshot, PDF e-ticket, or paste PNR text.
              </p>
            </div>

            <div 
              onClick={importStatus === 'idle' ? handleSimulateImport : undefined}
              className="border-2 border-dashed border-[rgba(55,53,47,0.18)] hover:border-[#2383E2] rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#F7F7F5]/50 max-w-lg mx-auto"
            >
              {importStatus === 'idle' && (
                <div className="space-y-2.5">
                  <UploadCloud className="w-10 h-10 text-[#2383E2] mx-auto" strokeWidth={1.75} />
                  <div className="text-[14px] font-semibold text-[#37352F]">
                    Click to browse or drop flight ticket image
                  </div>
                  <div className="text-[12px] text-[#9B9A97]">
                    Extracts carrier, flight code, terminals, times, and baggage automatically
                  </div>
                </div>
              )}

              {importStatus === 'parsing' && (
                <div className="space-y-2 py-4">
                  <div className="w-7 h-7 border-2 border-[#2383E2] border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-[14px] font-semibold text-[#37352F]">
                    Scanning ticket details...
                  </div>
                  <div className="text-[12px] text-[#9B9A97]">
                    Detecting route schedule and booking codes
                  </div>
                </div>
              )}

              {importStatus === 'done' && (
                <div className="space-y-2 py-2">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div className="text-[14px] font-semibold text-emerald-800">
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
              <h3 className="text-[16px] font-semibold text-[#37352F]">
                Auto-Suggest Recommended Flight Sectors
              </h3>
              <p className="text-[13px] text-[#787774]">
                Generates best-fit round-trip flight sectors based on destination ({destinations[0] || 'Baku'}) and trip duration.
              </p>
            </div>

            <div className="max-w-lg mx-auto bg-[#F7F7F5] border border-[rgba(55,53,47,0.09)] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(55,53,47,0.09)]">
                <span className="text-[12px] font-semibold uppercase text-[#787774]">
                  Proposed Route
                </span>
                <span className="text-[12px] font-medium text-[#2383E2] bg-white px-2 py-0.5 rounded-md border border-[rgba(55,53,47,0.08)] shadow-2xs">
                  Round-Trip (2 Sectors)
                </span>
              </div>

              <div className="space-y-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#37352F]">Outbound:</span>
                  <span>BOM (04:15) → GYD (07:50) • Azerbaijan Airlines J2 058</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#37352F]">Return:</span>
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
          <div className="px-5 py-3.5 bg-[#F7F7F5] border-t border-[rgba(55,53,47,0.09)] flex items-center justify-end gap-2.5">
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
