import React, { useState, useEffect, useRef } from 'react';
import { MarketAsset } from '../types';
import {
  PRIMARY_INDICES,
  WORLD_INDICES,
  BIG_TECH_STOCKS,
  HIGHEST_VOLUME_STOCKS,
  CRYPTO_ASSETS,
  COMMODITIES_FUTURES
} from '../data/marketData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'stocks' | 'crypto' | 'indices' | 'commodities'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Collect all searchable assets
  const allAssets: MarketAsset[] = [
    ...PRIMARY_INDICES,
    ...WORLD_INDICES,
    ...BIG_TECH_STOCKS,
    ...HIGHEST_VOLUME_STOCKS,
    ...CRYPTO_ASSETS,
    ...COMMODITIES_FUTURES
  ].filter((asset, index, self) => index === self.findIndex((a) => a.symbol === asset.symbol));

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = allAssets.filter((item) => {
    const matchesQuery =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.symbol.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'stocks' && item.category === 'stock') return true;
    if (activeCategory === 'crypto' && item.category === 'crypto') return true;
    if (activeCategory === 'indices' && item.category === 'index') return true;
    if (activeCategory === 'commodities' && item.category === 'commodity') return true;
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-[#e0e3eb]">
          <span className="material-symbols-outlined text-[#6a6d78] text-[22px] mr-2">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, crypto, or index (e.g. NVDA, BTC, S&P)..."
            className="w-full bg-transparent text-[#131722] placeholder:text-[#6a6d78] text-base outline-none font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs text-[#8a8d98] hover:text-[#131722] p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs font-semibold px-2 py-1 bg-[#f0f3fa] text-[#6a6d78] rounded hover:bg-[#e0e3eb]"
          >
            ESC
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#f0f3fa]/50 border-b border-[#e0e3eb] text-xs">
          {(['all', 'stocks', 'crypto', 'indices', 'commodities'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full capitalize font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-[#2c303c] text-white'
                  : 'bg-white text-[#6a6d78] hover:bg-[#e0e3eb] hover:text-[#131722]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#f0f3fa]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#8a8d98]">
              <span className="material-symbols-outlined text-4xl block mb-2 text-[#c3c5d8]">search_off</span>
              <p className="font-semibold text-sm">No symbols found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for Apple, Bitcoin, S&P 500, Gold, or Oil</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isPositive = item.changePercent >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectAsset(item);
                    onClose();
                  }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#f0f3fa] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f0f3fa] flex items-center justify-center font-bold text-xs text-[#131722] group-hover:bg-[#2962ff] group-hover:text-white transition-colors">
                      {item.flag || item.badge || item.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#131722] group-hover:text-[#0049db] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-xs text-[#6a6d78] uppercase px-1.5 py-0.2 bg-[#f0f3fa] rounded">
                          {item.exchange || item.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#6a6d78] truncate max-w-xs">{item.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-[#131722]">
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4
                      })}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#faf8ff] border-t border-[#e0e3eb] flex items-center justify-between text-xs text-[#8a8d98]">
          <span>Select any symbol to open Interactive Superchart</span>
          <span>TradingView Markets</span>
        </div>
      </div>
    </div>
  );
};
