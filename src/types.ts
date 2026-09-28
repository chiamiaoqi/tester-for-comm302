export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  exchange?: string;
  category: 'index' | 'stock' | 'crypto' | 'commodity' | 'bond';
  price: number;
  change: number;
  changePercent: number;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  flag?: string;
  volume?: string;
  marketCap?: string;
  sparkline?: number[];
  high24h?: number;
  low24h?: number;
  peRatio?: string;
  divYield?: string;
  description?: string;
}

export interface EarningEvent {
  id: string;
  company: string;
  symbol: string;
  session: 'Pre-market' | 'Post-market' | 'Upcoming IPO';
  estimate: string;
  actual: string;
  statusBadge?: string;
  period?: string;
}

export interface EmployerData {
  rank: number;
  company: string;
  ticker: string;
  sector: string;
  country: string;
  employees: string;
}

export interface BondYield {
  code: string;
  yield: string;
  changePercent: string;
  tenor: string;
  isNegative: boolean;
}
