import React, { useState } from 'react';
import { Proposal } from '../../types/proposal';
import { PdfPageCover } from '../pdf/PdfPageCover';
import { PdfPageItinerary } from '../pdf/PdfPageItinerary';
import { PdfPageFlightsStays } from '../pdf/PdfPageFlightsStays';
import { PdfPagePricing } from '../pdf/PdfPagePricing';
import { 
  ChevronLeft, 
  ChevronRight, 
  Minus, 
  Plus, 
  Maximize2, 
  X
} from 'lucide-react';

interface LiveA4PreviewPaneProps {
  proposal: Proposal;
}

export const LiveA4PreviewPane: React.FC<LiveA4PreviewPaneProps> = ({ proposal }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const totalPages = 4;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(130, prev + 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(70, prev - 5));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 1:
        return <PdfPageCover proposal={proposal} />;
      case 2:
        return <PdfPageItinerary proposal={proposal} />;
      case 3:
        return <PdfPageFlightsStays proposal={proposal} />;
      case 4:
        return <PdfPagePricing proposal={proposal} />;
      default:
        return <PdfPageCover proposal={proposal} />;
    }
  };

  return (
    <div className="w-full flex flex-col rounded-lg border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden select-none">
      {/* 1. Frosted Sticky Preview Toolbar */}
      <div className="h-10 bg-white/90 backdrop-blur-xl border-b border-black/[0.06] px-3 flex items-center justify-between sticky top-0 z-20 shrink-0">
        {/* Left: 4 Pages pill badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 text-[12px] font-medium text-[#6E6E73] bg-[#F5F5F7] border border-black/[0.04] rounded whitespace-nowrap tabular-nums">
            4 Pages A4
          </span>
        </div>

        {/* Center: Page stepper (< 1 / 4 >) */}
        <div className="flex items-center gap-1 shrink-0 bg-[#F5F5F7] border border-black/[0.06] rounded-md p-0.5">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-5.5 h-5.5 rounded flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-[13px] font-semibold text-[#1D1D1F] tabular-nums px-1.5 min-w-[34px] text-center">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="w-5.5 h-5.5 rounded flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            title="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Zoom controls (-, 100%, +, Reset/Fit) + Full-screen preview toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center border border-black/[0.06] rounded-md bg-[#F5F5F7] p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 70}
              className="w-5.5 h-5.5 rounded flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white disabled:opacity-30 transition-all cursor-pointer"
              title="Zoom out"
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="text-[12px] font-semibold text-[#1D1D1F] tabular-nums px-1 min-w-[34px] text-center">
              {zoom}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 130}
              className="w-5.5 h-5.5 rounded flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white disabled:opacity-30 transition-all cursor-pointer"
              title="Zoom in"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetZoom}
            className="h-6.5 px-2 text-[12px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-md border border-black/[0.06] transition-all cursor-pointer"
            title="Reset zoom to 100%"
          >
            Fit
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreen(true)}
            className="w-6.5 h-6.5 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-md border border-black/[0.06] transition-all cursor-pointer"
            title="Open full-screen A4 preview"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Elevated A4 Document Canvas */}
      <div className="bg-[#F5F5F7] p-3 flex justify-center items-start overflow-y-auto overflow-x-hidden min-h-[640px] max-h-[calc(100vh-210px)]">
        <div 
          style={{ 
            transform: `scale(${zoom / 100})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="w-full max-w-[540px] aspect-[1/1.414] rounded-md shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-black/[0.08] overflow-hidden bg-[#0A131F] shrink-0"
        >
          {renderActivePage()}
        </div>
      </div>

      {/* Page Navigation Quick Switcher Bar at Bottom */}
      <div className="px-4 py-2 bg-white border-t border-black/[0.06] flex items-center justify-between text-[13px] text-[#6E6E73]">
        <span className="font-medium text-[#1D1D1F]">
          {currentPage === 1 && 'Page 1 · Luxury Cover & Trip Summary'}
          {currentPage === 2 && 'Page 2 · Day-by-Day Curated Itinerary'}
          {currentPage === 3 && 'Page 3 · Flights & Accommodations'}
          {currentPage === 4 && 'Page 4 · Commercial Quote & Inclusions'}
        </span>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-6 h-6 rounded text-[12px] font-semibold tabular-nums transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-[#0071E3] text-white shadow-xs'
                  : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#E5E5EA]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Full-Screen Preview Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-black/80 backdrop-blur-md p-4 sm:p-6">
          {/* Modal Header */}
          <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold tracking-tight">Full-Screen A4 Preview</span>
              <span className="text-[13px] text-[#86868B]">· Page {currentPage} of {totalPages}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Stepper inside modal */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[13px] font-semibold px-2 tabular-nums text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close full-screen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body Canvas */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <div className="w-full max-w-[560px] aspect-[1/1.414] rounded-xl shadow-2xl overflow-hidden bg-[#0A131F] border border-white/15">
              {renderActivePage()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
