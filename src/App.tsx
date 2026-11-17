import React, { useState, useEffect } from 'react';
import { Proposal } from './types/proposal';
import { INITIAL_PROPOSALS } from './data/mockProposals';
import { LoginPage } from './components/auth/LoginPage';
import { TopGlobalBar, UserProfile } from './components/TopGlobalBar';
import { ProposalsDashboard } from './components/dashboard/ProposalsDashboard';
import { EditorSubHeader } from './components/editor/EditorSubHeader';
import { EditorTabBar, EditorTabType } from './components/editor/EditorTabBar';
import { OverviewTab } from './components/editor/tabs/OverviewTab';
import { FlightsTab } from './components/editor/tabs/FlightsTab';
import { StaysTab } from './components/editor/tabs/StaysTab';
import { DaysTab } from './components/editor/tabs/DaysTab';
import { InclusionsTab } from './components/editor/tabs/InclusionsTab';
import { PricingTab } from './components/editor/tabs/PricingTab';
import { LiveA4PreviewPane } from './components/editor/LiveA4PreviewPane';
import { PdfPrintView } from './components/pdf/PdfPrintView';
import { PdfGenerateModal } from './components/shared/PdfGenerateModal';
import { ToastContainer, ToastMessage } from './components/shared/Toast';

export const App: React.FC = () => {
  // Load proposals from localStorage if available, or fallback to INITIAL_PROPOSALS
  const [proposals, setProposals] = useState<Proposal[]>(() => {
    try {
      const saved = localStorage.getItem('trippygo_proposals_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from storage:', e);
    }
    return INITIAL_PROPOSALS;
  });

  // Active view: null means Proposals Dashboard; string ID means Editor
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);

  // Editor active tab
  const [activeEditorTab, setActiveEditorTab] = useState<EditorTabType>('overview');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Toasts
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Authentication State: open on Agency Sign In page by default
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem('trippygo_user_profile');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
    return {
      name: 'Reedham',
      email: 'reedham.sh@gmail.com',
      role: 'Sales Advisor'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setSelectedProposalId(null); // Logs straight into Proposals dashboard
    try {
      localStorage.setItem('trippygo_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    addToast('success', 'Signed In', `Welcome back, ${user.name}!`);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setSelectedProposalId(null);
    try {
      localStorage.removeItem('trippygo_is_authenticated');
    } catch (e) {
      console.error(e);
    }
    addToast('info', 'Signed Out', 'You have been signed out successfully.');
  };

  // Set clean document title
  useEffect(() => {
    document.title = 'TrippyGo';
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trippygo_proposals_v2', JSON.stringify(proposals));
    } catch (e) {
      console.error('Failed to save proposals:', e);
    }
  }, [proposals]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Find active proposal
  const currentProposal = proposals.find((p) => p.id === selectedProposalId) || null;

  // New Itinerary Handler
  const handleNewItinerary = () => {
    const newId = 'prop-' + Date.now();
    const newCode = `TG-2026-N${Math.floor(100 + Math.random() * 900)}`;
    const newProposal: Proposal = {
      id: newId,
      code: newCode,
      title: 'Bespoke European Panorama & Private Alps',
      clientName: 'Sunil & Renu Agarwal',
      clientEmail: 'sunil.agarwal@example.com',
      clientPhone: '+91 98200 44112',
      destinations: ['Zurich', 'Interlaken', 'Geneva'],
      nights: 6,
      days: 7,
      startDate: '2026-08-10',
      endDate: '2026-08-16',
      adults: 2,
      children: 0,
      infants: 0,
      rooms: 1,
      coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
      status: 'draft',
      updatedAt: new Date().toISOString(),
      agencyNotes: 'New VIP quotation draft.',
      flights: [
        {
          id: 'fl-new-1',
          direction: 'onward',
          airline: 'Swiss International Air Lines',
          flightNumber: 'LX 155',
          date: '2026-08-10',
          depAirport: 'BOM',
          depCity: 'Mumbai',
          depTime: '01:20',
          arrAirport: 'ZRH',
          arrCity: 'Zurich',
          arrTime: '06:45',
          duration: '8h 55m',
          stops: 'Non-stop',
          baggageCheckIn: '2 x 23 kg',
          baggageCabin: '8 kg cabin',
          layoverNotes: 'Direct Boeing 777'
        }
      ],
      stays: [
        {
          id: 'st-new-1',
          hotelName: 'Victoria-Jungfrau Grand Hotel',
          city: 'Interlaken',
          roomCategory: 'Superior Alpine Room',
          mealPlan: 'CP',
          nights: 6,
          nightRangeStart: 1,
          nightRangeEnd: 6,
          rating: 5,
          notes: 'Includes breakfast and spa access'
        }
      ],
      daysList: [
        {
          dayNumber: 1,
          title: 'Arrival in Zurich — Scenic Swiss Rail to Interlaken',
          description: 'Arrival at Zurich International Airport. Board the Swiss panoramic rail directly to Interlaken. Check in to your luxury hotel and enjoy an evening at leisure along Lake Thun.',
          overnightStay: 'Victoria-Jungfrau Grand Hotel, Interlaken',
          highlights: ['Swiss 1st Class Pass', 'Scenic Lake Thun', 'Welcome Drinks']
        },
        {
          dayNumber: 2,
          title: 'Jungfraujoch Top of Europe & Glacier Plateau',
          description: 'Ascend to Jungfraujoch via the modern Eiger Express gondola and cogwheel railway. Tour the Ice Palace sculptures and step out onto eternal snows.',
          overnightStay: 'Victoria-Jungfrau Grand Hotel, Interlaken',
          highlights: ['Eiger Express 3S', 'Glacier Walk', 'Ice Palace']
        }
      ],
      inclusions: [
        '6 Nights luxury 5-star hotel accommodation with breakfast',
        '8-Day 1st Class Swiss Travel Pass with unlimited transportation',
        'Jungfraujoch Top of Europe mountain excursion tickets',
        '24/7 dedicated on-ground concierge support'
      ],
      exclusions: [
        'International flights (optional add-on)',
        'Schengen visa processing and insurance',
        'Meals not mentioned in the itinerary',
        'TCS (Tax Collected at Source)'
      ],
      pricing: {
        pricingModel: 'package_flights',
        distributionMode: 'total',
        supplierCostNetDMC: 320000,
        agencyMarginPercent: 12,
        includeFlights: true,
        flightCostPerPax: 58000,
        tcsPercent: 5,
        quoteValidUntil: '2026-07-30',
        displayFormat: 'all_inclusive'
      }
    };

    setProposals([newProposal, ...proposals]);
    setSelectedProposalId(newId);
    setActiveEditorTab('overview');
    addToast('success', 'New Itinerary Created', `Draft code ${newCode} initialized.`);
  };

  // Update current proposal
  const handleUpdateCurrentProposal = (updatedFields: Partial<Proposal>) => {
    if (!selectedProposalId) return;
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === selectedProposalId) {
          return {
            ...p,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  // Duplicate proposal
  const handleDuplicateProposal = (id: string) => {
    const target = proposals.find((p) => p.id === id);
    if (!target) return;

    const dupId = 'prop-' + Date.now();
    const dupCode = `TG-2026-D${Math.floor(100 + Math.random() * 900)}`;
    const duplicate: Proposal = {
      ...target,
      id: dupId,
      code: dupCode,
      title: `${target.title} (Copy)`,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };

    setProposals([duplicate, ...proposals]);
    addToast('info', 'Proposal Duplicated', `Created duplicate with code ${dupCode}`);
  };

  // Delete proposal
  const handleDeleteProposal = (id: string) => {
    const target = proposals.find((p) => p.id === id);
    if (!target) return;

    if (window.confirm(`Are you sure you want to delete proposal "${target.title}"?`)) {
      setProposals(proposals.filter((p) => p.id !== id));
      if (selectedProposalId === id) {
        setSelectedProposalId(null);
      }
      addToast('info', 'Proposal Deleted', `Removed ${target.code}`);
    }
  };

  // Share link
  const handleShareLink = () => {
    if (!currentProposal) return;
    navigator.clipboard.writeText(`https://trippygo.travel/proposals/${currentProposal.code}`);
    addToast('success', 'Link Copied', `Sharable proposal link for ${currentProposal.clientName} copied.`);
  };

  // Generate PDF
  const handleGeneratePdf = () => {
    setIsPdfModalOpen(true);
  };

  // Render Login Page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col text-[#1D1D1F]">
      {/* 1. Unified Sticky Frosted-Glass Header */}
      <div className="sticky top-0 z-30 bg-[#F5F5F7]/85 backdrop-blur-xl border-b border-black/[0.08]">
        <TopGlobalBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewItinerary={handleNewItinerary}
          onLogoClick={() => setSelectedProposalId(null)}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onChangePasswordSuccess={() => addToast('success', 'Password Updated', 'Your workstation password was updated.')}
        />

        {selectedProposalId !== null && currentProposal && (
          <>
            <EditorSubHeader
              proposal={currentProposal}
              onBack={() => setSelectedProposalId(null)}
              onGeneratePdf={handleGeneratePdf}
              onShareLink={handleShareLink}
            />

            <EditorTabBar
              activeTab={activeEditorTab}
              onTabChange={setActiveEditorTab}
              flightSectorCount={currentProposal.flights.length}
              stayPropertyCount={currentProposal.stays.length}
            />
          </>
        )}
      </div>

      {/* Main Body Router */}
      {selectedProposalId === null || !currentProposal ? (
        /* SCREEN 1: Proposals Dashboard */
        <main className="flex-1">
          <ProposalsDashboard
            proposals={proposals}
            onSelectProposal={(id) => {
              setSelectedProposalId(id);
              setActiveEditorTab('overview');
            }}
            onDuplicateProposal={handleDuplicateProposal}
            onDeleteProposal={handleDeleteProposal}
            onNewProposal={handleNewItinerary}
            searchQuery={searchQuery}
          />
        </main>
      ) : (
        /* SCREEN 2: Split-Pane Proposal Editor */
        <div className="flex-1 flex flex-col">
          {/* Main Workspace Grid (12 Columns: Left 7 Cols Workspace, Right 5 Cols Live A4 Preview) */}
          <div className="flex-1 w-full px-5 py-4">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* LEFT 7 COLUMNS: Employee Configuration Workspace */}
              <div className="lg:col-span-7 w-full space-y-3.5">
                {activeEditorTab === 'overview' && (
                  <OverviewTab
                    proposal={currentProposal}
                    onChange={handleUpdateCurrentProposal}
                    onNext={() => setActiveEditorTab('flights')}
                  />
                )}

                {activeEditorTab === 'flights' && (
                  <FlightsTab
                    flights={currentProposal.flights}
                    onChange={(flights) => handleUpdateCurrentProposal({ flights })}
                    startDate={currentProposal.startDate}
                    endDate={currentProposal.endDate}
                    destinations={currentProposal.destinations}
                    onShowToast={addToast}
                    onNext={() => setActiveEditorTab('stays')}
                    onBack={() => setActiveEditorTab('overview')}
                  />
                )}

                {activeEditorTab === 'stays' && (
                  <StaysTab
                    stays={currentProposal.stays}
                    onChange={(stays) => handleUpdateCurrentProposal({ stays })}
                    onNext={() => setActiveEditorTab('days')}
                    onBack={() => setActiveEditorTab('flights')}
                  />
                )}

                {activeEditorTab === 'days' && (
                  <DaysTab
                    days={currentProposal.daysList}
                    onChange={(daysList) => handleUpdateCurrentProposal({ daysList })}
                    stays={currentProposal.stays}
                    destinations={currentProposal.destinations}
                    nights={currentProposal.nights}
                    onShowToast={addToast}
                    onNext={() => setActiveEditorTab('inclusions')}
                    onBack={() => setActiveEditorTab('stays')}
                  />
                )}

                {activeEditorTab === 'inclusions' && (
                  <InclusionsTab
                    inclusions={currentProposal.inclusions}
                    exclusions={currentProposal.exclusions}
                    onInclusionsChange={(inclusions) => handleUpdateCurrentProposal({ inclusions })}
                    onExclusionsChange={(exclusions) => handleUpdateCurrentProposal({ exclusions })}
                    onShowToast={addToast}
                    onNext={() => setActiveEditorTab('pricing')}
                    onBack={() => setActiveEditorTab('days')}
                  />
                )}

                {activeEditorTab === 'pricing' && (
                  <PricingTab
                    pricing={currentProposal.pricing}
                    onChange={(pricing) => handleUpdateCurrentProposal({ pricing })}
                    adults={currentProposal.adults}
                    children={currentProposal.children}
                    infants={currentProposal.infants}
                    onSwitchToOverview={() => setActiveEditorTab('overview')}
                    onNext={() => setIsPdfModalOpen(true)}
                    onBack={() => setActiveEditorTab('inclusions')}
                  />
                )}
              </div>

              {/* RIGHT 5 COLUMNS: Upgraded Live A4 PDF Preview Pane */}
              <div id="pdf-preview-container" className="lg:col-span-5 w-full sticky top-[148px]">
                <LiveA4PreviewPane proposal={currentProposal} />
              </div>
            </div>
          </div>

          {/* Hidden Print Document Component for window.print() */}
          <PdfPrintView proposal={currentProposal} />

          {/* PDF Generation Confirmation Modal */}
          <PdfGenerateModal
            isOpen={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            proposal={currentProposal}
          />
        </div>
      )}

      {/* Floating Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
export default App;
