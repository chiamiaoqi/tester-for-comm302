import React, { useState } from 'react';

interface YieldCurveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YieldCurveModal: React.FC<YieldCurveModalProps> = ({ isOpen, onClose }) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<'current' | '1mo_ago' | '1yr_ago'>('current');

  if (!isOpen) return null;

  const maturities = ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '20Y', '30Y'];
  const currentYields = [5.38, 5.32, 5.10, 4.499, 4.924, 4.880, 5.068, 5.150, 5.232, 5.600, 5.534];
  const lastMonthYields = [5.45, 5.40, 5.25, 4.750, 5.050, 4.980, 5.120, 5.220, 5.310, 5.650, 5.610];
  const lastYearYields = [5.55, 5.50, 5.45, 5.300, 5.100, 4.800, 4.450, 4.380, 4.250, 4.550, 4.420];

  const activeYields = selectedBenchmark === 'current' 
    ? currentYields 
    : selectedBenchmark === '1mo_ago' 
      ? lastMonthYields 
      : lastYearYields;

  const minYield = 4.0;
  const maxYield = 6.0;
  const svgWidth = 650;
  const svgHeight = 220;

  const points = activeYields.map((y, i) => {
    const x = (i / (maturities.length - 1)) * svgWidth;
    const yCoord = svgHeight - ((y - minYield) / (maxYield - minYield)) * svgHeight;
    return { x, y: yCoord, yield: y, label: maturities[i] };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  // 10Y minus 2Y spread
  const spread2s10s = (currentYields[8] - currentYields[4]).toFixed(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e3eb] bg-[#faf8ff]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0049db] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">show_chart</span>
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#131722]">US Treasury Yield Curve</h2>
              <p className="text-xs text-[#6a6d78]">Government bond maturity term structure & spread analysis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f0f3fa] text-[#6a6d78] hover:text-[#131722]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6">
          {/* Controls & Spread info */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center bg-[#f0f3fa] p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setSelectedBenchmark('current')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedBenchmark === 'current' ? 'bg-white text-[#131722] shadow-xs' : 'text-[#6a6d78]'
                }`}
              >
                Current Yields
              </button>
              <button
                onClick={() => setSelectedBenchmark('1mo_ago')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedBenchmark === '1mo_ago' ? 'bg-white text-[#131722] shadow-xs' : 'text-[#6a6d78]'
                }`}
              >
                1 Month Ago
              </button>
              <button
                onClick={() => setSelectedBenchmark('1yr_ago')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedBenchmark === '1yr_ago' ? 'bg-white text-[#131722] shadow-xs' : 'text-[#6a6d78]'
                }`}
              >
                1 Year Ago
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="p-2 bg-[#f0f3fa] rounded-lg">
                <span className="text-[#6a6d78]">2Y / 10Y Spread: </span>
                <span className="font-mono font-bold text-[#089981]">
                  {Number(spread2s10s) > 0 ? `+${spread2s10s}%` : `${spread2s10s}%`}
                </span>
                <span className="text-[#6a6d78] ml-1">(Normalizing)</span>
              </div>
            </div>
          </div>

          {/* SVG Yield Curve Graph */}
          <div className="w-full bg-[#faf8ff] p-4 rounded-xl border border-[#e0e3eb] relative">
            <div className="flex items-center justify-between text-[11px] text-[#8a8d98] mb-2 font-mono">
              <span>6.0%</span>
              <span>Yield Curve Term Structure</span>
              <span>4.0%</span>
            </div>

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 overflow-visible">
              {/* Reference Grid */}
              <line x1="0" y1="0" x2={svgWidth} y2="0" stroke="#e0e3eb" strokeDasharray="3 3" />
              <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#e0e3eb" strokeDasharray="3 3" />
              <line x1="0" y1={svgHeight} x2={svgWidth} y2={svgHeight} stroke="#e0e3eb" />

              {/* Curve Line */}
              <polyline
                fill="none"
                stroke="#0049db"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#0049db" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    className="font-mono text-[10px] font-bold fill-[#131722]"
                  >
                    {p.yield.toFixed(2)}%
                  </text>
                  <text
                    x={p.x}
                    y={svgHeight + 16}
                    textAnchor="middle"
                    className="font-mono text-[11px] font-semibold fill-[#6a6d78]"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
            <div className="h-6" />
          </div>

          {/* Tenor table */}
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
            {points.slice(3, 9).map((p, i) => (
              <div key={i} className="p-2 bg-white rounded-lg border border-[#e0e3eb]">
                <div className="font-semibold text-[#6a6d78]">{p.label}</div>
                <div className="font-mono font-bold text-[#131722] mt-0.5">{p.yield.toFixed(3)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
