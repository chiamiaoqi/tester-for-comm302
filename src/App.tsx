import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { HeatmapModal } from './components/HeatmapModal';
import { YieldCurveModal } from './components/YieldCurveModal';
import { EarningsCalendarModal } from './components/EarningsCalendarModal';
import { AuthModal } from './components/AuthModal';
import { MarketAsset } from './types';
import {
  PRIMARY_INDICES,
  WORLD_INDICES,
  BIG_TECH_STOCKS,
  HIGHEST_VOLUME_STOCKS,
  STOCK_GAINERS_REGULAR,
  STOCK_GAINERS_PRE,
  STOCK_LOSERS_REGULAR,
  STOCK_LOSERS_PRE,
  EARNINGS_CALENDAR,
  BIGGEST_COMPANIES,
  LARGEST_EMPLOYERS,
  CRYPTO_ASSETS,
  COMMODITIES_FUTURES,
  GOV_BONDS
} from './data/marketData';

export default function App() {
  // State management
  const [activeCategory, setActiveCategory] = useState<string>('indices');
  const [regionFilter, setRegionFilter] = useState<'All' | 'Americas' | 'Europe' | 'Asia'>('All');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [gainerTab, setGainerTab] = useState<'Reg' | 'Pre'>('Reg');
  const [loserTab, setLoserTab] = useState<'Reg' | 'Pre'>('Reg');
  const [usStocksFilter, setUsStocksFilter] = useState<'trends' | 'active'>('trends');

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const [yieldCurveOpen, setYieldCurveOpen] = useState(false);
  const [earningsCalendarOpen, setEarningsCalendarOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);

  // Watchlist & User
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'BTCUSD', 'SPX'];
    } catch {
      return ['NVDA', 'BTCUSD', 'SPX'];
    }
  });

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [liveSimulation, setLiveSimulation] = useState(true);

  // Live price simulator state
  const [priceDeltas, setPriceDeltas] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!liveSimulation) return;
    const interval = setInterval(() => {
      // Pick random assets to tick
      const keys = ['sp500', 'ndx', 'nvda', 'aapl', 'btc', 'eth', 'gold'];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const tick = (Math.random() - 0.49) * 0.25;

      setPriceDeltas((prev) => ({
        ...prev,
        [randomKey]: (prev[randomKey] || 0) + tick
      }));
    }, 2800);

    return () => clearInterval(interval);
  }, [liveSimulation]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      try {
        localStorage.setItem('tv_watchlist', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  const getEffectivePrice = (asset: MarketAsset) => {
    const delta = priceDeltas[asset.id] || 0;
    return asset.price + delta;
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] font-['Inter',sans-serif] text-[#171b26] antialiased">
      {/* Top Fixed Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        user={user}
        liveSimulation={liveSimulation}
        onToggleLiveSimulation={() => setLiveSimulation(!liveSimulation)}
      />

      <main className="w-full pt-28 bg-[#faf8ff]">
        <div className="flex flex-col w-full">
          {/* Sub-header Title Area */}
          <section className="w-full bg-white border-b border-[#e0e3eb]/50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 flex flex-col items-center justify-center text-center">
              {/* Interactive Dropdown Title */}
              <div className="relative">
                <button
                  onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                  className="inline-flex items-center gap-1 cursor-pointer group hover:opacity-85 transition-opacity focus:outline-none"
                >
                  <h1 className="text-3xl md:text-5xl text-[#131722] tracking-tight font-extrabold flex items-center gap-2">
                    Markets, everywhere
                  </h1>
                  <span
                    className={`material-symbols-outlined text-[32px] md:text-[36px] text-[#131722] transition-transform duration-200 ${
                      isRegionDropdownOpen ? 'rotate-180' : ''
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </button>

                {/* Region Dropdown Menu */}
                {isRegionDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e0e3eb] py-2 z-30 text-left">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-[#8a8d98] uppercase">
                      Select Region
                    </div>
                    {(['All', 'Americas', 'Europe', 'Asia'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRegionFilter(r);
                          setIsRegionDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-[#f0f3fa] transition-colors ${
                          regionFilter === r ? 'text-[#0049db] bg-[#f0f3fa]' : 'text-[#171b26]'
                        }`}
                      >
                        <span>{r === 'All' ? 'All Global Markets' : `${r} Markets`}</span>
                        {regionFilter === r && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter Pills Bar */}
              <div className="w-full mt-4 overflow-x-auto no-scrollbar pb-1">
                <div className="inline-flex items-center justify-center gap-1.5 mx-auto min-w-max">
                  {[
                    { id: 'indices', label: 'Indices' },
                    { id: 'us-stocks', label: 'US stocks' },
                    { id: 'world-stocks', label: 'World stocks' },
                    { id: 'crypto', label: 'Crypto' },
                    { id: 'futures', label: 'Futures' },
                    { id: 'forex', label: 'Forex' },
                    { id: 'government-bonds', label: 'Government bonds' },
                    { id: 'corporate-bonds', label: 'Corporate bonds' },
                    { id: 'etfs', label: 'ETFs' },
                    { id: 'economy', label: 'Economy' }
                  ].map((pill) => {
                    const isSelected = activeCategory === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(pill.id);
                          const el = document.getElementById(pill.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#2c303c] text-white shadow-xs'
                            : 'bg-[#f0f3fa] text-[#434656] hover:bg-[#e0e3eb] hover:text-[#171b26]'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Main Data Container */}
          <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-10">
            {/* SECTION 1: INDICES */}
            <section id="indices" className="flex flex-col gap-4 scroll-mt-32">
              {/* Section Title Link */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedAsset(PRIMARY_INDICES[0])}
                  className="inline-flex items-center gap-1 text-[#131722] hover:text-[#0049db] group transition-colors text-left"
                >
                  <span className="text-2xl font-bold tracking-tight">Indices</span>
                  <span className="material-symbols-outlined text-[24px] transition-transform group-hover:translate-x-1">
                    chevron_right
                  </span>
                </button>
                <div className="flex items-center gap-2 text-[#6a6d78] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
                  <span>US Markets Open</span>
                </div>
              </div>

              {/* Top Primary Index Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {PRIMARY_INDICES.map((idx) => {
                  const currentPrice = getEffectivePrice(idx);
                  const isPositive = idx.changePercent >= 0;

                  return (
                    <div
                      key={idx.id}
                      onClick={() => setSelectedAsset(idx)}
                      className="flex flex-col p-3.5 rounded-2xl bg-white hover:bg-[#f0f3fa] shadow-xs hover:shadow-md border border-[#e0e3eb]/50 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-full ${idx.badgeBg} ${idx.badgeText} flex items-center justify-center text-[11px] font-black shadow-inner`}
                          >
                            {idx.badge}
                          </span>
                          <span className="text-sm text-[#131722] font-bold group-hover:text-[#0049db] transition-colors truncate">
                            {idx.name}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-[#8a8d98] text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
                          open_in_new
                        </span>
                      </div>

                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="font-mono text-sm font-bold text-[#131722] tabular-figures">
                            {currentPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </div>
                          <div
                            className={`text-[11px] font-semibold flex items-center mt-0.5 ${
                              isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            <span>
                              {isPositive ? '+' : ''}
                              {idx.change.toFixed(2)}
                            </span>
                            <span className="ml-1">
                              ({isPositive ? '+' : ''}
                              {idx.changePercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>

                        {/* Sparkline */}
                        <div className="w-20 h-8">
                          <svg
                            className={`w-full h-full fill-none stroke-[2] ${
                              isPositive ? 'stroke-[#089981]' : 'stroke-[#f23645]'
                            }`}
                            viewBox="0 0 80 32"
                          >
                            {isPositive ? (
                              <polyline points="0,26 15,22 30,25 45,14 60,16 80,4" />
                            ) : (
                              <polyline points="0,6 20,8 38,18 55,14 70,24 80,26" />
                            )}
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* World Indices Sub-Section Card Grid */}
              <div id="world-stocks" className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col gap-4 scroll-mt-32">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#131722]">World indices</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#f0f3fa] text-[11px] text-[#6a6d78] font-semibold">
                      Global Markets
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedAsset(WORLD_INDICES[0])}
                    className="text-xs font-semibold text-[#0049db] hover:underline flex items-center gap-1"
                  >
                    See all major indices
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {WORLD_INDICES.map((w) => {
                    const isPositive = w.changePercent >= 0;
                    return (
                      <div
                        key={w.id}
                        onClick={() => setSelectedAsset(w)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f0f3fa] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#f0f3fa] flex items-center justify-center text-xs font-bold text-[#131722]">
                            {w.flag}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] transition-colors">
                              {w.name}
                            </span>
                            <span className="text-[11px] text-[#6a6d78]">
                              {w.symbol} • {w.exchange}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-[#131722] tabular-figures">
                            {w.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </div>
                          <div
                            className={`text-[11px] font-semibold ${
                              isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            {w.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 2: US STOCKS & MARKET MOVERS */}
            <section id="us-stocks" className="flex flex-col gap-4 scroll-mt-32">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedAsset(BIG_TECH_STOCKS[0])}
                  className="inline-flex items-center gap-1 text-[#131722] hover:text-[#0049db] group transition-colors text-left"
                >
                  <span className="text-2xl font-bold tracking-tight">US stocks</span>
                  <span className="material-symbols-outlined text-[24px] transition-transform group-hover:translate-x-1">
                    chevron_right
                  </span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setUsStocksFilter('trends')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      usStocksFilter === 'trends'
                        ? 'bg-[#dfe2f2] text-[#171b26]'
                        : 'bg-[#f0f3fa] text-[#6a6d78] hover:bg-[#e0e3eb]'
                    }`}
                  >
                    Community trends
                  </button>
                  <button
                    onClick={() => setUsStocksFilter('active')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      usStocksFilter === 'active'
                        ? 'bg-[#dfe2f2] text-[#171b26]'
                        : 'bg-[#f0f3fa] text-[#6a6d78] hover:bg-[#e0e3eb]'
                    }`}
                  >
                    Active
                  </button>
                </div>
              </div>

              {/* Featured Big Tech Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {BIG_TECH_STOCKS.map((stock) => {
                  const currentPrice = getEffectivePrice(stock);
                  const isPositive = stock.changePercent >= 0;

                  return (
                    <div
                      key={stock.id}
                      onClick={() => setSelectedAsset(stock)}
                      className="p-3.5 rounded-2xl bg-white hover:bg-[#f0f3fa] shadow-xs hover:shadow-md border border-[#e0e3eb]/50 transition-all flex flex-col justify-between group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-full bg-[#f0f3fa] flex items-center justify-center text-xs font-black text-[#131722] group-hover:bg-[#2962ff] group-hover:text-white transition-colors">
                          {stock.badge}
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isPositive
                              ? 'text-[#089981] bg-emerald-50'
                              : 'text-[#f23645] bg-red-50'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] transition-colors block truncate">
                          {stock.name}
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-[11px] text-[#6a6d78] font-mono">{stock.symbol}</span>
                          <span className="font-mono text-xs font-bold text-[#131722] tabular-figures">
                            {currentPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 4-Column Market Movers Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Column 1: Highest Volume Stocks */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-[#131722]">Highest volume</h3>
                      <button
                        onClick={() => setSelectedAsset(HIGHEST_VOLUME_STOCKS[0])}
                        className="text-[#6a6d78] hover:text-[#131722]"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {HIGHEST_VOLUME_STOCKS.map((item) => {
                        const isPositive = item.changePercent >= 0;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedAsset(item)}
                            className="flex items-center justify-between py-1.5 px-2 hover:bg-[#f0f3fa] rounded-lg transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-[#f0f3fa] flex items-center justify-center text-[10px] font-bold text-[#6a6d78]">
                                {item.badge}
                              </div>
                              <div className="truncate">
                                <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] block truncate">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-[#6a6d78]">
                                  Vol: {item.volume}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-xs font-bold text-[#131722] tabular-figures">
                                {item.price.toFixed(2)}
                              </div>
                              <div
                                className={`text-[11px] font-semibold ${
                                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                                }`}
                              >
                                {isPositive ? '+' : ''}
                                {item.changePercent.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAsset(HIGHEST_VOLUME_STOCKS[0])}
                    className="mt-4 pt-2 text-xs font-semibold text-[#0049db] hover:underline block text-center border-t border-[#f0f3fa]"
                  >
                    See all most active stocks
                  </button>
                </div>

                {/* Column 2: Stock Gainers */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-[#131722]">Stock gainers</h3>
                      <div className="flex items-center bg-[#f0f3fa] p-0.5 rounded-full text-[11px]">
                        <button
                          onClick={() => setGainerTab('Reg')}
                          className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                            gainerTab === 'Reg'
                              ? 'bg-white text-[#131722] shadow-xs'
                              : 'text-[#6a6d78] hover:text-[#131722]'
                          }`}
                        >
                          Reg
                        </button>
                        <button
                          onClick={() => setGainerTab('Pre')}
                          className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                            gainerTab === 'Pre'
                              ? 'bg-white text-[#131722] shadow-xs'
                              : 'text-[#6a6d78] hover:text-[#131722]'
                          }`}
                        >
                          Pre
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {(gainerTab === 'Reg' ? STOCK_GAINERS_REGULAR : STOCK_GAINERS_PRE).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedAsset(item)}
                          className="flex items-center justify-between py-1.5 px-2 hover:bg-[#f0f3fa] rounded-lg transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-[#f0f3fa] flex items-center justify-center text-[10px] font-bold text-[#6a6d78]">
                              {item.badge}
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] block truncate">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-[#6a6d78]">
                                {item.symbol} • {item.exchange}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-xs font-bold text-[#131722] tabular-figures">
                              {item.price.toFixed(2)}
                            </div>
                            <div className="text-[11px] text-[#089981] font-semibold">
                              +{item.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAsset(STOCK_GAINERS_REGULAR[0])}
                    className="mt-4 pt-2 text-xs font-semibold text-[#0049db] hover:underline block text-center border-t border-[#f0f3fa]"
                  >
                    See all stock gainers
                  </button>
                </div>

                {/* Column 3: Stock Losers */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-[#131722]">Stock losers</h3>
                      <div className="flex items-center bg-[#f0f3fa] p-0.5 rounded-full text-[11px]">
                        <button
                          onClick={() => setLoserTab('Reg')}
                          className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                            loserTab === 'Reg'
                              ? 'bg-white text-[#131722] shadow-xs'
                              : 'text-[#6a6d78] hover:text-[#131722]'
                          }`}
                        >
                          Reg
                        </button>
                        <button
                          onClick={() => setLoserTab('Pre')}
                          className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                            loserTab === 'Pre'
                              ? 'bg-white text-[#131722] shadow-xs'
                              : 'text-[#6a6d78] hover:text-[#131722]'
                          }`}
                        >
                          Pre
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {(loserTab === 'Reg' ? STOCK_LOSERS_REGULAR : STOCK_LOSERS_PRE).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedAsset(item)}
                          className="flex items-center justify-between py-1.5 px-2 hover:bg-[#f0f3fa] rounded-lg transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-[#f0f3fa] flex items-center justify-center text-[10px] font-bold text-[#6a6d78]">
                              {item.badge}
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] block truncate">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-[#6a6d78]">
                                {item.symbol} • {item.exchange}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-xs font-bold text-[#131722] tabular-figures">
                              {item.price.toFixed(2)}
                            </div>
                            <div className="text-[11px] text-[#f23645] font-semibold">
                              {item.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAsset(STOCK_LOSERS_REGULAR[0])}
                    className="mt-4 pt-2 text-xs font-semibold text-[#0049db] hover:underline block text-center border-t border-[#f0f3fa]"
                  >
                    See all stock losers
                  </button>
                </div>

                {/* Column 4: Earnings Calendar */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-[#131722]">Earnings Calendar</h3>
                      <span className="px-2 py-0.5 rounded bg-[#f0f3fa] text-[11px] text-[#6a6d78] font-semibold">
                        Today
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {EARNINGS_CALENDAR.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setEarningsCalendarOpen(true)}
                          className="flex items-center justify-between py-1.5 px-2 hover:bg-[#f0f3fa] rounded-lg transition-colors cursor-pointer group"
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] block truncate">
                              {item.company}
                            </span>
                            <span className="text-[11px] text-[#6a6d78]">
                              {item.symbol} • {item.session}
                            </span>
                          </div>
                          <div className="text-right">
                            {item.statusBadge ? (
                              <>
                                <div className="text-[11px] font-bold text-[#0049db]">
                                  {item.statusBadge}
                                </div>
                                <div className="text-[10px] text-[#6a6d78]">{item.period}</div>
                              </>
                            ) : (
                              <>
                                <div className="font-mono text-xs font-bold text-[#131722]">
                                  Est: {item.estimate}
                                </div>
                                <div
                                  className={`text-[11px] ${
                                    item.actual !== '—'
                                      ? 'text-[#089981] font-semibold'
                                      : 'text-[#6a6d78]'
                                  }`}
                                >
                                  Act: {item.actual}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setEarningsCalendarOpen(true)}
                    className="mt-4 pt-2 text-xs font-semibold text-[#0049db] hover:underline block text-center border-t border-[#f0f3fa]"
                  >
                    See full earnings calendar
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 3: WORLD BIGGEST COMPANIES & EMPLOYERS (SIDE BY SIDE) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: World Biggest Companies */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-[#131722]">World biggest companies</span>
                      <span className="material-symbols-outlined text-[#6a6d78] text-[18px]">public</span>
                    </div>
                    <button
                      onClick={() => setSelectedAsset(BIGGEST_COMPANIES[0])}
                      className="text-xs font-semibold text-[#0049db] hover:underline"
                    >
                      See all
                    </button>
                  </div>

                  {/* Table Header */}
                  <div className="flex items-center justify-between text-[#6a6d78] text-[11px] font-semibold pb-2 border-b border-[#f0f3fa]">
                    <span>Company</span>
                    <div className="flex items-center gap-8">
                      <span>Price</span>
                      <span className="w-20 text-right">Market cap</span>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="flex flex-col mt-1">
                    {BIGGEST_COMPANIES.map((item, index) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedAsset(item)}
                        className="flex items-center justify-between py-2.5 px-2 hover:bg-[#f0f3fa] rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs font-bold text-[#131722] w-4">
                            {index + 1}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] block truncate">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-[#6a6d78]">
                              {item.symbol} • {item.exchange}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 text-right">
                          <span className="font-mono text-xs font-semibold text-[#131722] tabular-figures">
                            {item.price.toFixed(2)}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#131722] w-20">
                            {item.marketCap}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#f0f3fa] text-[#6a6d78] text-[11px]">
                  <span>Source: Global Exchange Cap Index</span>
                  <span>Updated realtime</span>
                </div>
              </div>

              {/* Right: World Largest Employers */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-[#131722]">World largest employers</span>
                      <span className="material-symbols-outlined text-[#6a6d78] text-[18px]">groups</span>
                    </div>
                    <button
                      onClick={() => setHeatmapOpen(true)}
                      className="text-xs font-semibold text-[#0049db] hover:underline"
                    >
                      See all
                    </button>
                  </div>

                  {/* Table Header */}
                  <div className="flex items-center justify-between text-[#6a6d78] text-[11px] font-semibold pb-2 border-b border-[#f0f3fa]">
                    <span>Company</span>
                    <div className="flex items-center gap-8">
                      <span>Country</span>
                      <span className="w-20 text-right">Employees</span>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="flex flex-col mt-1">
                    {LARGEST_EMPLOYERS.map((item) => (
                      <div
                        key={item.rank}
                        onClick={() => setHeatmapOpen(true)}
                        className="flex items-center justify-between py-2.5 px-2 hover:bg-[#f0f3fa] rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs font-bold text-[#131722] w-4">
                            {item.rank}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] block truncate">
                              {item.company}
                            </span>
                            <span className="text-[11px] text-[#6a6d78]">
                              {item.ticker} • {item.sector}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 text-right">
                          <span className="text-[11px] text-[#6a6d78]">
                            {item.country}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#131722] w-20">
                            {item.employees}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#f0f3fa] text-[#6a6d78] text-[11px]">
                  <span>Global Institutional Filing Data</span>
                  <span>Annual 2024</span>
                </div>
              </div>
            </section>

            {/* SECTION 4: CRYPTO & FUTURES / COMMODITIES */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: Crypto Overview */}
              <div id="crypto" className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col justify-between scroll-mt-32">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setSelectedAsset(CRYPTO_ASSETS[0])}
                      className="inline-flex items-center gap-1 text-[#131722] hover:text-[#0049db] group"
                    >
                      <span className="text-base font-bold">Crypto</span>
                      <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                        chevron_right
                      </span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#089981] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        Bullish Trend
                      </span>
                      <button
                        onClick={() => setSelectedAsset(CRYPTO_ASSETS[0])}
                        className="text-xs font-semibold text-[#0049db] hover:underline"
                      >
                        See all coins
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {CRYPTO_ASSETS.map((coin) => {
                      const currentPrice = getEffectivePrice(coin);
                      const isPositive = coin.changePercent >= 0;

                      return (
                        <div
                          key={coin.id}
                          onClick={() => setSelectedAsset(coin)}
                          className="flex items-center justify-between p-2 hover:bg-[#f0f3fa] rounded-xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-full ${coin.badgeBg} ${coin.badgeText} flex items-center justify-center font-bold text-xs shadow-xs`}
                            >
                              {coin.badge}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] block truncate">
                                {coin.name}
                              </span>
                              <span className="text-[11px] text-[#6a6d78]">
                                {coin.symbol} • {coin.marketCap}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-mono text-xs font-bold text-[#131722] tabular-figures">
                              {currentPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4
                              })}
                            </div>
                            <div
                              className={`text-[11px] font-semibold ${
                                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {coin.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-[#f0f3fa] flex items-center justify-between text-[#6a6d78] text-xs">
                  <span>
                    Top gainers:{' '}
                    <span className="text-[#089981] font-bold">QNT (+42.8%)</span>,{' '}
                    <span className="text-[#089981] font-bold">HBAR (+21.4%)</span>
                  </span>
                  <button
                    onClick={() => setHeatmapOpen(true)}
                    className="font-semibold text-[#0049db] hover:underline"
                  >
                    Heatmap view
                  </button>
                </div>
              </div>

              {/* Right: Futures & Commodities */}
              <div id="futures" className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col justify-between scroll-mt-32">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setSelectedAsset(COMMODITIES_FUTURES[0])}
                      className="inline-flex items-center gap-1 text-[#131722] hover:text-[#0049db] group"
                    >
                      <span className="text-base font-bold">Futures and commodities</span>
                      <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                        chevron_right
                      </span>
                    </button>
                    <button
                      onClick={() => setSelectedAsset(COMMODITIES_FUTURES[0])}
                      className="text-xs font-semibold text-[#0049db] hover:underline"
                    >
                      See all futures
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {COMMODITIES_FUTURES.map((comm) => {
                      const currentPrice = getEffectivePrice(comm);
                      const isPositive = comm.changePercent >= 0;

                      return (
                        <div
                          key={comm.id}
                          onClick={() => setSelectedAsset(comm)}
                          className="flex items-center justify-between p-2 hover:bg-[#f0f3fa] rounded-xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-full ${comm.badgeBg} ${comm.badgeText} flex items-center justify-center font-bold text-xs shadow-xs`}
                            >
                              {comm.badge}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[#131722] group-hover:text-[#0049db] block truncate">
                                {comm.name}
                              </span>
                              <span className="text-[11px] text-[#6a6d78]">
                                {comm.symbol} • {comm.exchange}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-mono text-xs font-bold text-[#131722] tabular-figures">
                              {currentPrice.toLocaleString(undefined, {
                                minimumFractionDigits: comm.price < 10 ? 3 : 2,
                                maximumFractionDigits: 3
                              })}
                            </div>
                            <div
                              className={`text-[11px] font-semibold ${
                                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {comm.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-[#f0f3fa] flex items-center justify-between text-[#6a6d78] text-xs">
                  <span>Energy, Metals, Ags & Currencies</span>
                  <button
                    onClick={() => setSelectedAsset(COMMODITIES_FUTURES[0])}
                    className="font-semibold text-[#0049db] hover:underline"
                  >
                    Open Supercharts
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 5: GOVERNMENT BONDS & YIELD CURVE SUMMARY */}
            <section id="government-bonds" className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3eb]/50 flex flex-col gap-4 scroll-mt-32">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setYieldCurveOpen(true)}
                  className="inline-flex items-center gap-1 text-[#131722] hover:text-[#0049db] group"
                >
                  <span className="text-base font-bold">Government bonds & Yields</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                    chevron_right
                  </span>
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-[#6a6d78] text-xs">US Treasury Benchmark</span>
                  <button
                    onClick={() => setYieldCurveOpen(true)}
                    className="text-xs font-semibold text-[#0049db] hover:underline"
                  >
                    Customize curves
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {GOV_BONDS.map((bond) => (
                  <div
                    key={bond.code}
                    onClick={() => setYieldCurveOpen(true)}
                    className="p-3 rounded-xl bg-[#f0f3fa] hover:bg-[#e0e3eb] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6a6d78] font-bold">{bond.code}</span>
                      <span className="text-[11px] text-[#f23645] font-semibold">
                        {bond.changePercent}
                      </span>
                    </div>
                    <div className="mt-1 text-lg font-black text-[#131722] group-hover:text-[#0049db] transition-colors font-mono">
                      {bond.yield}
                    </div>
                    <div className="text-[11px] text-[#6a6d78] mt-0.5">{bond.tenor}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 6: ECONOMIC CALENDAR & GLOBAL MACRO PROMO BANNER */}
            <section id="economy" className="rounded-3xl bg-gradient-to-r from-[#171b26] to-[#001550] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg scroll-mt-32">
              <div className="flex flex-col gap-2 max-w-xl z-10">
                <div className="inline-flex items-center gap-1.5 text-[#00a3e0] text-xs font-bold tracking-wide uppercase">
                  <span className="material-symbols-outlined text-[16px]">insights</span>
                  Institutional Grade Macro Analytics
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Track interest rate pivots, inflation shocks, and earnings beats live.
                </h2>
                <p className="text-xs md:text-sm text-[#8a8d98]">
                  Monitor over 150,000 global economic indicators in real-time with customizable charts, interactive heatmaps, and sentiment alerts.
                </p>
              </div>

              <div className="flex items-center gap-3 z-10 shrink-0">
                <button
                  onClick={() => setHeatmapOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-[#2962ff] hover:bg-[#0049db] text-white text-xs font-bold shadow-md transition-all"
                >
                  Explore Economy Heatmap
                </button>
                <button
                  onClick={() => setEarningsCalendarOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  View Calendars
                </button>
              </div>

              {/* Background graphic wave watermark */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <svg className="stroke-white stroke-[3]" fill="none" height="200" viewBox="0 0 320 200" width="320">
                  <path d="M0,160 Q80,20 160,100 T320,40" />
                </svg>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white mt-12 border-t border-[#e0e3eb]/60 shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#2962ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[14px]">show_chart</span>
            </div>
            <span className="text-sm font-bold text-[#131722]">TradingView</span>
            <span className="text-xs text-[#6a6d78] ml-2">
              © 2026 TradingView Inc. All market data provided with institutional clarity.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#6a6d78]">
            <a href="#" className="hover:text-[#131722] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#131722] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#131722] transition-colors">Market Disclaimer</a>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />

      <HeatmapModal
        isOpen={heatmapOpen}
        onClose={() => setHeatmapOpen(false)}
        onSelectSymbol={(sym) => {
          const found = [
            ...PRIMARY_INDICES,
            ...BIG_TECH_STOCKS,
            ...CRYPTO_ASSETS,
            ...COMMODITIES_FUTURES
          ].find((a) => a.symbol === sym);
          if (found) setSelectedAsset(found);
        }}
      />

      <YieldCurveModal
        isOpen={yieldCurveOpen}
        onClose={() => setYieldCurveOpen(false)}
      />

      <EarningsCalendarModal
        isOpen={earningsCalendarOpen}
        onClose={() => setEarningsCalendarOpen(false)}
        onSelectCompany={(sym) => {
          const found = [
            ...PRIMARY_INDICES,
            ...BIG_TECH_STOCKS,
            ...HIGHEST_VOLUME_STOCKS
          ].find((a) => a.symbol === sym);
          if (found) setSelectedAsset(found);
        }}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        user={user}
        onLogin={(name, email) => setUser({ name, email })}
        onLogout={() => setUser(null)}
      />
    </div>
  );
}
