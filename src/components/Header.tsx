import React from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  user: { name: string; email: string } | null;
  liveSimulation: boolean;
  onToggleLiveSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAuth,
  activeCategory,
  onSelectCategory,
  user,
  liveSimulation,
  onToggleLiveSimulation
}) => {
  const categories = [
    { id: 'indices', label: 'Indices' },
    { id: 'us-stocks', label: 'US stocks' },
    { id: 'world-stocks', label: 'World stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'government-bonds', label: 'Government bonds' },
    { id: 'corporate-bonds', label: 'Corporate bonds' },
    { id: 'etfs', label: 'ETFs' },
    { id: 'economy', label: 'Economy' },
  ];

  const handleNavClick = (id: string) => {
    onSelectCategory(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e0e3eb]/60">
      <div className="h-28 max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col justify-between">
        {/* Row 1: Brand, Search, Primary Nav, Actions */}
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#2962ff] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-white text-[20px]">show_chart</span>
              </div>
              <span className="text-xl tracking-tight font-extrabold text-[#131722]">
                TradingView
              </span>
            </a>

            {/* Search Bar - Interactive */}
            <div 
              onClick={onOpenSearch}
              className="relative w-56 sm:w-64 lg:w-80 cursor-pointer"
            >
              <div className="w-full h-9 px-3 bg-[#f0f3fa] rounded-full flex items-center gap-2 transition-colors hover:bg-[#e0e3eb]">
                <span className="material-symbols-outlined text-[#6a6d78] text-[18px]">search</span>
                <span className="w-full bg-transparent text-xs text-[#6a6d78] select-none font-medium">
                  Search (Ctrl+K)
                </span>
                <span className="text-[11px] font-semibold text-[#8a8d98] bg-white px-1.5 py-0.5 rounded shadow-2xs border border-[#e0e3eb]/50">
                  Ctrl+K
                </span>
              </div>
            </div>

            {/* Primary Nav Links */}
            <nav className="hidden xl:flex items-center gap-6 h-16 text-sm font-semibold">
              <a href="#" className="h-full flex items-center text-[#434656] hover:text-[#171b26] transition-colors">
                Products
              </a>
              <a href="#" className="h-full flex items-center text-[#434656] hover:text-[#171b26] transition-colors">
                Community
              </a>
              <a 
                href="#" 
                className="h-full flex items-center text-[#0049db] border-b-2 border-[#0049db] font-bold"
              >
                Markets
              </a>
              <a href="#" className="h-full flex items-center text-[#434656] hover:text-[#171b26] transition-colors">
                Brokers
              </a>
              <a href="#" className="h-full flex items-center text-[#434656] hover:text-[#171b26] transition-colors">
                More
              </a>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Live Feed Ticker Toggle */}
            <button
              onClick={onToggleLiveSimulation}
              title="Toggle live price update ticker simulation"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                liveSimulation 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'bg-[#f0f3fa] border-[#e0e3eb] text-[#6a6d78]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${liveSimulation ? 'bg-[#089981] animate-pulse' : 'bg-[#8a8d98]'}`} />
              <span>{liveSimulation ? 'Live Feed ON' : 'Paused'}</span>
            </button>

            {/* Language */}
            <button 
              type="button" 
              className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-[#f0f3fa] transition-colors text-[#6a6d78] hover:text-[#131722]"
            >
              <span className="material-symbols-outlined text-[18px]">language</span>
              <span className="text-xs font-semibold">EN</span>
            </button>

            {/* Get started button */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#2962ff] hover:bg-[#0049db] text-white text-xs font-bold transition-all shadow-xs"
            >
              {user ? user.name : 'Get started'}
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={onOpenAuth}
              className="w-8 h-8 rounded-full bg-[#0049db] text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition-opacity"
            >
              {user ? (
                user.name[0].toUpperCase()
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Market Category Navigation */}
        <div className="h-12 flex items-center overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-1.5 py-1 min-w-max">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleNavClick(cat.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2c303c] text-white shadow-xs'
                      : 'bg-[#f0f3fa] text-[#434656] hover:bg-[#e0e3eb] hover:text-[#171b26]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
