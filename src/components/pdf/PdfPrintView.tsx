import React from 'react';
import { Proposal } from '../../types/proposal';
import { PdfPageCover } from './PdfPageCover';
import { PdfPageFlightsStays } from './PdfPageFlightsStays';
import { PdfPageItinerary } from './PdfPageItinerary';
import { PdfPagePricing } from './PdfPagePricing';

interface PdfPrintViewProps {
  proposal: Proposal;
}

export const PdfPrintView: React.FC<PdfPrintViewProps> = ({ proposal }) => {
  return (
    <div className="hidden print:block fixed inset-0 z-9999 bg-white text-slate-900">
      <style>{`
        @media print {
          body {
            background: #0A131F !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
            height: 100vh;
            width: 100%;
          }
        }
      `}</style>

      {/* Page 1 */}
      <div className="page-break h-screen w-full">
        <PdfPageCover proposal={proposal} />
      </div>

      {/* Page 2 */}
      <div className="page-break h-screen w-full">
        <PdfPageFlightsStays proposal={proposal} />
      </div>

      {/* Page 3 */}
      <div className="page-break h-screen w-full">
        <PdfPageItinerary proposal={proposal} />
      </div>

      {/* Page 4 */}
      <div className="page-break h-screen w-full">
        <PdfPagePricing proposal={proposal} />
      </div>
    </div>
  );
};
