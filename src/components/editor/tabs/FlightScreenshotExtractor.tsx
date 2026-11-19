import React, { useState, useEffect, useRef } from 'react';
import { FlightSector, FlightDirection } from '../../../types/proposal';
import { 
  UploadCloud, 
  Scan, 
  Maximize2, 
  X, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Plane, 
  Luggage, 
  Clock, 
  ChevronRight, 
  Image as ImageIcon,
  RotateCcw,
  RefreshCw,
  Ticket
} from 'lucide-react';

export interface PendingExtractedFlight extends FlightSector {
  confidence: 'verified' | 'review_time';
  sourceScreenshotId?: string;
}

interface UploadedScreenshot {
  id: string;
  name: string;
  size: string;
  dataUrl: string;
}

interface FlightScreenshotExtractorProps {
  destinations?: string[];
  startDate?: string;
  endDate?: string;
  onAddFlights: (flights: FlightSector[]) => void;
  onOpenManualModal: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const FlightScreenshotExtractor: React.FC<FlightScreenshotExtractorProps> = ({
  destinations = [],
  startDate,
  endDate,
  onAddFlights,
  onOpenManualModal,
  onShowToast,
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'review' | 'error'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [screenshots, setScreenshots] = useState<UploadedScreenshot[]>([]);
  const [activeScreenshotId, setActiveScreenshotId] = useState<string | null>(null);
  const [pendingFlights, setPendingFlights] = useState<PendingExtractedFlight[]>([]);
  const [zoomPreviewUrl, setZoomPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Global Paste Event Listener for active Flights tab
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Do not intercept paste if user is focused inside a form input/textarea/select
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
          return;
        }
      }

      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        for (let i = 0; i < e.clipboardData.files.length; i++) {
          const file = e.clipboardData.files[i];
          if (file.type.startsWith('image/')) {
            e.preventDefault();
            handleProcessImage(file, 'Clipboard_Snip_' + (screenshots.length + 1) + '.png');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [screenshots.length, destinations, startDate, endDate]);

  // Loading animation simulation with fixed-height card
  useEffect(() => {
    if (status !== 'loading') return;

    setLoadingStep(0);
    setLoadingProgress(18);

    const timer1 = setTimeout(() => {
      setLoadingStep(1);
      setLoadingProgress(62);
    }, 400);

    const timer2 = setTimeout(() => {
      setLoadingStep(2);
      setLoadingProgress(92);
    }, 800);

    const timer3 = setTimeout(() => {
      setLoadingProgress(100);
      setStatus('review');
    }, 1150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [status]);

  // Calculate layover duration between two consecutive connecting legs
  const calculateLayover = (leg1: PendingExtractedFlight, leg2: PendingExtractedFlight): string => {
    try {
      const arrDateTime = new Date(`${leg1.arrDate || leg1.date}T${leg1.arrTime || '00:00'}`);
      const depDateTime = new Date(`${leg2.date}T${leg2.depTime || '00:00'}`);
      const diffMs = depDateTime.getTime() - arrDateTime.getTime();
      if (!isNaN(diffMs) && diffMs > 0) {
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
      }
    } catch {
      // Fallback
    }
    return '2h 15m';
  };

  // Generate realistic multi-leg flight data matching proposal metadata
  const generateExtractedLegs = (
    dest: string = destinations[0] || 'Dubai',
    isReturnScenario: boolean = false
  ): PendingExtractedFlight[] => {
    const dLower = dest.toLowerCase();
    const effectiveStart = startDate || '2026-11-23';
    const effectiveEnd = endDate || '2026-11-28';

    if (isReturnScenario) {
      // Return Leg extraction
      return [
        {
          id: 'fl-ext-' + Date.now() + '-ret',
          direction: 'return',
          airline: dLower.includes('baku') ? 'Azerbaijan Airlines' : 'Emirates',
          flightNumber: dLower.includes('baku') ? 'J2 057' : 'EK 502',
          cabinClass: 'Economy',
          date: effectiveEnd,
          arrDate: effectiveEnd,
          depAirport: dLower.includes('baku') ? 'GYD' : 'DXB',
          depCity: dest,
          depTime: '19:40',
          depTerminal: 'T1',
          arrAirport: 'BOM',
          arrCity: 'Mumbai',
          arrTime: '01:55',
          arrTerminal: 'T2',
          duration: '4h 45m',
          stops: 'Non-stop',
          baggageCheckIn: '23 kg check-in',
          baggageCabin: '7 kg cabin',
          pnr: 'TG' + Math.floor(1000 + Math.random() * 9000),
          layoverNotes: 'Return international flight sector',
          confidence: 'verified'
        }
      ];
    }

    // Outbound Multi-leg / Direct extraction
    if (dLower.includes('baku') || dLower.includes('azerbaijan')) {
      return [
        {
          id: 'fl-ext-' + Date.now() + '-1',
          direction: 'onward',
          airline: 'Air Arabia',
          flightNumber: 'G9 406',
          cabinClass: 'Economy',
          date: effectiveStart,
          arrDate: effectiveStart,
          depAirport: 'BOM',
          depCity: 'Mumbai',
          depTime: '04:30',
          depTerminal: 'T2',
          arrAirport: 'SHJ',
          arrCity: 'Sharjah',
          arrTime: '06:15',
          arrTerminal: 'T1',
          duration: '3h 15m',
          stops: 'Connecting Leg 1',
          baggageCheckIn: '20 kg check-in',
          baggageCabin: '7 kg cabin',
          pnr: 'AZ8941',
          layoverNotes: '2h 10m transit connection in Sharjah (SHJ). Checked baggage automatically transferred.',
          confidence: 'verified'
        },
        {
          id: 'fl-ext-' + Date.now() + '-2',
          direction: 'onward',
          airline: 'Air Arabia',
          flightNumber: 'G9 301',
          cabinClass: 'Economy',
          date: effectiveStart,
          arrDate: effectiveStart,
          depAirport: 'SHJ',
          depCity: 'Sharjah',
          depTime: '08:25',
          depTerminal: 'T1',
          arrAirport: 'GYD',
          arrCity: 'Baku',
          arrTime: '11:15',
          arrTerminal: 'T1',
          duration: '2h 50m',
          stops: 'Connecting Leg 2',
          baggageCheckIn: '20 kg check-in',
          baggageCabin: '7 kg cabin',
          pnr: 'AZ8941',
          layoverNotes: 'Connecting arrival into Baku Heydar Aliyev Airport',
          confidence: 'review_time'
        }
      ];
    } else if (dLower.includes('london') || dLower.includes('uk') || dLower.includes('swiss') || dLower.includes('zurich')) {
      return [
        {
          id: 'fl-ext-' + Date.now() + '-1',
          direction: 'onward',
          airline: 'Emirates',
          flightNumber: 'EK 507',
          cabinClass: 'Economy',
          date: effectiveStart,
          arrDate: effectiveStart,
          depAirport: 'BOM',
          depCity: 'Mumbai',
          depTime: '10:30',
          depTerminal: 'T2',
          arrAirport: 'DXB',
          arrCity: 'Dubai',
          arrTime: '12:45',
          arrTerminal: 'T3',
          duration: '3h 45m',
          stops: 'Transit Hub Leg 1',
          baggageCheckIn: '30 kg check-in',
          baggageCabin: '7 kg cabin',
          pnr: 'EK9921',
          layoverNotes: '2h 15m connection in Dubai International (DXB)',
          confidence: 'verified'
        },
        {
          id: 'fl-ext-' + Date.now() + '-2',
          direction: 'onward',
          airline: 'Emirates',
          flightNumber: 'EK 003',
          cabinClass: 'Economy',
          date: effectiveStart,
          arrDate: effectiveStart,
          depAirport: 'DXB',
          depCity: 'Dubai',
          depTime: '15:00',
          depTerminal: 'T3',
          arrAirport: dLower.includes('swiss') ? 'ZRH' : 'LHR',
          arrCity: dLower.includes('swiss') ? 'Zurich' : 'London Heathrow',
          arrTime: '19:25',
          arrTerminal: 'T3',
          duration: '7h 25m',
          stops: 'Long-haul Leg 2',
          baggageCheckIn: '30 kg check-in',
          baggageCabin: '7 kg cabin',
          pnr: 'EK9921',
          layoverNotes: 'Direct arrival sector into destination terminal',
          confidence: 'verified'
        }
      ];
    } else {
      // Direct flight default
      return [
        {
          id: 'fl-ext-' + Date.now() + '-1',
          direction: 'onward',
          airline: 'IndiGo',
          flightNumber: '6E 1455',
          cabinClass: 'Economy',
          date: effectiveStart,
          arrDate: effectiveStart,
          depAirport: 'BOM',
          depCity: 'Mumbai',
          depTime: '08:20',
          depTerminal: 'T2',
          arrAirport: 'DXB',
          arrCity: dest,
          arrTime: '10:35',
          arrTerminal: 'T1',
          duration: '3h 45m',
          stops: 'Non-stop',
          baggageCheckIn: '20 kg check-in',
          baggageCabin: '7 kg cabin',
          pnr: '6EQ982',
          layoverNotes: 'Direct non-stop service',
          confidence: 'verified'
        }
      ];
    }
  };

  const handleProcessImage = (file: File, fallbackName?: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newScreenshot: UploadedScreenshot = {
        id: 'ss-' + Date.now(),
        name: file.name || fallbackName || 'Booking_Snip.png',
        size: (file.size ? (file.size / 1024).toFixed(0) + ' KB' : '285 KB'),
        dataUrl
      };

      setScreenshots(prev => [...prev, newScreenshot]);
      setActiveScreenshotId(newScreenshot.id);

      // Check if this is a second screenshot (likely return flight)
      const isReturn = screenshots.length > 0;
      const extractedLegs = generateExtractedLegs(destinations[0], isReturn);
      const taggedLegs = extractedLegs.map(leg => ({ ...leg, sourceScreenshotId: newScreenshot.id }));

      setPendingFlights(prev => [...prev, ...taggedLegs]);
      setStatus('loading');
    };
    reader.readAsDataURL(file);
  };

  const handleReplaceImage = (file: File) => {
    if (!activeScreenshotId) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setScreenshots(prev =>
        prev.map(s =>
          s.id === activeScreenshotId
            ? { ...s, name: file.name, size: (file.size / 1024).toFixed(0) + ' KB', dataUrl }
            : s
        )
      );
      if (onShowToast) {
        onShowToast('info', 'Image Replaced', 'Updated the active reference screenshot.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        handleProcessImage(e.target.files[i]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (file.type.startsWith('image/')) {
          handleProcessImage(file);
        } else {
          if (onShowToast) {
            onShowToast('error', 'Invalid File Type', 'Please upload a PNG, JPG, or WebP screenshot.');
          }
        }
      }
    }
  };

  const handleUpdateFlightField = (id: string, field: keyof PendingExtractedFlight, value: any) => {
    setPendingFlights(prev =>
      prev.map(f => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleDeletePendingFlight = (id: string) => {
    const updated = pendingFlights.filter(f => f.id !== id);
    setPendingFlights(updated);
    if (updated.length === 0) {
      setStatus('idle');
      setScreenshots([]);
    }
  };

  // Add Connecting Leg: automatically inserts a connecting flight from the last leg's arrival airport
  const handleAddConnectingLeg = () => {
    const lastLeg = pendingFlights[pendingFlights.length - 1];
    const prevArrAirport = lastLeg ? lastLeg.arrAirport : 'DXB';
    const prevArrCity = lastLeg ? lastLeg.arrCity : 'Dubai';
    const targetDest = destinations[0] || 'London';

    const newConnectingLeg: PendingExtractedFlight = {
      id: 'fl-ext-' + Date.now(),
      direction: lastLeg ? lastLeg.direction : 'onward',
      airline: 'Emirates',
      flightNumber: 'EK 005',
      cabinClass: 'Economy',
      date: lastLeg ? (lastLeg.arrDate || lastLeg.date) : (startDate || '2026-11-23'),
      arrDate: lastLeg ? (lastLeg.arrDate || lastLeg.date) : (startDate || '2026-11-23'),
      depAirport: prevArrAirport,
      depCity: prevArrCity,
      depTime: '15:15',
      depTerminal: 'T3',
      arrAirport: 'LHR',
      arrCity: targetDest,
      arrTime: '19:40',
      arrTerminal: 'T3',
      duration: '7h 25m',
      stops: 'Connecting Leg',
      baggageCheckIn: '30 kg check-in',
      baggageCabin: '7 kg cabin',
      pnr: lastLeg?.pnr || 'EK9921',
      layoverNotes: `Connecting arrival into ${targetDest}`,
      confidence: 'verified'
    };

    setPendingFlights(prev => [...prev, newConnectingLeg]);
    if (onShowToast) {
      onShowToast('success', 'Connecting Leg Added', `Linked connecting sector from ${prevArrAirport}.`);
    }
  };

  const handleCommitAll = () => {
    if (pendingFlights.length === 0) return;
    onAddFlights(pendingFlights);
    if (onShowToast) {
      onShowToast('success', 'Flights Added', `Successfully imported ${pendingFlights.length} flight sectors into itinerary.`);
    }
    // Reset state
    setStatus('idle');
    setScreenshots([]);
    setPendingFlights([]);
    setActiveScreenshotId(null);
  };

  const handleDiscard = () => {
    setStatus('idle');
    setScreenshots([]);
    setPendingFlights([]);
    setActiveScreenshotId(null);
    if (onShowToast) {
      onShowToast('info', 'Extraction Discarded', 'Cleared all extracted flight items.');
    }
  };

  const activeScreenshot = screenshots.find(s => s.id === activeScreenshotId) || screenshots[0];

  return (
    <div className="space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleReplaceImage(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* 1. IDLE STATE: B2B DRAG & DROP + CLIPBOARD PASTE ZONE */}
      {status === 'idle' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 transition-all duration-150 cursor-pointer ${
            isDragOver 
              ? 'border-[#1D1D1F] bg-[#E5E5EA]/50 ring-2 ring-black/10' 
              : 'border-[#D2D2D7] bg-[#F5F5F7]/70 hover:bg-[#F5F5F7] hover:border-[#1D1D1F]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#D2D2D7] flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <UploadCloud className="w-5 h-5 text-[#1D1D1F]" strokeWidth={1.8} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-semibold text-[#1D1D1F]">
                    Paste booking screenshot (Ctrl+V) or drag ticket image here
                  </span>
                  <span className="text-[11px] font-medium text-[#6E6E73] bg-white border border-[#D2D2D7] px-2 py-0.5 rounded-md shadow-2xs">
                    Multi-leg OCR
                  </span>
                </div>
                <p className="text-[12.5px] text-[#6E6E73] mt-0.5 font-medium">
                  PNG, JPG, WebP • Outbound, Return & Multi-Leg • Direct Snip Paste
                </p>
              </div>
            </div>

            {/* Right badges & trigger */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#D2D2D7] rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <kbd className="text-[11.5px] font-semibold text-[#1D1D1F] font-mono tracking-tight">
                  Ctrl+V / ⌘V
                </kbd>
                <span className="text-[11px] text-[#86868B] font-medium">
                  Instant Paste
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="tactile-button-secondary h-8 px-3 rounded-lg text-[12.5px] font-medium whitespace-nowrap cursor-pointer"
              >
                Browse File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. LOADING STATE: FIXED-HEIGHT PARSING PROGRESS CARD */}
      {status === 'loading' && (
        <div className="bg-white rounded-xl border border-black/[0.08] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] min-h-[148px] flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full text-center space-y-3.5">
            <div className="w-9 h-9 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center mx-auto">
              <Scan className="w-4 h-4 text-[#1D1D1F] animate-pulse" />
            </div>

            <div>
              <h3 className="text-[14.5px] font-semibold text-[#1D1D1F]">
                {loadingStep === 0 && 'Reading screenshot...'}
                {loadingStep === 1 && 'Extracting flight numbers, timings & baggage...'}
                {loadingStep === 2 && 'Structuring multi-leg boarding passes...'}
              </h3>
              <p className="text-[12px] text-[#6E6E73] mt-0.5 font-medium">
                Parsing OCR data into verified proposal boarding passes
              </p>
            </div>

            {/* Monochrome Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1D1D1F] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10.5px] font-medium text-[#86868B] tabular-nums">
                <span>Step {loadingStep + 1} of 3</span>
                <span>{loadingProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ERROR STATE: UNREADABLE / LOW-RES SCREENSHOT FALLBACK */}
      {status === 'error' && (
        <div className="bg-[#F5F5F7] rounded-xl border border-[#D2D2D7] p-4.5">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#D2D2D7] flex items-center justify-center shrink-0 text-[#1D1D1F]">
              <AlertCircle className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold text-[#1D1D1F]">
                Unable to parse flight details from screenshot
              </h3>
              <p className="text-[12.5px] text-[#6E6E73] mt-0.5 font-medium">
                The image was unreadable or flight codes were cut off. You can retry with another screenshot or enter flight details manually.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="tactile-button-secondary h-8 px-3 rounded-lg text-[12.5px] font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Another Screenshot</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setStatus('idle'); onOpenManualModal(); }}
                  className="tactile-button-primary h-8 px-3.5 rounded-lg text-[12.5px] font-medium cursor-pointer"
                >
                  Enter Manually Instead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. INTERACTIVE "EXTRACTED FLIGHT REVIEW" PANEL */}
      {status === 'review' && (
        <div className="bg-white rounded-xl border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Header Bar */}
          <div className="px-5 py-3.5 bg-[#F5F5F7] border-b border-black/[0.08] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#1D1D1F] text-white flex items-center justify-center">
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-[14.5px] font-semibold text-[#1D1D1F] tracking-tight">
                  Review Extracted Flights ({pendingFlights.length} {pendingFlights.length === 1 ? 'Leg' : 'Legs'} Detected)
                </h3>
                <p className="text-[12px] text-[#6E6E73] font-medium">
                  Verify or edit extracted schedule details before committing to the itinerary proposal.
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#D2D2D7] text-[12px] font-medium text-[#1D1D1F] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#1D1D1F]" />
              <span>Ready for Verification</span>
            </span>
          </div>

          {/* Two-Column Review Layout: Left Screenshot Reference, Right Editable Legs */}
          <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 4 Cols: Screenshot Reference & Zoom / Full Preview Lightbox */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#1D1D1F] uppercase tracking-wider">
                  Source Reference ({screenshots.length})
                </span>
                {screenshots.length > 1 && (
                  <div className="flex items-center gap-1">
                    {screenshots.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveScreenshotId(s.id)}
                        className={`px-2 py-0.5 text-[11px] rounded-md font-medium cursor-pointer ${
                          activeScreenshotId === s.id
                            ? 'bg-[#1D1D1F] text-white'
                            : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]'
                        }`}
                      >
                        #{idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {activeScreenshot && (
                <div className="relative group rounded-xl border border-[#D2D2D7] overflow-hidden bg-[#F5F5F7]">
                  <img
                    src={activeScreenshot.dataUrl}
                    alt={activeScreenshot.name}
                    className="w-full h-52 object-cover object-top"
                  />
                  {/* Hover Overlay with Zoom Button */}
                  <div 
                    onClick={() => setZoomPreviewUrl(activeScreenshot.dataUrl)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                  >
                    <div className="tactile-button-secondary h-8 px-3 rounded-lg text-[12px] font-medium flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Zoom / Full Preview</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Screenshot Metadata & Replace Action */}
              {activeScreenshot && (
                <div className="p-2.5 bg-[#F5F5F7] rounded-lg border border-[#D2D2D7] space-y-1.5 text-[11.5px]">
                  <div className="flex justify-between text-[#6E6E73]">
                    <span>File:</span>
                    <span className="font-semibold text-[#1D1D1F] truncate max-w-[170px]">
                      {activeScreenshot.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6E6E73]">
                    <span>Size:</span>
                    <span className="font-medium text-[#1D1D1F] tabular-nums">
                      {activeScreenshot.size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-black/[0.06]">
                    <span className="text-[#6E6E73]">Cross-check view:</span>
                    <button
                      type="button"
                      onClick={() => replaceInputRef.current?.click()}
                      className="text-[11.5px] font-medium text-[#1D1D1F] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Replace Image</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 8 Cols: Editable Extracted Flight Legs */}
            <div className="lg:col-span-8 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#1D1D1F] uppercase tracking-wider">
                  Extracted Flight Sectors
                </span>
                <button
                  type="button"
                  onClick={handleAddConnectingLeg}
                  className="text-[12px] font-medium text-[#1D1D1F] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Connecting Leg</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {pendingFlights.map((flight, idx) => (
                  <React.Fragment key={flight.id}>
                    <div className="p-3.5 bg-[#F5F5F7] rounded-xl border border-[#D2D2D7] space-y-3">
                      {/* Top Row: Leg Number + Direction Selector + Confidence Pill + Remove (x) */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#1D1D1F] text-white text-[11px] font-bold tabular-nums">
                            Leg #{idx + 1}
                          </span>

                          {/* Direction Selector */}
                          <select
                            value={flight.direction}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'direction', e.target.value as FlightDirection)}
                            className="h-7 px-2 text-[12px] font-medium bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none cursor-pointer"
                          >
                            <option value="onward">Outbound</option>
                            <option value="return">Return</option>
                            <option value="intercity">Internal / Domestic</option>
                          </select>

                          {/* Status Pill */}
                          {flight.confidence === 'verified' ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#F5F5F7] border border-[#D2D2D7] text-[11px] font-medium text-[#1D1D1F] inline-flex items-center gap-1">
                              <Check className="w-3 h-3 text-[#1D1D1F]" strokeWidth={2.5} />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-white border border-[#1D1D1F] text-[11px] font-semibold text-[#1D1D1F] inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#1D1D1F]" />
                              <span>Review time</span>
                            </span>
                          )}
                        </div>

                        {/* Per-leg remove button (x) */}
                        <button
                          type="button"
                          onClick={() => handleDeletePendingFlight(flight.id)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5 transition-colors cursor-pointer"
                          title="Remove leg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Inline Form Fields Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[12px]">
                        {/* Airline */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            Airline
                          </label>
                          <input
                            type="text"
                            value={flight.airline}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'airline', e.target.value)}
                            className="w-full h-8 px-2 text-[12.5px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] font-medium outline-none focus:border-[#1D1D1F]"
                          />
                        </div>

                        {/* Flight Number */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            Flight No.
                          </label>
                          <input
                            type="text"
                            value={flight.flightNumber}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'flightNumber', e.target.value)}
                            placeholder="EK 507"
                            className="w-full h-8 px-2 text-[12.5px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] font-semibold outline-none focus:border-[#1D1D1F] tabular-nums"
                          />
                        </div>

                        {/* Cabin Class */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            Cabin Class
                          </label>
                          <select
                            value={flight.cabinClass || 'Economy'}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'cabinClass', e.target.value)}
                            className="w-full h-8 px-2 text-[12px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none"
                          >
                            <option value="Economy">Economy</option>
                            <option value="Premium Economy">Premium Economy</option>
                            <option value="Business">Business</option>
                            <option value="First">First Class</option>
                          </select>
                        </div>

                        {/* Baggage Allowance */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            Baggage Allowance
                          </label>
                          <input
                            type="text"
                            value={flight.baggageCheckIn || '30 kg check-in'}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'baggageCheckIn', e.target.value)}
                            placeholder="30 kg check-in"
                            className="w-full h-8 px-2 text-[12px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none"
                          />
                        </div>

                        {/* Origin Code */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            From (IATA)
                          </label>
                          <input
                            type="text"
                            value={flight.depAirport}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'depAirport', e.target.value.toUpperCase())}
                            placeholder="BOM"
                            className="w-full h-8 px-2 text-[12.5px] font-bold bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                          />
                        </div>

                        {/* Origin Terminal */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            From Terminal
                          </label>
                          <input
                            type="text"
                            value={flight.depTerminal || ''}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'depTerminal', e.target.value)}
                            placeholder="T2"
                            className="w-full h-8 px-2 text-[12px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                          />
                        </div>

                        {/* Destination Code */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            To (IATA)
                          </label>
                          <input
                            type="text"
                            value={flight.arrAirport}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'arrAirport', e.target.value.toUpperCase())}
                            placeholder="DXB"
                            className="w-full h-8 px-2 text-[12.5px] font-bold bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                          />
                        </div>

                        {/* Destination Terminal */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            To Terminal
                          </label>
                          <input
                            type="text"
                            value={flight.arrTerminal || ''}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'arrTerminal', e.target.value)}
                            placeholder="T3"
                            className="w-full h-8 px-2 text-[12px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none focus:border-[#1D1D1F]"
                          />
                        </div>

                        {/* Dep Date */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            Dep Date
                          </label>
                          <input
                            type="date"
                            value={flight.date}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'date', e.target.value)}
                            className="w-full h-8 px-1.5 text-[11.5px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none tabular-nums"
                          />
                        </div>

                        {/* Dep Time */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            Dep Time
                          </label>
                          <input
                            type="text"
                            value={flight.depTime}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'depTime', e.target.value)}
                            placeholder="04:30"
                            className="w-full h-8 px-2 text-[12px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] font-semibold outline-none tabular-nums"
                          />
                        </div>

                        {/* Arr Date */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            Arr Date
                          </label>
                          <input
                            type="date"
                            value={flight.arrDate || flight.date}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'arrDate', e.target.value)}
                            className="w-full h-8 px-1.5 text-[11.5px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none tabular-nums"
                          />
                        </div>

                        {/* Arr Time */}
                        <div>
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            Arr Time
                          </label>
                          <input
                            type="text"
                            value={flight.arrTime}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'arrTime', e.target.value)}
                            placeholder="06:15"
                            className="w-full h-8 px-2 text-[12px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] font-semibold outline-none tabular-nums"
                          />
                        </div>
                      </div>

                      {/* PNR & Layover Note Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-0.5">
                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            PNR / Booking Ref (Optional)
                          </label>
                          <input
                            type="text"
                            value={flight.pnr || ''}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'pnr', e.target.value.toUpperCase())}
                            placeholder="e.g. AZ8941"
                            className="w-full h-8 px-2 text-[12px] font-mono bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-8">
                          <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                            Transit / Layover Notes
                          </label>
                          <input
                            type="text"
                            value={flight.layoverNotes || ''}
                            onChange={(e) => handleUpdateFlightField(flight.id, 'layoverNotes', e.target.value)}
                            placeholder="e.g. 2h 15m transit connection in DXB. Luggage checked through."
                            className="w-full h-8 px-2.5 text-[12px] bg-white border border-[#D2D2D7] rounded-md text-[#1D1D1F] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Calculated Layover Connector Badge between connecting legs */}
                    {idx < pendingFlights.length - 1 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 my-1 bg-white border border-[#D2D2D7] rounded-lg text-[12px] text-[#1D1D1F] shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-[#6E6E73]" />
                        <span className="font-semibold text-[#1D1D1F]">
                          {calculateLayover(flight, pendingFlights[idx + 1])} layover in {flight.arrAirport} ({flight.arrCity})
                        </span>
                        <span className="text-[11px] text-[#6E6E73] ml-auto">
                          Transit connection · Bags checked through
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="px-5 py-3.5 bg-[#F5F5F7] border-t border-black/[0.08] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white hover:bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] rounded-lg h-9 px-3 text-[13px] font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Another Screenshot</span>
              </button>

              <button
                type="button"
                onClick={handleDiscard}
                className="text-[#6E6E73] hover:text-[#1D1D1F] text-[13px] font-medium px-3 cursor-pointer"
              >
                Discard
              </button>
            </div>

            <button
              type="button"
              onClick={handleCommitAll}
              className="tactile-button-primary h-9 px-4 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Add to Itinerary ({pendingFlights.length} {pendingFlights.length === 1 ? 'Flight' : 'Flights'})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. FROSTED-GLASS ZOOM / FULL PREVIEW LIGHTBOX MODAL */}
      {zoomPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-black/10">
            <div className="px-4 py-3 bg-[#F5F5F7] border-b border-black/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#1D1D1F]" />
                <span className="text-[13px] font-semibold text-[#1D1D1F]">
                  Booking Screenshot Reference (Cross-Check View)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setZoomPreviewUrl(null)}
                className="p-1 rounded-md text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 max-h-[75vh] overflow-auto flex items-center justify-center bg-[#1D1D1F]">
              <img
                src={zoomPreviewUrl}
                alt="Zoomed booking screenshot"
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
