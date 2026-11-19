import React from 'react';
import { 
  Compass, 
  Plane, 
  Building2, 
  CalendarDays, 
  CheckSquare, 
  BadgePercent 
} from 'lucide-react';

export type EditorTabType = 'overview' | 'flights' | 'stays' | 'days' | 'inclusions' | 'pricing';

interface EditorTabBarProps {
  activeTab: EditorTabType;
  onTabChange: (tab: EditorTabType) => void;
  flightSectorCount: number;
  stayPropertyCount: number;
}

export const EditorTabBar: React.FC<EditorTabBarProps> = ({
  activeTab,
  onTabChange,
  flightSectorCount,
  stayPropertyCount,
}) => {
  const tabs = [
    {
      id: 'overview' as EditorTabType,
      label: 'Overview',
      icon: Compass,
    },
    {
      id: 'flights' as EditorTabType,
      label: 'Flights',
      icon: Plane,
      badge: flightSectorCount > 0 ? flightSectorCount : undefined,
    },
    {
      id: 'stays' as EditorTabType,
      label: 'Stays',
      icon: Building2,
      badge: stayPropertyCount > 0 ? stayPropertyCount : undefined,
    },
    {
      id: 'days' as EditorTabType,
      label: 'Days',
      icon: CalendarDays,
    },
    {
      id: 'inclusions' as EditorTabType,
      label: 'Inclusions',
      icon: CheckSquare,
    },
    {
      id: 'pricing' as EditorTabType,
      label: 'Pricing',
      icon: BadgePercent,
    },
  ];

  return (
    <div className="px-5 py-2 overflow-x-auto scrollbar-none select-none bg-white/40">
      <nav className="inline-flex items-center gap-1 bg-[#E5E5EA]/70 p-1 rounded-lg border border-black/[0.06] min-w-max" aria-label="Proposal Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 h-9 px-3.5 text-[13.5px] rounded-[6px] transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                isActive
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.06)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/50 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`} strokeWidth={1.75} />
              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={`ml-0.5 px-1.5 py-0.2 rounded-md text-[11px] font-semibold tabular-nums ${
                    isActive
                      ? 'bg-[#1D1D1F] text-white shadow-xs'
                      : 'bg-[#D2D2D7] text-[#1D1D1F]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
