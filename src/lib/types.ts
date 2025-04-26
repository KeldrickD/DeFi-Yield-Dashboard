export interface Platform {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface YieldOpportunity {
  id: string;
  platformId: string;
  name: string;
  asset: string;
  apy: number;
  tvl: number; // Total Value Locked in USD
  riskLevel: 'low' | 'medium' | 'high';
  isPremium: boolean; // If true, only premium users can see details
  tags: string[];
  description: string;
  lastUpdated: string; // ISO date string
}

export interface HistoricalYieldData {
  date: string; // ISO date string
  apy: number;
}

export interface User {
  id: string;
  email: string;
  subscriptionLevel: 'free' | 'premium';
  subscriptionEndDate?: string; // ISO date string
  savedOpportunities: string[]; // YieldOpportunity IDs
} 