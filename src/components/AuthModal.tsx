import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string } | null;
  onLogin: (name: string, email: string) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLogin(name || email.split('@')[0], email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#e0e3eb]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2962ff] flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[18px]">show_chart</span>
            </div>
            <span className="font-extrabold text-lg text-[#131722]">TradingView Account</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#f0f3fa] rounded-full text-[#6a6d78]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {user ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#2962ff] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              {user.name[0].toUpperCase()}
            </div>
            <h3 className="font-extrabold text-lg text-[#131722]">{user.name}</h3>
            <p className="text-sm text-[#6a6d78] mb-6">{user.email}</p>
            <div className="p-3 bg-[#f0f3fa] rounded-xl text-xs text-[#434656] text-left mb-6">
              <div className="flex justify-between py-1">
                <span>Account Tier:</span>
                <span className="font-bold text-[#0049db]">Pro Plan (Demo)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Realtime Data feeds:</span>
                <span className="font-bold text-[#089981]">Active (NYSE, NASDAQ, CME)</span>
              </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-full border border-[#f23645] text-[#f23645] hover:bg-[#f23645]/10 font-bold text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6a6d78] mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3 py-2 rounded-xl border border-[#e0e3eb] text-sm focus:border-[#2962ff] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6a6d78] mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@tradingview.com"
                className="w-full px-3 py-2 rounded-xl border border-[#e0e3eb] text-sm focus:border-[#2962ff] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#2962ff] hover:bg-[#0049db] text-white font-bold text-sm shadow-md transition-colors mt-2"
            >
              Continue to Markets
            </button>

            <button
              type="button"
              onClick={() => {
                onLogin('Institutional Trader', 'trader@institutional.org');
                onClose();
              }}
              className="w-full py-2 rounded-full bg-[#f0f3fa] hover:bg-[#e0e3eb] text-[#131722] font-semibold text-xs transition-colors"
            >
              Demo Sign In (Institutional Trader)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
