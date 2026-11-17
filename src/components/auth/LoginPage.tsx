import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('reedham.sh@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [errorMsg, setErrorMsg] = useState('');
  const [isForgotPasswordNotice, setIsForgotPasswordNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Derive name cleanly from email or fallback to Reedham
    let derivedName = 'Reedham';
    if (email && email.includes('@')) {
      const prefix = email.split('@')[0].split('.')[0];
      if (prefix.toLowerCase() !== 'advisor') {
        derivedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      }
    }

    onLogin({
      name: derivedName,
      email: email || 'reedham.sh@gmail.com',
      role: 'Sales Advisor'
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between text-[#37352F] select-none">
      {/* 1. Frosted Glass Top Navigation */}
      <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-[rgba(55,53,47,0.09)] px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Left: Notion Blue T badge + TrippyGo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 min-w-[36px] shrink-0 rounded-lg bg-[#2383E2] text-white flex items-center justify-center font-bold text-[17px] leading-none select-none shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(35,131,226,0.25)]">
            <span>T</span>
          </div>
          <span className="font-semibold text-[#37352F] tracking-tight text-[16px] leading-none">
            TrippyGo
          </span>
        </div>
      </header>

      {/* 2. Center Sign-In Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-5 text-center">
            <h1 className="text-[22px] font-bold text-[#37352F] tracking-tight">
              Agency Sign In
            </h1>
            <p className="text-[13px] text-[#787774] mt-1.5">
              Enter your agency credentials to access the TrippyGo proposal workbench.
            </p>
          </div>

          <div className="bg-white border border-[rgba(55,53,47,0.09)] rounded-xl p-6 shadow-[0_4px_16px_rgba(15,15,15,0.06)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-[13px] text-[#DC2626] rounded-lg">
                  {errorMsg}
                </div>
              )}

              {isForgotPasswordNotice && (
                <div className="p-3 bg-[#F7F7F5] border border-[rgba(55,53,47,0.08)] text-[13px] text-[#787774] flex items-center justify-between rounded-lg">
                  <span>Please contact your agency admin to reset credentials.</span>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordNotice(false)}
                    className="text-[13px] font-semibold text-[#37352F] underline ml-2 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Field 1: AGENCY EMAIL */}
              <div>
                <label 
                  htmlFor="agency-email"
                  className="block text-[14px] font-medium text-[#37352F] mb-1.5 px-0.5"
                >
                  Agency Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9B9A97]">
                    <Mail className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <input
                    id="agency-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reedham.sh@gmail.com"
                    className="w-full h-11 pl-10 pr-3.5 text-[14.5px] text-[#37352F] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:ring-3 focus:ring-[#2383E2]/15 focus:border-[#2383E2] transition-all"
                  />
                </div>
              </div>

              {/* Field 2: PASSWORD + Forgot password? */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <label 
                    htmlFor="agency-password"
                    className="block text-[14px] font-medium text-[#37352F]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordNotice(true)}
                    className="text-[13px] text-[#2383E2] hover:underline cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9B9A97]">
                    <Lock className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <input
                    id="agency-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-3.5 text-[14.5px] text-[#37352F] bg-[#F7F7F5]/75 hover:bg-[#F1F1EF]/75 focus:bg-white border border-[rgba(55,53,47,0.12)] rounded-lg focus:outline-none focus:ring-3 focus:ring-[#2383E2]/15 focus:border-[#2383E2] transition-all"
                  />
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="tactile-button-primary w-full h-11 mt-5 rounded-lg text-[14.5px] flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </form>

            {/* Quick Demo Notice */}
            <div className="mt-6 pt-4 border-t border-[rgba(55,53,47,0.08)] text-center">
              <span className="text-[12px] text-[#9B9A97]">
                Demo Access: Click "Sign In →" with any credentials to enter.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Bottom Footer */}
      <footer className="h-12 border-t border-[rgba(55,53,47,0.09)] bg-white/80 flex items-center justify-center px-4 text-[12.5px] text-[#9B9A97]">
        <span>© 2026 TrippyGo Travel Agency. Authorized Agency Personnel Only.</span>
      </footer>
    </div>
  );
};
