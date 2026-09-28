import React, { useState } from 'react';

interface HeatmapTile {
  symbol: string;
  name: string;
  category: string;
  change: number;
  weight: number; // visual size flex
  price: string;
}

const HEATMAP_ITEMS: HeatmapTile[] = [
  { symbol: 'NVDA', name: 'NVIDIA', category: 'Semiconductors', change: 3.12, weight: 30, price: '$142.50' },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Consumer Tech', change: 0.85, weight: 28, price: '$231.40' },
  { symbol: 'MSFT', name: 'Microsoft', category: 'Software', change: 0.40, weight: 24, price: '$428.15' },
  { symbol: 'AMZN', name: 'Amazon', category: 'Consumer Discretionary', change: 1.15, weight: 20, price: '$194.20' },
  { symbol: 'GOOGL', name: 'Alphabet', category: 'Communication', change: -0.35, weight: 22, price: '$182.60' },
  { symbol: 'META', name: 'Meta Platforms', category: 'Communication', change: 1.90, weight: 18, price: '$592.10' },
  { symbol: 'TSLA', name: 'Tesla', category: 'Automotive', change: 4.80, weight: 16, price: '$260.40' },
  { symbol: 'AVGO', name: 'Broadcom', category: 'Semiconductors', change: 2.15, weight: 14, price: '$178.90' },
  { symbol: 'AMD', name: 'Adv. Micro Devices', category: 'Semiconductors', change: -1.45, weight: 12, price: '$156.20' },
  { symbol: 'BTC', name: 'Bitcoin', category: 'Crypto', change: 3.85, weight: 26, price: '$89,450' },
  { symbol: 'ETH', name: 'Ethereum', category: 'Crypto', change: 2.10, weight: 16, price: '$3,120' },
  { symbol: 'SOL', name: 'Solana', category: 'Crypto', change: 8.40, weight: 12, price: '$212.80' },
  { symbol: 'JPM', name: 'JPMorgan Chase', category: 'Financials', change: 0.62, weight: 15, price: '$224.10' },
  { symbol: 'XOM', name: 'ExxonMobil', category: 'Energy', change: -0.88, weight: 13, price: '$118.50' },
  { symbol: 'LLY', name: 'Eli Lilly', category: 'Healthcare', change: 1.34, weight: 14, price: '$912.40' },
  { symbol: 'UNH', name: 'UnitedHealth', category: 'Healthcare', change: -1.12, weight: 13, price: '$584.20' },
];

interface HeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol?: (symbol: string) => void;
}

export const HeatmapModal: React.FC<HeatmapModalProps> = ({ isOpen, onClose, onSelectSymbol }) => {
  const [filter, setFilter] = useState<'All' | 'Semiconductors' | 'Crypto' | 'Communication'>('All');

  if (!isOpen) return null;

  const filtered = filter === 'All' ? HEATMAP_ITEMS : HEATMAP_ITEMS.filter((i) => i.category === filter);

  const getBgColor = (change: number) => {
    if (change >= 5) return 'bg-[#089981]';
    if (change >= 2) return 'bg-[#0aa68c]';
    if (change >= 0.5) return 'bg-[#26a69a]';
    if (change >= 0) return 'bg-[#4db6ac]';
    if (change >= -1) return 'bg-[#e57373]';
    if (change >= -3) return 'bg-[#ef5350]';
    return 'bg-[#f23645]';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e3eb] bg-[#faf8ff]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2962ff] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#131722]">Global Market Heatmap</h2>
              <p className="text-xs text-[#6a6d78]">Visual distribution by market performance and capital scale</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#f0f3fa] p-1 rounded-lg text-xs">
              {(['All', 'Semiconductors', 'Crypto', 'Communication'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    filter === cat ? 'bg-white text-[#131722] shadow-xs' : 'text-[#6a6d78] hover:text-[#131722]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#f0f3fa] text-[#6a6d78] hover:text-[#131722]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((tile) => (
              <div
                key={tile.symbol}
                onClick={() => {
                  if (onSelectSymbol) onSelectSymbol(tile.symbol);
                  onClose();
                }}
                className={`p-4 rounded-xl text-white cursor-pointer transition-transform hover:scale-[1.02] shadow-sm flex flex-col justify-between min-h-[110px] ${getBgColor(
                  tile.change
                )}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-extrabold text-base tracking-wide">{tile.symbol}</span>
                  <span className="text-xs font-semibold bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    {tile.change > 0 ? '+' : ''}{tile.change.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs opacity-90 truncate">{tile.name}</div>
                  <div className="font-mono text-xs font-bold mt-0.5">{tile.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-[#e0e3eb] flex flex-wrap items-center justify-between text-xs text-[#6a6d78]">
            <div className="flex items-center gap-2">
              <span>-3%</span>
              <div className="flex h-3 rounded-full overflow-hidden w-48">
                <div className="w-1/6 bg-[#f23645]" />
                <div className="w-1/6 bg-[#ef5350]" />
                <div className="w-1/6 bg-[#e57373]" />
                <div className="w-1/6 bg-[#4db6ac]" />
                <div className="w-1/6 bg-[#26a69a]" />
                <div className="w-1/6 bg-[#089981]" />
              </div>
              <span>+3%</span>
            </div>
            <span>Click any tile to inspect asset Superchart</span>
          </div>
        </div>
      </div>
    </div>
  );
};
