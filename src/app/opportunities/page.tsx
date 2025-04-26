'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { YieldCard } from '@/components/YieldCard';
import Header from '@/components/Header';
import { getYieldOpportunities, getPlatforms, getCurrentUser } from '@/lib/api';
import { YieldOpportunity, Platform, User } from '@/lib/types';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<YieldOpportunity[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [minApy, setMinApy] = useState<number | null>(null);

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
        console.error('Failed to load opportunities data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.subscriptionLevel]);

  const getPlatform = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || {
      id: 'unknown',
      name: 'Unknown',
      logo: '',
      url: '#'
    };
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const filteredOpportunities = opportunities.filter(opp => {
    // Filter by tab
    if (activeTab === 'stablecoins' && !opp.tags.includes('stablecoin')) return false;
    if (activeTab === 'volatile' && !opp.tags.includes('volatile')) return false;
    if (activeTab === 'lending' && !opp.tags.includes('lending')) return false;
    if (activeTab === 'liquidity' && !opp.tags.includes('liquidity')) return false;
    if (activeTab === 'premium' && !opp.isPremium) return false;
    if (activeTab === 'saved' && !user?.savedOpportunities.includes(opp.id)) return false;

    // Filter by search term
    if (searchTerm && !opp.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !opp.asset.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !getPlatform(opp.platformId).name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by platform
    if (selectedPlatform && opp.platformId !== selectedPlatform) return false;

    // Filter by risk level
    if (selectedRisk && opp.riskLevel !== selectedRisk) return false;

    // Filter by minimum APY
    if (minApy !== null && opp.apy < minApy) return false;

    return true;
  });

  // Sort by APY (highest first)
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => b.apy - a.apy);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedPlatform(null);
    setSelectedRisk(null);
    setMinApy(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-lg">Loading opportunities...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Opportunities</h1>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="stablecoins">Stablecoins</TabsTrigger>
            <TabsTrigger value="volatile">Volatile</TabsTrigger>
            <TabsTrigger value="lending">Lending</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-4">
                  <Input
                    placeholder="Search by name, asset, or platform..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Platform
                  </label>
                  <select
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={selectedPlatform || ''}
                    onChange={(e) => setSelectedPlatform(e.target.value || null)}
                  >
                    <option value="">All Platforms</option>
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Risk Level
                  </label>
                  <select
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={selectedRisk || ''}
                    onChange={(e) => setSelectedRisk(e.target.value || null)}
                  >
                    <option value="">All Risk Levels</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Minimum APY
                  </label>
                  <input
                    type="number"
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. 5"
                    value={minApy !== null ? minApy : ''}
                    onChange={(e) => setMinApy(e.target.value ? parseFloat(e.target.value) : null)}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
              
              {/* Applied filters */}
              {(searchTerm || selectedPlatform || selectedRisk || minApy !== null) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchTerm && (
                    <Badge variant="secondary" className="h-6">
                      Search: {searchTerm}
                      <button 
                        className="ml-1 text-muted-foreground hover:text-foreground" 
                        onClick={() => setSearchTerm('')}
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedPlatform && (
                    <Badge variant="secondary" className="h-6">
                      Platform: {platforms.find(p => p.id === selectedPlatform)?.name}
                      <button 
                        className="ml-1 text-muted-foreground hover:text-foreground" 
                        onClick={() => setSelectedPlatform(null)}
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedRisk && (
                    <Badge variant="secondary" className="h-6">
                      Risk: {selectedRisk}
                      <button 
                        className="ml-1 text-muted-foreground hover:text-foreground" 
                        onClick={() => setSelectedRisk(null)}
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {minApy !== null && (
                    <Badge variant="secondary" className="h-6">
                      Min APY: {minApy}%
                      <button 
                        className="ml-1 text-muted-foreground hover:text-foreground" 
                        onClick={() => setMinApy(null)}
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="text-sm text-muted-foreground mb-4">
                {sortedOpportunities.length} opportunities found
              </div>
            </CardContent>
          </Card>
          
          <TabsContent value={activeTab} className="mt-6">
            {sortedOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedOpportunities.map(opportunity => (
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
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No opportunities found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results.
                </p>
                <Button onClick={handleClearFilters}>Clear All Filters</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 