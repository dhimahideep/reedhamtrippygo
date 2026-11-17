import React from 'react';
import { Proposal } from '../../types/proposal';
import { formatINR, calculateCommercials } from '../../data/formatters';
import { 
  X, 
  FileCheck, 
  Printer, 
  Share2, 
  Download, 
  Check 
} from 'lucide-react';

interface PdfGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
}

export const PdfGenerateModal: React.FC<PdfGenerateModalProps> = ({
  isOpen,
  onClose,
  proposal,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const commercials = calculateCommercials(proposal.pricing, proposal.adults, proposal.children);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://trippygo.travel/proposals/${proposal.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proposal, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${proposal.code}-proposal.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-[0_20px_48px_rgba(15,15,15,0.16)] border border-[rgba(55,53,47,0.1)] max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#2383E2] text-white flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
              <FileCheck className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                PDF Quotation Generated
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {proposal.code} · Ready for presentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Summary */}
        <div className="p-4 space-y-3.5 text-xs">
          <div className="bg-[#F7F7F5]/70 border border-[rgba(55,53,47,0.08)] rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-[#787774]">
              <span>Client Name:</span>
              <span className="font-semibold text-[#37352F]">{proposal.clientName}</span>
            </div>
            <div className="flex justify-between items-center text-[#787774]">
              <span>Trip Duration:</span>
              <span className="font-medium text-[#37352F]">{proposal.nights}N / {proposal.days}D</span>
            </div>
            <div className="flex justify-between items-center text-[#787774]">
              <span>Final Client Selling Price:</span>
              <span className="font-semibold text-[#37352F] text-sm tabular-nums">
                {formatINR(commercials.totalClientSellingPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#787774]">
              <span>Export Layout:</span>
              <span className="font-medium text-[#2383E2]">4-Page Luxury Dark Edition</span>
            </div>
          </div>

          <div className="text-[11.5px] text-[#787774] leading-relaxed">
            All 4 pages (Cover, Flight & Hotel Stays, Day-by-Day Itinerary, and Commercial Inclusions) are formatted to exact international A4 dimensions for high-resolution client export.
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handlePrint}
              className="tactile-button-primary w-full h-10 text-[13px] flex items-center justify-center gap-2 rounded-lg"
            >
              <Printer className="w-4 h-4" strokeWidth={1.75} />
              <span>Print / Save as PDF (Window Print)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="tactile-button-secondary h-9 px-3 text-[12.5px] flex items-center justify-center gap-1.5 rounded-lg"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#787774]" />
                    <span>Copy Client Link</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadJSON}
                className="tactile-button-secondary h-9 px-3 text-[12.5px] flex items-center justify-center gap-1.5 rounded-lg"
              >
                <Download className="w-3.5 h-3.5 text-[#787774]" />
                <span>Export JSON Payload</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#F7F7F5] border-t border-[rgba(55,53,47,0.08)] flex items-center justify-between text-xs text-[#787774]">
          <span>TrippyGo Enterprise PDF Engine</span>
          <button
            onClick={onClose}
            className="text-xs font-medium text-[#37352F] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
