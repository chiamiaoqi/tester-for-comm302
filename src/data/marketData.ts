import { MarketAsset, EarningEvent, EmployerData, BondYield } from '../types';

export const PRIMARY_INDICES: MarketAsset[] = [
  {
    id: 'sp500',
    name: 'S&P 500',
    symbol: 'SPX',
    exchange: 'S&P Dow Jones',
    category: 'index',
    price: 5864.67,
    change: 24.52,
    changePercent: 0.42,
    badge: '500',
    badgeBg: 'bg-[#D32F2F]',
    badgeText: 'text-white',
    sparkline: [5840, 5845, 5842, 5855, 5852, 5864.67],
    high24h: 5871.20,
    low24h: 5838.10,
    marketCap: '48.2 TUSD',
    description: 'Standard and Poor\'s 500 is a stock market index tracking the stock performance of 500 of the largest companies listed on stock exchanges in the United States.'
  },
  {
    id: 'ndx',
    name: 'Nasdaq 100',
    symbol: 'NDX',
    exchange: 'NASDAQ',
    category: 'index',
    price: 20432.18,
    change: 132.80,
    changePercent: 0.65,
    badge: '100',
    badgeBg: 'bg-[#00A3E0]',
    badgeText: 'text-white',
    sparkline: [20300, 20340, 20380, 20410, 20400, 20432.18],
    high24h: 20480.00,
    low24h: 20285.40,
    marketCap: '24.1 TUSD',
    description: 'Index composed of 100 of the largest non-financial companies listed on the Nasdaq Stock Market.'
  },
  {
    id: 'dji',
    name: 'Dow 30',
    symbol: 'DJI',
    exchange: 'DJIA',
    category: 'index',
    price: 43820.50,
    change: 65.20,
    changePercent: 0.15,
    badge: '30',
    badgeBg: 'bg-[#2962ff]',
    badgeText: 'text-white',
    sparkline: [43755, 43760, 43790, 43805, 43810, 43820.50],
    high24h: 43890.10,
    low24h: 43710.00,
    marketCap: '16.5 TUSD',
    description: 'The Dow Jones Industrial Average is a price-weighted stock market index of 30 prominent companies listed on stock exchanges in the United States.'
  },
  {
    id: 'rut',
    name: 'US 2000',
    symbol: 'RUT',
    exchange: 'Russell',
    category: 'index',
    price: 2245.10,
    change: -4.90,
    changePercent: -0.22,
    badge: '2K',
    badgeBg: 'bg-[#dfe2f2]',
    badgeText: 'text-[#171b26]',
    sparkline: [2250, 2248, 2242, 2246, 2243, 2245.10],
    high24h: 2256.00,
    low24h: 2239.50,
    marketCap: '3.4 TUSD',
    description: 'The Russell 2000 Index is a small-cap stock market index of the bottom 2,000 stocks in the Russell 3000 Index.'
  },
  {
    id: 'ixic',
    name: 'Nasdaq Comp',
    symbol: 'IXIC',
    exchange: 'NASDAQ',
    category: 'index',
    price: 18518.61,
    change: 103.14,
    changePercent: 0.56,
    badge: 'IX',
    badgeBg: 'bg-[#dfe2f2]',
    badgeText: 'text-[#171b26]',
    sparkline: [18415, 18450, 18480, 18500, 18490, 18518.61],
    high24h: 18550.20,
    low24h: 18395.00,
    marketCap: '28.2 TUSD',
    description: 'The Nasdaq Composite is a stock market index that includes almost all stocks listed on the Nasdaq stock exchange.'
  },
  {
    id: 'nya',
    name: 'NYSE Comp',
    symbol: 'NYA',
    exchange: 'NYSE',
    category: 'index',
    price: 19842.30,
    change: 42.10,
    changePercent: 0.21,
    badge: 'NY',
    badgeBg: 'bg-[#dfe2f2]',
    badgeText: 'text-[#171b26]',
    sparkline: [19800, 19810, 19830, 19825, 19835, 19842.30],
    high24h: 19890.00,
    low24h: 19780.00,
    marketCap: '31.5 TUSD',
    description: 'The NYSE Composite Index measures the performance of all common stocks listed on the New York Stock Exchange.'
  }
];

export const WORLD_INDICES: MarketAsset[] = [
  {
    id: 'japan225',
    name: 'Japan 225',
    symbol: 'NI225',
    exchange: 'Nikkei',
    category: 'index',
    price: 38642.50,
    change: 322.10,
    changePercent: 0.84,
    flag: '🇯🇵'
  },
  {
    id: 'ftse100',
    name: 'FTSE 100',
    symbol: 'UKX',
    exchange: 'LSE',
    category: 'index',
    price: 8245.10,
    change: 9.80,
    changePercent: 0.12,
    flag: '🇬🇧'
  },
  {
    id: 'dax',
    name: 'DAX Index',
    symbol: 'DAX',
    exchange: 'XETRA',
    category: 'index',
    price: 19340.20,
    change: 105.80,
    changePercent: 0.55,
    flag: '🇩🇪'
  },
  {
    id: 'cac40',
    name: 'CAC 40',
    symbol: 'PX1',
    exchange: 'Euronext',
    category: 'index',
    price: 7520.10,
    change: -13.50,
    changePercent: -0.18,
    flag: '🇫🇷'
  },
  {
    id: 'milanomib',
    name: 'Milano MIB',
    symbol: 'FTMIB',
    exchange: 'Borsa Italiana',
    category: 'index',
    price: 34710.80,
    change: 131.20,
    changePercent: 0.38,
    flag: '🇮🇹'
  },
  {
    id: 'hangseng',
    name: 'Hang Seng',
    symbol: 'HSI',
    exchange: 'HKEX',
    category: 'index',
    price: 20538.15,
    change: 271.40,
    changePercent: 1.34,
    flag: '🇭🇰'
  },
  {
    id: 'nifty50',
    name: 'Nifty 50',
    symbol: 'NIFTY',
    exchange: 'NSE',
    category: 'index',
    price: 24781.10,
    change: 152.30,
    changePercent: 0.62,
    flag: '🇮🇳'
  },
  {
    id: 'sse',
    name: 'SSE Composite',
    symbol: '000001',
    exchange: 'Shanghai',
    category: 'index',
    price: 3299.70,
    change: -13.60,
    changePercent: -0.41,
    flag: '🇨🇳'
  }
];

export const BIG_TECH_STOCKS: MarketAsset[] = [
  {
    id: 'nvda',
    name: 'NVIDIA Corp',
    symbol: 'NVDA',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 142.50,
    change: 4.31,
    changePercent: 3.12,
    badge: 'NV',
    volume: '72.8M',
    marketCap: '5.42 TUSD',
    peRatio: '52.4',
    divYield: '0.03%'
  },
  {
    id: 'aapl',
    name: 'Apple Inc',
    symbol: 'AAPL',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 231.40,
    change: 1.95,
    changePercent: 0.85,
    badge: 'AP',
    volume: '54.2M',
    marketCap: '4.98 TUSD',
    peRatio: '34.8',
    divYield: '0.44%'
  },
  {
    id: 'msft',
    name: 'Microsoft Corp',
    symbol: 'MSFT',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 428.15,
    change: 1.70,
    changePercent: 0.40,
    badge: 'MS',
    volume: '22.1M',
    marketCap: '3.83 TUSD',
    peRatio: '36.2',
    divYield: '0.75%'
  },
  {
    id: 'amzn',
    name: 'Amazon.com',
    symbol: 'AMZN',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 194.20,
    change: 2.21,
    changePercent: 1.15,
    badge: 'AZ',
    volume: '41.6M',
    marketCap: '2.03 TUSD',
    peRatio: '43.1',
    divYield: 'N/A'
  },
  {
    id: 'googl',
    name: 'Alphabet Inc',
    symbol: 'GOOGL',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 182.60,
    change: -0.64,
    changePercent: -0.35,
    badge: 'GO',
    volume: '28.3M',
    marketCap: '4.19 TUSD',
    peRatio: '24.9',
    divYield: '0.44%'
  },
  {
    id: 'tsla',
    name: 'Tesla Inc',
    symbol: 'TSLA',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 260.40,
    change: 11.90,
    changePercent: 4.80,
    badge: 'TS',
    volume: '65.1M',
    marketCap: '828.4 BUSD',
    peRatio: '68.5',
    divYield: 'N/A'
  }
];

export const HIGHEST_VOLUME_STOCKS: MarketAsset[] = [
  {
    id: 'mu',
    name: 'Micron Tech',
    symbol: 'MU',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 108.92,
    change: 6.60,
    changePercent: 6.45,
    volume: '84.2M',
    badge: 'MU'
  },
  {
    id: 'nvda_vol',
    name: 'NVIDIA Corp',
    symbol: 'NVDA',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 142.50,
    change: 4.31,
    changePercent: 3.12,
    volume: '72.8M',
    badge: 'NV'
  },
  {
    id: 'tsla_vol',
    name: 'Tesla, Inc.',
    symbol: 'TSLA',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 260.40,
    change: 11.90,
    changePercent: 4.80,
    volume: '65.1M',
    badge: 'TS'
  },
  {
    id: 'meta_vol',
    name: 'Meta Platforms',
    symbol: 'META',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 592.10,
    change: 11.05,
    changePercent: 1.90,
    volume: '38.6M',
    badge: 'ME'
  },
  {
    id: 'sndk_vol',
    name: 'Sandisk Corp',
    symbol: 'SNDK',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 78.30,
    change: -0.95,
    changePercent: -1.20,
    volume: '29.4M',
    badge: 'SN'
  }
];

export const STOCK_GAINERS_REGULAR: MarketAsset[] = [
  {
    id: 'axg',
    name: 'Solowin Hldgs',
    symbol: 'AXG',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 14.85,
    change: 4.83,
    changePercent: 48.20,
    badge: 'AX'
  },
  {
    id: 'msgy',
    name: 'Masonglory Ltd',
    symbol: 'MSGY',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 3.40,
    change: 0.88,
    changePercent: 35.15,
    badge: 'MS'
  },
  {
    id: 'wyy',
    name: 'WidePoint Corp',
    symbol: 'WYY',
    exchange: 'AMEX',
    category: 'stock',
    price: 4.12,
    change: 0.92,
    changePercent: 28.60,
    badge: 'WY'
  },
  {
    id: 'tdic',
    name: 'Dreamland Ltd',
    symbol: 'TDIC',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 8.75,
    change: 1.60,
    changePercent: 22.40,
    badge: 'TD'
  },
  {
    id: 'gipr',
    name: 'Gen Income Prop',
    symbol: 'GIPR',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 2.18,
    change: 0.36,
    changePercent: 19.80,
    badge: 'GI'
  }
];

export const STOCK_GAINERS_PRE: MarketAsset[] = [
  {
    id: 'holo',
    name: 'MicroCloud Holo',
    symbol: 'HOLO',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 6.42,
    change: 2.20,
    changePercent: 52.10,
    badge: 'MC'
  },
  {
    id: 'shot',
    name: 'Safety Shot Inc',
    symbol: 'SHOT',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 2.89,
    change: 0.80,
    changePercent: 38.40,
    badge: 'SS'
  },
  {
    id: 'envb',
    name: 'Enveric Bio',
    symbol: 'ENVB',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 1.45,
    change: 0.34,
    changePercent: 31.20,
    badge: 'EB'
  },
  {
    id: 'ffie',
    name: 'Faraday Future',
    symbol: 'FFIE',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 4.20,
    change: 0.86,
    changePercent: 25.80,
    badge: 'FF'
  },
  {
    id: 'vld',
    name: 'Velo3D Inc',
    symbol: 'VLD',
    exchange: 'NYSE',
    category: 'stock',
    price: 0.78,
    change: 0.14,
    changePercent: 21.15,
    badge: 'VL'
  }
];

export const STOCK_LOSERS_REGULAR: MarketAsset[] = [
  {
    id: 'ifbd',
    name: 'Infobird Co',
    symbol: 'IFBD',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 0.82,
    change: -0.26,
    changePercent: -24.30,
    badge: 'IF'
  },
  {
    id: 'kndi',
    name: 'Kandi Tech',
    symbol: 'KNDI',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 1.75,
    change: -0.39,
    changePercent: -18.15,
    badge: 'KN'
  },
  {
    id: 'ncpl',
    name: 'Netcapital Inc',
    symbol: 'NCPL',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 0.45,
    change: -0.08,
    changePercent: -14.70,
    badge: 'NC'
  },
  {
    id: 'vivo',
    name: 'VivoPower PLC',
    symbol: 'VIVO',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 1.22,
    change: -0.18,
    changePercent: -12.80,
    badge: 'VV'
  },
  {
    id: 'btoc',
    name: 'Armlogi Hldg',
    symbol: 'BTOC',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 3.15,
    change: -0.40,
    changePercent: -11.20,
    badge: 'BT'
  }
];

export const STOCK_LOSERS_PRE: MarketAsset[] = [
  {
    id: 'muln',
    name: 'Mullen Auto',
    symbol: 'MULN',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 0.32,
    change: -0.13,
    changePercent: -29.40,
    badge: 'ML'
  },
  {
    id: 'bivi',
    name: 'BioVie Inc',
    symbol: 'BIVI',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 1.05,
    change: -0.30,
    changePercent: -22.10,
    badge: 'BV'
  },
  {
    id: 'nuwe',
    name: 'Nuwellis Inc',
    symbol: 'NUWE',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 2.15,
    change: -0.43,
    changePercent: -16.80,
    badge: 'NW'
  },
  {
    id: 'agri',
    name: 'AgriFORCE Grow',
    symbol: 'AGRI',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 0.49,
    change: -0.09,
    changePercent: -15.20,
    badge: 'AF'
  },
  {
    id: 'op',
    name: 'OceanPal Inc',
    symbol: 'OP',
    exchange: 'NASDAQ',
    category: 'stock',
    price: 1.88,
    change: -0.29,
    changePercent: -13.50,
    badge: 'OP'
  }
];

export const EARNINGS_CALENDAR: EarningEvent[] = [
  {
    id: 'tayd',
    company: 'Taylor Devices',
    symbol: 'TAYD',
    session: 'Post-market',
    estimate: '0.92',
    actual: '—'
  },
  {
    id: 'mtn',
    company: 'Vail Resorts',
    symbol: 'MTN',
    session: 'Post-market',
    estimate: '-5.35',
    actual: '—'
  },
  {
    id: 'trak',
    company: 'ReposiTrak Inc',
    symbol: 'TRAK',
    session: 'Pre-market',
    estimate: '0.09',
    actual: '0.11'
  },
  {
    id: 'ntwk',
    company: 'NETSOL Tech',
    symbol: 'NTWK',
    session: 'Pre-market',
    estimate: '0.02',
    actual: '—'
  },
  {
    id: 'crwv',
    company: 'CoreWeave',
    symbol: 'CRWV',
    session: 'Upcoming IPO',
    estimate: '—',
    actual: '—',
    statusBadge: 'S-1 Filed',
    period: 'Q4 2024'
  }
];

export const BIGGEST_COMPANIES: MarketAsset[] = [
  {
    id: 'bc_nvda',
    name: 'NVIDIA Corporation',
    symbol: 'NVDA',
    exchange: 'US',
    category: 'stock',
    price: 142.50,
    change: 4.31,
    changePercent: 3.12,
    marketCap: '5.42 TUSD'
  },
  {
    id: 'bc_aapl',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    exchange: 'US',
    category: 'stock',
    price: 231.40,
    change: 1.95,
    changePercent: 0.85,
    marketCap: '4.98 TUSD'
  },
  {
    id: 'bc_googl',
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    exchange: 'US',
    category: 'stock',
    price: 182.60,
    change: -0.64,
    changePercent: -0.35,
    marketCap: '4.19 TUSD'
  },
  {
    id: 'bc_msft',
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    exchange: 'US',
    category: 'stock',
    price: 428.15,
    change: 1.70,
    changePercent: 0.40,
    marketCap: '3.83 TUSD'
  },
  {
    id: 'bc_tsmc',
    name: 'TSMC',
    symbol: '2330',
    exchange: 'TW',
    category: 'stock',
    price: 198.50,
    change: 3.80,
    changePercent: 1.95,
    marketCap: '2.02 TUSD'
  }
];

export const LARGEST_EMPLOYERS: EmployerData[] = [
  {
    rank: 1,
    company: 'Walmart Inc.',
    ticker: 'WMT',
    sector: 'Retail',
    country: 'United States',
    employees: '2.1 M'
  },
  {
    rank: 2,
    company: 'Amazon.com, Inc.',
    ticker: 'AMZN',
    sector: 'E-commerce',
    country: 'United States',
    employees: '1.6 M'
  },
  {
    rank: 3,
    company: 'BYD Company Class A',
    ticker: '002594',
    sector: 'Automotive',
    country: 'China',
    employees: '869.6 K'
  },
  {
    rank: 4,
    company: 'Accenture plc',
    ticker: 'ACN',
    sector: 'Professional Svcs',
    country: 'Ireland',
    employees: '779.0 K'
  },
  {
    rank: 5,
    company: 'JD.com, Inc.',
    ticker: 'JD',
    sector: 'Tech & Logistics',
    country: 'China',
    employees: '776.7 K'
  }
];

export const CRYPTO_ASSETS: MarketAsset[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTCUSD',
    category: 'crypto',
    price: 89450.00,
    change: 3315.00,
    changePercent: 3.85,
    badge: '₿',
    badgeBg: 'bg-[#F7931A]',
    badgeText: 'text-white',
    marketCap: '1.67 T Market Cap'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETHUSD',
    category: 'crypto',
    price: 3120.40,
    change: 64.20,
    changePercent: 2.10,
    badge: 'Ξ',
    badgeBg: 'bg-[#627EEA]',
    badgeText: 'text-white',
    marketCap: '324.9 B Market Cap'
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOLUSD',
    category: 'crypto',
    price: 212.80,
    change: 16.50,
    changePercent: 8.40,
    badge: 'SOL',
    badgeBg: 'bg-[#14F195]',
    badgeText: 'text-[#171b26]',
    marketCap: '98.4 B Market Cap'
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNBUSD',
    category: 'crypto',
    price: 648.20,
    change: 7.35,
    changePercent: 1.15,
    badge: 'BNB',
    badgeBg: 'bg-[#F3BA2F]',
    badgeText: 'text-[#171b26]',
    marketCap: '101.54 B Market Cap'
  },
  {
    id: 'xrp',
    name: 'XRP',
    symbol: 'XRPUSD',
    category: 'crypto',
    price: 1.6420,
    change: -0.0124,
    changePercent: -0.75,
    badge: '✕',
    badgeBg: 'bg-[#23292F]',
    badgeText: 'text-white',
    marketCap: '93.43 B Market Cap'
  }
];

export const COMMODITIES_FUTURES: MarketAsset[] = [
  {
    id: 'gold',
    name: 'Gold',
    symbol: 'GC1!',
    exchange: 'COMEX • USD / oz',
    category: 'commodity',
    price: 2684.30,
    change: 19.20,
    changePercent: 0.72,
    badge: 'AU',
    badgeBg: 'bg-[#D4AF37]',
    badgeText: 'text-white'
  },
  {
    id: 'silver',
    name: 'Silver',
    symbol: 'SI1!',
    exchange: 'COMEX • USD / oz',
    category: 'commodity',
    price: 31.42,
    change: 0.38,
    changePercent: 1.24,
    badge: 'AG',
    badgeBg: 'bg-[#dfe2f2]',
    badgeText: 'text-[#171b26]'
  },
  {
    id: 'oil',
    name: 'Light Crude Oil',
    symbol: 'CL1!',
    exchange: 'NYMEX • USD / bbl',
    category: 'commodity',
    price: 70.82,
    change: -0.63,
    changePercent: -0.88,
    badge: 'CL',
    badgeBg: 'bg-[#2c303c]',
    badgeText: 'text-white'
  },
  {
    id: 'natgas',
    name: 'Natural Gas',
    symbol: 'NG1!',
    exchange: 'NYMEX • USD / MMBtu',
    category: 'commodity',
    price: 3.140,
    change: 0.104,
    changePercent: 3.42,
    badge: 'NG',
    badgeBg: 'bg-[#00A3E0]',
    badgeText: 'text-white'
  },
  {
    id: 'emini',
    name: 'E-mini S&P 500',
    symbol: 'ES1!',
    exchange: 'CME • Continuous',
    category: 'commodity',
    price: 5892.25,
    change: 28.15,
    changePercent: 0.48,
    badge: 'ES',
    badgeBg: 'bg-[#2962ff]',
    badgeText: 'text-white'
  }
];

export const GOV_BONDS: BondYield[] = [
  {
    code: 'US01Y',
    yield: '4.499%',
    changePercent: '-0.02%',
    tenor: '1 year yield',
    isNegative: true
  },
  {
    code: 'US02Y',
    yield: '4.924%',
    changePercent: '-0.12%',
    tenor: '2 years yield',
    isNegative: true
  },
  {
    code: 'US05Y',
    yield: '5.068%',
    changePercent: '-0.33%',
    tenor: '5 years yield',
    isNegative: true
  },
  {
    code: 'US10Y',
    yield: '5.232%',
    changePercent: '-0.50%',
    tenor: '10 years yield',
    isNegative: true
  },
  {
    code: 'US20Y',
    yield: '5.600%',
    changePercent: '-0.62%',
    tenor: '20 years yield',
    isNegative: true
  },
  {
    code: 'US30Y',
    yield: '5.534%',
    changePercent: '-0.65%',
    tenor: '30 years yield',
    isNegative: true
  }
];
