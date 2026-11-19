import React from 'react';
import { ArrowLeft, Check, Share2, FileDown, Undo2, Redo2 } from 'lucide-react';
import { Proposal } from '../../types/proposal';
import { formatDateDisplay } from '../../data/formatters';

interface EditorSubHeaderProps {
  proposal: Proposal;
  onBack: () => void;
  onGeneratePdf: () => void;
  onShareLink: () => void;
  onStatusToggle?: () => void;
}

export const EditorSubHeader: React.FC<EditorSubHeaderProps> = ({
  proposal,
  onBack,
  onGeneratePdf,
  onShareLink,
}) => {
  const destString = proposal.destinations.join(', ');
  const subtitle = `${proposal.clientName} · ${proposal.nights}N / ${proposal.days}D · ${destString} · ${formatDateDisplay(proposal.startDate)}`;

  return (
    <div className="px-5 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-white/70 border-b border-black/[0.08] select-none">
      {/* Left: Back button + Title & Status & Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onBack}
          className="tactile-button-secondary w-9 h-9 rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
          title="Back to Proposals"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-[19px] font-bold text-[#1D1D1F] tracking-[-0.022em] truncate">
              {proposal.title}
            </h2>

            <span className="text-[12px] font-mono font-medium text-[#1D1D1F] bg-[#F5F5F7] border border-[#D2D2D7] px-2 py-0.5 rounded-md tabular-nums">
              {proposal.code}
            </span>
          </div>

          <p className="text-[13px] text-[#6E6E73] truncate mt-0.5 font-medium tracking-[-0.011em]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Autosave indicator + Undo/Redo + Share + Generate PDF */}
      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
        {/* All changes saved */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-[#6E6E73] pr-1 font-medium">
          <Check className="w-3.5 h-3.5 text-[#1D1D1F]" strokeWidth={2.5} />
          <span className="hidden sm:inline">All changes saved</span>
        </div>

        {/* Undo / Redo controls */}
        <div className="h-9 border border-[#D2D2D7] rounded-lg bg-white divide-x divide-[#D2D2D7] overflow-hidden flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            className="h-full px-2.5 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer flex items-center justify-center active:scale-95"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="h-full px-2.5 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer flex items-center justify-center active:scale-95"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Share Link */}
        <button
          onClick={onShareLink}
          className="tactile-button-secondary w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
          title="Copy proposal shareable link"
        >
          <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>

        {/* Primary Generate PDF button in Solid Black */}
        <button
          onClick={onGeneratePdf}
          className="tactile-button-primary h-9 px-3.5 rounded-lg inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[13.5px] font-medium cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Generate PDF</span>
        </button>
      </div>
    </div>
  );
};
