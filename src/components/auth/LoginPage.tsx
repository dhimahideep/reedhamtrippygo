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
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col justify-between text-[#1D1D1F] select-none">
      {/* 1. Frosted Glass Top Navigation */}
      <header className="h-14 bg-white/85 backdrop-blur-md border-b border-black/[0.08] px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Left: Apple Solid Black T badge + TrippyGo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 min-w-[36px] shrink-0 rounded-lg bg-[#1D1D1F] text-white flex items-center justify-center font-bold text-[17px] leading-none select-none shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
            <span>T</span>
          </div>
          <span className="font-semibold text-[#1D1D1F] tracking-[-0.022em] text-[16px] leading-none">
            TrippyGo
          </span>
        </div>
      </header>

      {/* 2. Center Sign-In Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-5 text-center">
            <h1 className="text-[22px] font-bold text-[#1D1D1F] tracking-[-0.022em]">
              Agency Sign In
            </h1>
            <p className="text-[13px] text-[#6E6E73] mt-1.5 font-medium">
              Enter your agency credentials to access the TrippyGo proposal workbench.
            </p>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-[#F5F5F7] border border-[#D2D2D7] text-[13px] text-[#1D1D1F] rounded-lg">
                  {errorMsg}
                </div>
              )}

              {isForgotPasswordNotice && (
                <div className="p-3 bg-[#F5F5F7] border border-[#D2D2D7] text-[13px] text-[#1D1D1F] flex items-center justify-between rounded-lg">
                  <span>Please contact your agency admin to reset credentials.</span>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordNotice(false)}
                    className="text-[13px] font-semibold text-[#1D1D1F] underline ml-2 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Field 1: AGENCY EMAIL */}
              <div>
                <label 
                  htmlFor="agency-email"
                  className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5 px-0.5"
                >
                  Agency Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868B]">
                    <Mail className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <input
                    id="agency-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reedham.sh@gmail.com"
                    className="w-full h-11 pl-10 pr-3.5 text-[14.5px] text-[#1D1D1F] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-[#1D1D1F] transition-all"
                  />
                </div>
              </div>

              {/* Field 2: PASSWORD + Forgot password? */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <label 
                    htmlFor="agency-password"
                    className="block text-[13px] font-medium text-[#1D1D1F]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordNotice(true)}
                    className="text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] underline cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868B]">
                    <Lock className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <input
                    id="agency-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-3.5 text-[14.5px] text-[#1D1D1F] bg-[#F5F5F7] hover:bg-white focus:bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-[#1D1D1F] transition-all"
                  />
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="tactile-button-primary w-full h-11 mt-5 rounded-lg text-[14.5px] flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </form>

            {/* Quick Demo Notice */}
            <div className="mt-6 pt-4 border-t border-black/[0.08] text-center">
              <span className="text-[12px] text-[#86868B]">
                Demo Access: Click "Sign In →" with any credentials to enter.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Bottom Footer */}
      <footer className="h-12 border-t border-black/[0.08] bg-white/60 flex items-center justify-center px-4 text-[12px] text-[#86868B]">
        <span>© 2026 TrippyGo Travel Agency. Authorized Agency Personnel Only.</span>
      </footer>
    </div>
  );
};
