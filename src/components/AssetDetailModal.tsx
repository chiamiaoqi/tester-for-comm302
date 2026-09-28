import React, { useState, useMemo } from 'react';
import { MarketAsset } from '../types';

interface AssetDetailModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  watchlist,
  onToggleWatchlist
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');
  const [chartType, setChartType] = useState<'line' | 'candles'>('line');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  // Generate deterministic chart data based on asset and timeframe
  const chartData = useMemo(() => {
    if (!asset) return [];
    const basePrice = asset.price;
    const count = timeframe === '1D' ? 24 : timeframe === '5D' ? 30 : 40;
    const points: { time: string; open: number; high: number; low: number; close: number }[] = [];
    
    // Seed variation
    let current = basePrice * (1 - (asset.changePercent / 100));
    const stepVolatility = basePrice * 0.008;

    for (let i = 0; i < count; i++) {
      const delta = (Math.sin(i * 0.5 + asset.symbol.length) * 0.7 + (Math.random() - 0.48) * 0.8) * stepVolatility;
      const open = current;
      current = Math.max(1, current + delta);
      const close = i === count - 1 ? asset.price : current;
      const high = Math.max(open, close) + Math.random() * (stepVolatility * 0.5);
      const low = Math.min(open, close) - Math.random() * (stepVolatility * 0.5);
      
      const timeLabel = timeframe === '1D' 
        ? `${String(9 + Math.floor((i * 7) / count)).padStart(2, '0')}:${String((i * 25) % 60).padStart(2, '0')}`
        : `Point ${i + 1}`;

      points.push({
        time: timeLabel,
        open,
        high,
        low,
        close
      });
    }
    return points;
  }, [asset, timeframe]);

  if (!asset) return null;

  const isPositive = asset.changePercent >= 0;
  const isWatchlisted = watchlist.includes(asset.symbol);

  // Calculate SVG coordinates
  const minVal = Math.min(...chartData.map((d) => d.low));
  const maxVal = Math.max(...chartData.map((d) => d.high));
  const range = maxVal - minVal || 1;
  const chartWidth = 720;
  const chartHeight = 280;

  const pointsSvg = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - ((d.close - minVal) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const activePoint = hoverIndex !== null ? chartData[hoverIndex] : chartData[chartData.length - 1];
  const activePrice = activePoint?.close ?? asset.price;

  const handleOrder = (type: 'BUY' | 'SELL') => {
    setOrderNotification(`${type} order placed for 10 units of ${asset.symbol} @ $${asset.price.toFixed(2)}`);
    setTimeout(() => setOrderNotification(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e3eb] bg-[#faf8ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2962ff] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {asset.flag || asset.badge || asset.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl text-[#131722]">{asset.symbol}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#dfe2f2] text-[#171b26]">
                  {asset.exchange || asset.category}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#089981] animate-ping" />
              </div>
              <p className="text-xs text-[#6a6d78] font-medium">{asset.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(asset.symbol)}
              className={`p-2 rounded-full border transition-colors ${
                isWatchlisted
                  ? 'bg-amber-50 border-amber-300 text-amber-500'
                  : 'border-[#e0e3eb] text-[#6a6d78] hover:bg-[#f0f3fa] hover:text-[#131722]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isWatchlisted ? 'star' : 'star_border'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#f0f3fa] text-[#6a6d78] hover:text-[#131722] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Price & Change Banner */}
        <div className="px-6 py-4 flex flex-wrap items-end justify-between gap-4 border-b border-[#f0f3fa]">
          <div>
            <div className="font-mono text-3xl font-extrabold text-[#131722] tabular-figures">
              {activePrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-sm font-bold flex items-center gap-0.5 ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                </span>
                {isPositive ? '+' : ''}
                {asset.change.toFixed(2)} ({isPositive ? '+' : ''}
                {asset.changePercent.toFixed(2)}%)
              </span>
              <span className="text-xs text-[#8a8d98]">Realtime • Currency in USD</span>
            </div>
          </div>

          {/* Timeframe & Chart Style selectors */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#f0f3fa] p-1 rounded-lg">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    timeframe === tf
                      ? 'bg-white text-[#131722] shadow-xs'
                      : 'text-[#6a6d78] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-[#f0f3fa] p-1 rounded-lg">
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 rounded-md transition-all ${
                  chartType === 'line'
                    ? 'bg-white text-[#0049db] shadow-xs'
                    : 'text-[#6a6d78] hover:text-[#131722]'
                }`}
                title="Line Chart"
              >
                <span className="material-symbols-outlined text-[18px]">show_chart</span>
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`p-1.5 rounded-md transition-all ${
                  chartType === 'candles'
                    ? 'bg-white text-[#0049db] shadow-xs'
                    : 'text-[#6a6d78] hover:text-[#131722]'
                }`}
                title="Candlestick Chart"
              >
                <span className="material-symbols-outlined text-[18px]">bar_chart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Notification Banner */}
        {orderNotification && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span>✓ {orderNotification}</span>
            <button onClick={() => setOrderNotification(null)} className="hover:underline">Dismiss</button>
          </div>
        )}

        {/* Chart Viewport */}
        <div 
          className="relative px-6 py-4 bg-[#ffffff] select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <div className="w-full h-[280px] relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-[#737687]" />
              <div className="border-b border-[#737687]" />
              <div className="border-b border-[#737687]" />
              <div className="border-b border-[#737687]" />
            </div>

            {chartType === 'line' ? (
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,${chartHeight} ${pointsSvg} ${chartWidth},${chartHeight}`}
                  fill="url(#chartGradient)"
                />
                <polyline
                  fill="none"
                  stroke={isPositive ? '#089981' : '#f23645'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsSvg}
                />
                {hoverIndex !== null && (
                  <circle
                    cx={(hoverIndex / (chartData.length - 1)) * chartWidth}
                    cy={chartHeight - ((chartData[hoverIndex].close - minVal) / range) * chartHeight}
                    r="5"
                    fill={isPositive ? '#089981' : '#f23645'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                )}
              </svg>
            ) : (
              // Candlesticks
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                {chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * chartWidth;
                  const candleUp = d.close >= d.open;
                  const color = candleUp ? '#089981' : '#f23645';
                  const yHigh = chartHeight - ((d.high - minVal) / range) * chartHeight;
                  const yLow = chartHeight - ((d.low - minVal) / range) * chartHeight;
                  const yTop = chartHeight - ((Math.max(d.open, d.close) - minVal) / range) * chartHeight;
                  const yBottom = chartHeight - ((Math.min(d.open, d.close) - minVal) / range) * chartHeight;
                  const height = Math.max(2, yBottom - yTop);

                  return (
                    <g key={i}>
                      {/* High-Low Wick */}
                      <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.2" />
                      {/* Candle Body */}
                      <rect
                        x={x - 4}
                        y={yTop}
                        width="8"
                        height={height}
                        fill={color}
                        rx="1"
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Mouse tracking overlay */}
            <div 
              className="absolute inset-0 cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, x / rect.width));
                const index = Math.round(ratio * (chartData.length - 1));
                setHoverIndex(index);
              }}
            />

            {/* Hover Tooltip */}
            {hoverIndex !== null && chartData[hoverIndex] && (
              <div 
                className="absolute pointer-events-none bg-[#171b26] text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg"
                style={{
                  left: `${(hoverIndex / (chartData.length - 1)) * 90}%`,
                  top: '10%'
                }}
              >
                <div className="font-mono font-bold text-sm">${chartData[hoverIndex].close.toFixed(2)}</div>
                <div className="text-[10px] text-[#c3c5d8]">{chartData[hoverIndex].time}</div>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Stats Grid */}
        <div className="p-6 bg-[#faf8ff] border-t border-[#e0e3eb] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#e0e3eb]">
            <span className="text-[#6a6d78] block">24h Range</span>
            <span className="font-mono font-bold text-[#131722] mt-1 block">
              ${(asset.low24h || asset.price * 0.98).toFixed(2)} - ${(asset.high24h || asset.price * 1.02).toFixed(2)}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#e0e3eb]">
            <span className="text-[#6a6d78] block">Volume (24h)</span>
            <span className="font-mono font-bold text-[#131722] mt-1 block">
              {asset.volume || '42.8M shares'}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#e0e3eb]">
            <span className="text-[#6a6d78] block">Market Cap / Total</span>
            <span className="font-mono font-bold text-[#131722] mt-1 block">
              {asset.marketCap || '$1.25 TUSD'}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#e0e3eb]">
            <span className="text-[#6a6d78] block">P/E Ratio</span>
            <span className="font-mono font-bold text-[#131722] mt-1 block">
              {asset.peRatio || '32.4x'}
            </span>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="px-6 py-4 bg-white border-t border-[#e0e3eb] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOrder('BUY')}
              className="px-5 py-2 rounded-full bg-[#089981] hover:bg-[#077d69] text-white font-bold text-xs shadow-sm transition-all"
            >
              Quick Buy
            </button>
            <button
              onClick={() => handleOrder('SELL')}
              className="px-5 py-2 rounded-full bg-[#f23645] hover:bg-[#d42533] text-white font-bold text-xs shadow-sm transition-all"
            >
              Quick Sell
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setOrderNotification(`Alert set for ${asset.symbol} when price moves ±2%`);
                setTimeout(() => setOrderNotification(null), 3500);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e0e3eb] text-xs font-semibold text-[#131722] hover:bg-[#f0f3fa] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              Set Alert
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#f0f3fa] hover:bg-[#e0e3eb] text-xs font-semibold text-[#6a6d78] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
