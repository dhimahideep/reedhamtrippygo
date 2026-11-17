# TrippyGo — B2B Travel Proposal & PDF Quotation Builder

A production-grade React + TypeScript + Tailwind CSS frontend built for travel agency employees to rapidly assemble, price, and export luxury multi-day travel proposals and dark luxury PDF quotations.

---

## Architecture & Integration Guide

The frontend is architected to allow backend engineers to seamlessly integrate REST APIs and backend PDF rendering engines without modifying component hierarchy.

### Directory Structure

```
src/
├── types/
│   └── proposal.ts             # Complete TypeScript interfaces (Proposal, FlightSector, StayProperty, ItineraryDay, PricingCommercials)
├── data/
│   ├── formatters.ts           # Indian Rupee (INR) formatting, date helpers, meal plans & commercial margin math
│   └── mockProposals.ts        # Comprehensive sample proposals (Switzerland, Bali, Rajasthan, Dubai, Maldives)
├── components/
│   ├── TopGlobalBar.tsx        # 56px (h-14) global navigation bar with search & salesperson badge
│   ├── dashboard/
│   │   └── ProposalsDashboard.tsx # Screen 1: Filter tabs, KPI metrics, 5-column proposals table
│   ├── editor/                 # Screen 2: Split-pane workspace & sub-navigation
│   │   ├── EditorSubHeader.tsx # Back button, status pill, auto-save status, share link, PDF trigger
│   │   ├── EditorTabBar.tsx    # 6-Step tab bar with sector & stay count badges
│   │   └── tabs/
│   │       ├── OverviewTab.tsx # Logistics, circuit tags, date math, guest steppers, cover photo
│   │       ├── FlightsTab.tsx  # Onward, Return, Intercity boarding pass strips
│   │       ├── FlightDrawer.tsx # Slide-over drawer with 1-click return leg mirroring
│   │       ├── StaysTab.tsx    # Hotel cards with EP/CP/MAP/AP meal plan selectors & steppers
│   │       ├── StayDrawer.tsx  # Slide-over drawer for adding/editing luxury properties
│   │       ├── DaysTab.tsx     # Horizontal day switcher, narrative editor, auto-fill luxury copy
│   │       ├── InclusionsTab.tsx # 2-column inclusions & exclusions checklist + presets
│   │       └── PricingTab.tsx  # Staff view, DMC net cost, margin presets, floor warning, executive breakdown
│   ├── pdf/
│   │   ├── LivePdfPreview.tsx  # Right 5-column live preview pane (zoom 80%-120%, page 1-4 navigation)
│   │   ├── PdfPageCover.tsx    # Page 1: Dark luxury cover page (#0A131F, #E5C365 gold accents)
│   │   ├── PdfPageFlightsStays.tsx # Page 2: Flight sectors & hotel accommodations
│   │   ├── PdfPageItinerary.tsx    # Page 3: Day-by-day curated narrative & overnight stays
│   │   ├── PdfPagePricing.tsx  # Page 4: Inclusions, exclusions, commercial summary & agency desk
│   │   └── PdfPrintView.tsx    # Native browser window.print() stylesheet for export
│   └── shared/
│       ├── PdfGenerateModal.tsx # Export confirmation, print trigger & JSON payload downloader
│       └── Toast.tsx           # Non-blocking notification toasts
├── App.tsx                     # Two-screen router & state persistence
└── main.tsx                    # React 18 DOM root
```

---

## Key Features

1. **Exact Two-Screen Routing Flow**:
   - **Screen 1**: Proposals Dashboard with `All`, `Drafts`, and `PDF ready` segmented filters, search by client/destination, and a 5-column data table.
   - **Screen 2**: Split-Pane Proposal Editor (Left 7 Columns = Employee Workspace; Right 5 Columns = Real-time Live A4 PDF Preview).

2. **Live A4 PDF Preview Pane**:
   - Faithful to the `#0A131F` deep navy and `#E5C365` / `#D4AF37` gold aesthetic.
   - Includes `1M+ Travellers` / `TrippyGo — A Unit of Friends Travels` / `18+ Years Experience` header, `CURATED PRIVATE ITINERARY`, `SPECIALLY PREPARED FOR [CLIENT]`, and 3-column metadata box.
   - Real-time reactivity: Every change in the 6 editor tabs immediately reflects in the live preview.
   - Multi-page navigation (`1 / 4`) and zoom controls (`80%–120%`).

3. **Zero Form Overlap Architecture**:
   - Eliminated giant inline cards that cause layout shift.
   - Dedicated slide-over drawers (`max-w-lg`) for flights and hotel stays.
   - Boarding-pass strips for flights with 1-click mirrored return leg generation.
   - Visual 4-option Meal Plan selector (`EP`, `CP`, `MAP`, `AP`).
   - Focused day editor with horizontal day pill switcher and auto-fill luxury copy generation.
   - Pricing tab with Confidential Staff View, net DMC rate, quick margin pills (`8%`, `10%`, `12%`, `15%`, `18%`), low-margin floor warning (< 8%), and `#0B1220` Executive Commercial Breakdown.

4. **Design System & Zero Emojis**:
   - Apple macOS / Stripe enterprise precision styling with `#F8FAFC` canvas, crisp 1px borders, and `tabular-nums`.
   - Strict zero-emoji policy across all mock data, placeholders, and UI elements. Clean uniform `lucide-react` icons (1.75px stroke width).

---

## Development & Production Build

```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Run TypeScript type check
npx tsc

# Create production build
npx vite build
```
