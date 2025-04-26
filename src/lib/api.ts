import { Platform, YieldOpportunity, HistoricalYieldData, User } from './types';
import { SUBSCRIPTION_LEVELS } from './utils';

// Mock data - in a real app, this would come from an API
const platforms: Platform[] = [
  {
    id: 'aave',
    name: 'Aave',
    logo: '/platforms/aave.png',
    url: 'https://aave.com'
  },
  {
    id: 'compound',
    name: 'Compound',
    logo: '/platforms/compound.png',
    url: 'https://compound.finance'
  },
  {
    id: 'curve',
    name: 'Curve',
    logo: '/platforms/curve.png',
    url: 'https://curve.fi'
  },
  {
    id: 'yearn',
    name: 'Yearn Finance',
    logo: '/platforms/yearn.png',
    url: 'https://yearn.finance'
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    logo: '/platforms/uniswap.png',
    url: 'https://uniswap.org'
  }
];

const yieldOpportunities: YieldOpportunity[] = [
  {
    id: 'aave-usdc',
    platformId: 'aave',
    name: 'USDC Lending',
    asset: 'USDC',
    apy: 3.25,
    tvl: 842000000,
    riskLevel: 'low',
    isPremium: false,
    tags: ['stablecoin', 'lending'],
    description: 'Lend USDC on Aave and earn interest from borrowers.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'compound-usdt',
    platformId: 'compound',
    name: 'USDT Lending',
    asset: 'USDT',
    apy: 3.42,
    tvl: 723000000,
    riskLevel: 'low',
    isPremium: false,
    tags: ['stablecoin', 'lending'],
    description: 'Lend USDT on Compound and earn interest from borrowers.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'curve-3pool',
    platformId: 'curve',
    name: '3Pool',
    asset: 'DAI/USDC/USDT',
    apy: 4.12,
    tvl: 1250000000,
    riskLevel: 'medium',
    isPremium: false,
    tags: ['stablecoin', 'liquidity'],
    description: 'Provide liquidity to Curve 3Pool and earn trading fees.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'yearn-eth',
    platformId: 'yearn',
    name: 'ETH Vault',
    asset: 'ETH',
    apy: 7.83,
    tvl: 475000000,
    riskLevel: 'medium',
    isPremium: true,
    tags: ['volatile', 'vault'],
    description: 'Deposit ETH to autocompounding Yearn vault for optimized yield strategies.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'uniswap-eth-usdc',
    platformId: 'uniswap',
    name: 'ETH-USDC Pool',
    asset: 'ETH/USDC',
    apy: 11.25,
    tvl: 325000000,
    riskLevel: 'high',
    isPremium: true,
    tags: ['volatile', 'liquidity'],
    description: 'Provide liquidity to ETH-USDC pool on Uniswap and earn trading fees.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'aave-eth',
    platformId: 'aave',
    name: 'ETH Lending',
    asset: 'ETH',
    apy: 2.85,
    tvl: 920000000,
    riskLevel: 'medium',
    isPremium: false,
    tags: ['volatile', 'lending'],
    description: 'Lend ETH on Aave and earn interest from borrowers.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'curve-tricrypto',
    platformId: 'curve',
    name: 'TriCrypto',
    asset: 'USDT/WBTC/ETH',
    apy: 8.75,
    tvl: 535000000,
    riskLevel: 'high',
    isPremium: true,
    tags: ['volatile', 'liquidity'],
    description: 'Provide liquidity to TriCrypto pool on Curve and earn trading fees and CRV rewards.',
    lastUpdated: new Date().toISOString()
  }
];

// Mock user data
const currentUser: User = {
  id: 'user123',
  email: 'demo@example.com',
  subscriptionLevel: 'free',
  savedOpportunities: ['aave-usdc', 'curve-3pool']
};

// Mock API functions
export async function getPlatforms(): Promise<Platform[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return platforms;
}

export async function getYieldOpportunities(subscription: 'free' | 'premium' = 'free'): Promise<YieldOpportunity[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (subscription === SUBSCRIPTION_LEVELS.FREE) {
    // For free users, filter out premium opportunities or mask their details
    return yieldOpportunities.map(opportunity => {
      if (opportunity.isPremium) {
        return {
          ...opportunity,
          description: 'Upgrade to premium to view complete details',
          apy: opportunity.apy, // Show APY even for premium opportunities
          // Mask other sensitive data as needed
        };
      }
      return opportunity;
    });
  }
  
  return yieldOpportunities;
}

export async function getHistoricalYieldData(opportunityId: string): Promise<HistoricalYieldData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Generate mock historical data
  const opportunity = yieldOpportunities.find(o => o.id === opportunityId);
  if (!opportunity) {
    throw new Error('Opportunity not found');
  }
  
  const today = new Date();
  const data: HistoricalYieldData[] = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate a slightly different APY for each day
    const variance = Math.random() * 1.5 - 0.75; // Random variation between -0.75% and +0.75%
    const apy = Math.max(0.1, opportunity.apy + variance);
    
    data.push({
      date: date.toISOString().split('T')[0],
      apy: parseFloat(apy.toFixed(2))
    });
  }
  
  return data;
}

export async function getCurrentUser(): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return currentUser;
}

export async function updateUserSubscription(level: 'free' | 'premium'): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would update the user's subscription in the database
  const updatedUser = { 
    ...currentUser, 
    subscriptionLevel: level,
    subscriptionEndDate: level === 'premium' 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      : undefined
  };
  
  return updatedUser;
}

export async function saveOpportunity(opportunityId: string): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would update the user's saved opportunities in the database
  if (!currentUser.savedOpportunities.includes(opportunityId)) {
    currentUser.savedOpportunities.push(opportunityId);
  }
  
  return currentUser;
}

export async function removeSavedOpportunity(opportunityId: string): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would update the user's saved opportunities in the database
  currentUser.savedOpportunities = currentUser.savedOpportunities.filter(id => id !== opportunityId);
  
  return currentUser;
} 