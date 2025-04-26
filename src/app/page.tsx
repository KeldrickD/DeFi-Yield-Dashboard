'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { YieldCard } from '@/components/YieldCard';
import Header from '@/components/Header';
import { 
  getYieldOpportunities, 
  getPlatforms, 
  getCurrentUser 
} from '@/lib/api';
import { 
  YieldOpportunity, 
  Platform, 
  User 
} from '@/lib/types';

export default function HomePage() {
  const [opportunities, setOpportunities] = useState<YieldOpportunity[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [oppsData, platformsData, userData] = await Promise.all([
          getYieldOpportunities(user?.subscriptionLevel || 'free'),
          getPlatforms(),
          getCurrentUser()
        ]);
        
        setOpportunities(oppsData);
        setPlatforms(platformsData);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.subscriptionLevel]);

  // Find platform for a given opportunity
  const getPlatform = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || {
      id: 'unknown',
      name: 'Unknown',
      logo: '',
      url: '#'
    };
  };

  // Filter opportunities based on active tab
  const filteredOpportunities = opportunities.filter(opp => {
    if (activeTab === 'all') return true;
    if (activeTab === 'stablecoins') return opp.tags.includes('stablecoin');
    if (activeTab === 'volatile') return opp.tags.includes('volatile');
    if (activeTab === 'premium') return opp.isPremium;
    if (activeTab === 'saved') return user?.savedOpportunities.includes(opp.id);
    return true;
  });

  // Sort opportunities by APY (highest first)
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => b.apy - a.apy);

  // Top 3 APY opportunities
  const topOpportunities = sortedOpportunities.slice(0, 3);

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-lg">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6">Top Yielding Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topOpportunities.map(opportunity => (
              <YieldCard
                key={opportunity.id}
                opportunity={opportunity}
                platform={getPlatform(opportunity.platformId)}
                user={user}
                onSave={handleUpdateUser}
                showDetailedView={false}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">All Opportunities</h2>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="stablecoins">Stablecoins</TabsTrigger>
              <TabsTrigger value="volatile">Volatile</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedOpportunities.length > 0 ? (
                  sortedOpportunities.map(opportunity => (
                    <YieldCard
                      key={opportunity.id}
                      opportunity={opportunity}
                      platform={getPlatform(opportunity.platformId)}
                      user={user}
                      onSave={handleUpdateUser}
                      showDetailedView={false}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center">
                    <p className="text-muted-foreground">No opportunities found in this category.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
