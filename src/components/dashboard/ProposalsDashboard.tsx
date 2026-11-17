import React, { useState } from 'react';
import { Proposal } from '../../types/proposal';
import { formatINR, calculateCommercials } from '../../data/formatters';
import { 
  MoreHorizontal, 
  Copy, 
  Trash2, 
  Filter 
} from 'lucide-react';

interface ProposalsDashboardProps {
  proposals: Proposal[];
  onSelectProposal: (proposalId: string) => void;
  onDuplicateProposal: (proposalId: string) => void;
  onDeleteProposal: (proposalId: string) => void;
  onNewProposal: () => void;
  searchQuery: string;
}

type FilterTab = 'all' | 'draft' | 'pdf_ready';

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return '—';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export const ProposalsDashboard: React.FC<ProposalsDashboardProps> = ({
  proposals,
  onSelectProposal,
  onDuplicateProposal,
  onDeleteProposal,
  onNewProposal,
  searchQuery
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter proposals
  const filtered = proposals.filter((p) => {
    if (activeTab === 'draft' && p.status !== 'draft') return false;
    if (activeTab === 'pdf_ready' && p.status !== 'pdf_ready') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchClient = p.clientName.toLowerCase().includes(q);
      const matchDest = p.destinations.some(d => d.toLowerCase().includes(q));
      return matchTitle || matchCode || matchClient || matchDest;
    }

    return true;
  });

  const allCount = proposals.length;
  const draftCount = proposals.filter(p => p.status === 'draft').length;
  const pdfReadyCount = proposals.filter(p => p.status === 'pdf_ready').length;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-6">
      {/* Page Header: Proposals title + Segmented Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <h1 className="text-[22px] font-bold tracking-tight text-[#37352F] leading-none">
          Proposals
        </h1>

        {/* Notion Segmented Control */}
        <div className="inline-flex items-center bg-[#EFECE6]/80 p-1 rounded-lg border border-[rgba(55,53,47,0.08)]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 text-[13.5px] transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === 'all'
                ? 'bg-white text-[#37352F] font-semibold rounded-[6px] shadow-[0_1px_2px_rgba(15,15,15,0.06)]'
                : 'text-[#787774] hover:text-[#37352F] font-medium'
            }`}
          >
            All ({allCount})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-4 py-1.5 text-[13.5px] transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === 'draft'
                ? 'bg-white text-[#37352F] font-semibold rounded-[6px] shadow-[0_1px_2px_rgba(15,15,15,0.06)]'
                : 'text-[#787774] hover:text-[#37352F] font-medium'
            }`}
          >
            Drafts ({draftCount})
          </button>
          <button
            onClick={() => setActiveTab('pdf_ready')}
            className={`px-4 py-1.5 text-[13.5px] transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === 'pdf_ready'
                ? 'bg-white text-[#37352F] font-semibold rounded-[6px] shadow-[0_1px_2px_rgba(15,15,15,0.06)]'
                : 'text-[#787774] hover:text-[#37352F] font-medium'
            }`}
          >
            PDF ready ({pdfReadyCount})
          </button>
        </div>
      </div>

      {/* Proposals Table Card: Full Width */}
      <div className="w-full bg-white rounded-xl border border-[rgba(55,53,47,0.09)] overflow-hidden shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(55,53,47,0.09)] text-[11.5px] font-bold uppercase tracking-wider text-[#787774] bg-[#F7F7F5]/80">
              <th scope="col" className="py-3 px-5 font-bold text-left">
                PROPOSAL & CLIENT
              </th>
              <th scope="col" className="py-3 px-5 font-bold text-left">
                DESTINATIONS & DATES
              </th>
              <th scope="col" className="py-3 px-5 font-bold text-left">
                PRICE
              </th>
              <th scope="col" className="py-3 px-5 font-bold text-left">
                STATUS
              </th>
              <th scope="col" className="py-3 px-5 font-bold text-left">
                UPDATED
              </th>
              <th scope="col" className="py-3 px-5 text-right w-12">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(55,53,47,0.06)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#9B9A97]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-8 h-8 text-[#9B9A97]/40" strokeWidth={1.5} />
                    <p className="text-[15px] font-medium text-[#37352F]">No proposals found</p>
                    <button
                      onClick={onNewProposal}
                      className="mt-2 tactile-button-primary h-10 px-4 text-[14px] rounded-lg"
                    >
                      Create New Itinerary
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((proposal) => {
                const comms = calculateCommercials(proposal.pricing, proposal.adults, proposal.children);
                const isMenuOpen = activeMenuId === proposal.id;

                // Format destinations and dates
                const destStr = proposal.destinations.join(', ');
                const dateStr = formatShortDate(proposal.startDate);
                const destAndDates = dateStr 
                  ? `${destStr} · ${dateStr} · ${proposal.nights}N/${proposal.days}D`
                  : `${destStr} · ${proposal.nights}N/${proposal.days}D`;

                return (
                  <tr
                    key={proposal.id}
                    onClick={() => onSelectProposal(proposal.id)}
                    className="hover:bg-[#F7F7F5]/60 cursor-pointer transition-colors"
                  >
                    {/* Column 1 (Proposal & client) */}
                    <td className="py-3 px-5 align-middle">
                      <div className="min-w-0">
                        <div className="text-[15px] font-semibold text-[#37352F] leading-snug">
                          {proposal.title}
                        </div>
                        <div className="text-[13.5px] text-[#787774] mt-0.5">
                          {proposal.clientName ? `Client: ${proposal.clientName}` : '—'}
                        </div>
                      </div>
                    </td>

                    {/* Column 2 (Destinations & dates) */}
                    <td className="py-3 px-5 align-middle">
                      <span className="text-[14px] text-[#37352F] whitespace-nowrap font-medium">
                        {destAndDates}
                      </span>
                    </td>

                    {/* Column 3 (Price) */}
                    <td className="py-3 px-5 align-middle">
                      <span className="text-[15px] font-semibold tabular-nums text-[#37352F]">
                        {comms.totalClientSellingPrice > 0 ? formatINR(comms.totalClientSellingPrice) : '—'}
                      </span>
                    </td>

                    {/* Column 4 (Status) */}
                    <td className="py-3 px-5 align-middle">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-medium ${
                        proposal.status === 'pdf_ready' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' 
                          : 'bg-[#F7F7F5] text-[#787774] border border-[rgba(55,53,47,0.08)]'
                      }`}>
                        {proposal.status === 'pdf_ready' ? 'PDF ready' : 'Draft'}
                      </span>
                    </td>

                    {/* Column 5 (Updated) */}
                    <td className="py-3 px-5 align-middle">
                      <span className="text-[13px] text-[#9B9A97] tabular-nums whitespace-nowrap">
                        {formatRelativeTime(proposal.updatedAt)}
                      </span>
                    </td>

                    {/* Column 6 (Actions) */}
                    <td className="py-3 px-5 align-middle text-right">
                      <div 
                        className="relative inline-block text-left" 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setActiveMenuId(isMenuOpen ? null : proposal.id)}
                          className="p-1.5 rounded-lg text-[#9B9A97] hover:text-[#37352F] hover:bg-[#F7F7F5] transition-colors cursor-pointer"
                          title="More options"
                        >
                          <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-[0_8px_24px_rgba(15,15,15,0.12)] border border-[rgba(55,53,47,0.12)] p-1 z-30 text-left animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onDuplicateProposal(proposal.id);
                              }}
                              className="w-full px-2.5 py-1.5 text-[13.5px] text-[#37352F] hover:bg-[#F7F7F5] rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#787774]" strokeWidth={1.75} />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onDeleteProposal(proposal.id);
                              }}
                              className="w-full px-2.5 py-1.5 text-[13.5px] text-[#DC2626] hover:bg-red-50 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" strokeWidth={1.75} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
