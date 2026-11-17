import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  UserCheck, 
  KeyRound, 
  LogOut, 
  X, 
  Check 
} from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}

interface TopGlobalBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewItinerary: () => void;
  onLogoClick: () => void;
  currentUser?: UserProfile;
  onSignOut?: () => void;
  onChangePasswordSuccess?: () => void;
}

export const TopGlobalBar: React.FC<TopGlobalBarProps> = ({
  searchQuery,
  onSearchChange,
  onNewItinerary,
  onLogoClick,
  currentUser = {
    name: 'Reedham',
    email: 'reedham.sh@gmail.com',
    role: 'Sales Advisor'
  },
  onSignOut,
  onChangePasswordSuccess
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsChangePasswordOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (!newPassword !== !confirmPassword || newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    // Success simulation
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (onChangePasswordSuccess) {
        onChangePasswordSuccess();
      }
    }, 1200);
  };

  const initialLetter = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'R';

  return (
    <>
      <header className="h-[52px] px-5 flex items-center justify-between bg-[#F7F7F5] border-b border-[rgba(55,53,47,0.09)] select-none">
        {/* Left: Notion high-craft Blue logo mark (#2383E2) + TrippyGo */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 min-w-[36px] shrink-0 rounded-lg bg-[#2383E2] text-white flex items-center justify-center font-bold text-[17px] leading-none select-none shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(35,131,226,0.3)] group-hover:bg-[#0077D4] transition-all active:scale-95">
            <span>T</span>
          </div>
          <span className="font-semibold text-[#37352F] tracking-tight text-[16px] leading-none">
            TrippyGo
          </span>
        </div>

        {/* Center: Notion Warm Search Bar */}
        <div className="flex-1 max-w-lg mx-6 hidden sm:block">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#9B9A97] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" strokeWidth={1.75} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search proposals, clients, destinations..."
              className="w-full h-9 pl-9 pr-14 text-[13.5px] bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/15 text-[#37352F] placeholder-[#9B9A97] shadow-[0_1px_2px_rgba(15,15,15,0.02)] transition-all duration-150"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-[#787774] bg-[#F7F7F5] border border-[rgba(55,53,47,0.12)] rounded-md">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: + New Itinerary + Interactive User Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onNewItinerary}
            className="tactile-button-primary h-10 px-3.5 rounded-lg inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[13.5px] font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
            <span>New Itinerary</span>
          </button>

          {/* Interactive User Profile Trigger Container */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="tactile-button-secondary h-10 px-2.5 rounded-lg select-none cursor-pointer flex items-center gap-2"
              title="Open user profile menu"
            >
              <div className="w-8 h-8 min-w-[32px] shrink-0 rounded-full flex items-center justify-center bg-[#F7F7F5] text-[#37352F] text-[12px] font-bold border border-[rgba(55,53,47,0.1)]">
                {initialLetter}
              </div>
              <div className="text-left hidden md:block pl-0.5">
                <div className="text-[12.5px] font-semibold text-[#37352F] leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[9px] font-bold text-[#787774] uppercase tracking-wider leading-none mt-0.5">
                  SALESPERSON
                </div>
              </div>
              <ChevronDown 
                className={`w-3.5 h-3.5 text-[#787774] transition-transform duration-150 ${isUserMenuOpen ? 'rotate-180 text-[#37352F]' : ''}`} 
              />
            </button>

            {/* Custom Animated Notion-style Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-[rgba(55,53,47,0.12)] shadow-[0_8px_24px_rgba(15,15,15,0.12)] rounded-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-100">
                {/* Header Section */}
                <div className="p-2.5 border-b border-[rgba(55,53,47,0.09)]">
                  <div className="text-[14px] font-bold text-[#37352F] leading-snug">
                    {currentUser.name}
                  </div>
                  <div className="text-[12px] text-[#787774] mt-0.5 truncate">
                    {currentUser.email}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 border border-[rgba(55,53,47,0.09)] bg-[#F7F7F5] text-[11.5px] font-medium text-[#37352F] rounded-md">
                    <UserCheck className="w-3.5 h-3.5 text-[#2383E2]" />
                    <span>{currentUser.role}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsChangePasswordOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[13px] text-[#37352F] hover:bg-[#F7F7F5] rounded-lg flex items-center gap-2 transition-colors cursor-pointer font-medium"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#787774]" />
                    <span>Change Password</span>
                  </button>

                  {onSignOut && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[13px] text-[#EB5757] hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#EB5757]" />
                      <span>Sign Out of Agency</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Centered Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] select-none animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-[0_20px_48px_rgba(15,15,15,0.16)] border border-[rgba(55,53,47,0.1)] max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[rgba(55,53,47,0.09)] flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-[#37352F] tracking-tight">
                  Change Password
                </h3>
                <p className="text-[12px] text-[#787774] mt-0.5">
                  Update your TrippyGo agency access key
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[#9B9A97] hover:text-[#37352F] hover:bg-[#F7F7F5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePasswordSubmit} className="p-5 space-y-3.5">
              {passwordError && (
                <div className="p-2.5 text-xs text-[#EB5757] bg-red-50 border border-red-200 rounded-lg">
                  {passwordError}
                </div>
              )}

              {passwordSuccess ? (
                <div className="p-4 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div className="text-xs font-semibold text-emerald-800">
                    Password successfully updated!
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="block text-[12.5px] font-medium text-[#37352F]">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3.5 text-[14px] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/15 rounded-lg text-[#37352F] transition-all duration-150 outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[12.5px] font-medium text-[#37352F]">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3.5 text-[14px] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/15 rounded-lg text-[#37352F] transition-all duration-150 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[12.5px] font-medium text-[#37352F]">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3.5 text-[14px] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/15 rounded-lg text-[#37352F] transition-all duration-150 outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsChangePasswordOpen(false)}
                      className="tactile-button-secondary h-9 px-3.5 rounded-lg text-[13px] font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="tactile-button-primary h-9 px-4 rounded-lg text-[13px] font-medium"
                    >
                      Update Key
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
