import React, { useState } from 'react';
import { EARNINGS_CALENDAR } from '../data/marketData';

interface EarningsCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany?: (symbol: string) => void;
}

export const EarningsCalendarModal: React.FC<EarningsCalendarModalProps> = ({
  isOpen,
  onClose,
  onSelectCompany
}) => {
  const [filterSession, setFilterSession] = useState<'All' | 'Pre-market' | 'Post-market' | 'Upcoming IPO'>('All');

  if (!isOpen) return null;

  const extendedEarnings = [
    ...EARNINGS_CALENDAR,
    { id: 'adbe', company: 'Adobe Inc.', symbol: 'ADBE', session: 'Post-market' as const, estimate: '4.65', actual: '4.68' },
    { id: 'orcl', company: 'Oracle Corp', symbol: 'ORCL', session: 'Post-market' as const, estimate: '1.39', actual: '1.41' },
    { id: 'fdx', company: 'FedEx Corp', symbol: 'FDX', session: 'Post-market' as const, estimate: '3.75', actual: '3.60' },
    { id: 'cost', company: 'Costco Wholesale', symbol: 'COST', session: 'Pre-market' as const, estimate: '5.04', actual: '5.15' },
    { id: 'nke', company: 'NIKE Inc', symbol: 'NKE', session: 'Post-market' as const, estimate: '0.52', actual: '0.70' }
  ];

  const filtered = filterSession === 'All' 
    ? extendedEarnings 
    : extendedEarnings.filter((e) => e.session === filterSession);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e3eb] bg-[#faf8ff]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0049db] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#131722]">Full Corporate Earnings Calendar</h2>
              <p className="text-xs text-[#6a6d78]">Earnings releases, consensus EPS estimates, and reported beats</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f0f3fa] text-[#6a6d78] hover:text-[#131722]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#e0e3eb] bg-[#f0f3fa]/40 text-xs">
          {(['All', 'Pre-market', 'Post-market', 'Upcoming IPO'] as const).map((sess) => (
            <button
              key={sess}
              onClick={() => setFilterSession(sess)}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                filterSession === sess
                  ? 'bg-[#2c303c] text-white'
                  : 'bg-white text-[#6a6d78] hover:bg-[#e0e3eb]'
              }`}
            >
              {sess}
            </button>
          ))}
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto p-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e0e3eb] text-[#8a8d98] font-semibold pb-2">
                <th className="pb-2">Company / Ticker</th>
                <th className="pb-2">Release Timing</th>
                <th className="pb-2 text-right">Est. EPS</th>
                <th className="pb-2 text-right">Act. EPS</th>
                <th className="pb-2 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3fa]">
              {filtered.map((item) => {
                const estNum = parseFloat(item.estimate);
                const actNum = parseFloat(item.actual);
                const isReported = item.actual !== '—';
                const isBeat = isReported && !isNaN(estNum) && !isNaN(actNum) && actNum >= estNum;

                return (
                  <tr 
                    key={item.id}
                    onClick={() => {
                      if (onSelectCompany) onSelectCompany(item.symbol);
                      onClose();
                    }}
                    className="hover:bg-[#f0f3fa] cursor-pointer transition-colors"
                  >
                    <td className="py-3">
                      <div className="font-bold text-[#131722] text-sm">{item.company}</div>
                      <div className="text-[#6a6d78] font-mono">{item.symbol}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-[#f0f3fa] text-[#434656] font-medium">
                        {item.session}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-[#131722]">
                      {item.estimate}
                    </td>
                    <td className="py-3 text-right font-mono font-semibold">
                      {item.actual}
                    </td>
                    <td className="py-3 text-right">
                      {item.statusBadge ? (
                        <span className="text-[#0049db] font-bold">{item.statusBadge}</span>
                      ) : !isReported ? (
                        <span className="text-[#8a8d98]">Pending</span>
                      ) : isBeat ? (
                        <span className="text-[#089981] font-bold">Beat</span>
                      ) : (
                        <span className="text-[#f23645] font-bold">Miss</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
