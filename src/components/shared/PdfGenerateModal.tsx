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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-md transition-opacity duration-200 select-none animate-in fade-in">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_24px_60px_rgba(0,0,0,0.16)] border border-black/[0.08] max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#1D1D1F] text-white flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/15">
              <FileCheck className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                PDF Quotation Generated
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
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
          <div className="bg-[#F5F5F7] border border-black/[0.08] rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-[#6E6E73]">
              <span>Client Name:</span>
              <span className="font-semibold text-[#1D1D1F]">{proposal.clientName}</span>
            </div>
            <div className="flex justify-between items-center text-[#6E6E73]">
              <span>Trip Duration:</span>
              <span className="font-medium text-[#1D1D1F]">{proposal.nights}N / {proposal.days}D</span>
            </div>
            <div className="flex justify-between items-center text-[#6E6E73]">
              <span>Final Client Selling Price:</span>
              <span className="font-semibold text-[#1D1D1F] text-sm tabular-nums">
                {formatINR(commercials.totalClientSellingPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#6E6E73]">
              <span>Export Layout:</span>
              <span className="font-medium text-[#1D1D1F]">4-Page Luxury Dark Edition</span>
            </div>
          </div>

          <div className="text-[11.5px] text-[#6E6E73] leading-relaxed">
            The proposal document contains cover photography, day-by-day narrative, boarding passes, confirmed hotel accommodations, itemized inclusions, and gross quotation.
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handlePrint}
              className="tactile-button-primary h-10 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="tactile-button-secondary h-10 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1D1D1F]" strokeWidth={2.5} />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Client Link</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-1">
            <button
              onClick={handleDownloadJSON}
              className="w-full text-center py-1.5 text-[11px] text-[#86868B] hover:text-[#1D1D1F] transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
            >
              <Download className="w-3 h-3" />
              <span>Export Raw JSON Data Backup</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#F5F5F7] border-t border-black/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="tactile-button-secondary h-8 px-3 rounded-lg text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
