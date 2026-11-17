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
    <div className="px-5 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-[#F7F7F5]/60 border-b border-[rgba(55,53,47,0.09)] select-none">
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
            <h2 className="text-[20px] font-bold text-[#37352F] tracking-tight truncate">
              {proposal.title}
            </h2>

            <span className="text-[13px] font-mono font-medium text-[#787774] bg-[#F7F7F5] border border-[rgba(55,53,47,0.09)] px-1.5 py-0.5 rounded-md tabular-nums">
              {proposal.code}
            </span>
          </div>

          <p className="text-[13px] text-[#787774] truncate mt-0.5 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Autosave indicator + Undo/Redo + Share + Generate PDF */}
      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
        {/* All changes saved */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-[#787774] pr-1">
          <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
          <span className="font-medium hidden sm:inline">All changes saved</span>
        </div>

        {/* Undo / Redo controls */}
        <div className="h-9 border border-[rgba(55,53,47,0.16)] rounded-lg bg-white divide-x divide-[rgba(55,53,47,0.09)] overflow-hidden flex items-center shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
          <button
            type="button"
            className="h-full px-2.5 text-[#787774] hover:text-[#37352F] hover:bg-[#F7F7F5] transition-colors cursor-pointer flex items-center justify-center active:scale-95"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="h-full px-2.5 text-[#787774] hover:text-[#37352F] hover:bg-[#F7F7F5] transition-colors cursor-pointer flex items-center justify-center active:scale-95"
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

        {/* Primary Generate PDF button in Notion/Linear High-Craft Blue */}
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
