'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { YieldCard } from '@/components/YieldCard';
import Header from '@/components/Header';
import { getYieldOpportunities, getPlatforms, getCurrentUser } from '@/lib/api';
import { YieldOpportunity, Platform, User } from '@/lib/types';

export default function SavedPage() {
  const [opportunities, setOpportunities] = useState<YieldOpportunity[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [oppsData, platformsData, userData] = await Promise.all([
          getYieldOpportunities(userData?.subscriptionLevel || 'free'),
          getPlatforms(),
          getCurrentUser()
        ]);
        
        setOpportunities(oppsData);
        setPlatforms(platformsData);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load saved opportunities data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getPlatform = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || {
      id: 'unknown',
      name: 'Unknown',
      logo: '',
      url: '#'
    };
  };

  const savedOpportunities = opportunities.filter(opp => 
    user?.savedOpportunities.includes(opp.id)
  );

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-lg">Loading saved opportunities...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Saved Opportunities</h1>

        {savedOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedOpportunities.map(opportunity => (
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
          <Card>
            <CardHeader>
              <CardTitle>No Saved Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You haven't saved any opportunities yet. Browse the available opportunities and save 
                the ones you're interested in to track them here.
              </p>
              <Button asChild>
                <a href="/">Browse Opportunities</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
} 