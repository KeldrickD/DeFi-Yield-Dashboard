'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { 
  getYieldOpportunities, 
  getPlatforms, 
  getCurrentUser,
  getHistoricalYieldData,
  saveOpportunity,
  removeSavedOpportunity
} from '@/lib/api';
import { YieldOpportunity, Platform, User, HistoricalYieldData } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function OpportunityDetailPage() {
  const params = useParams();
  const opportunityId = params.id as string;
  
  const [opportunity, setOpportunity] = useState<YieldOpportunity | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [historyData, setHistoryData] = useState<HistoricalYieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [opportunitiesData, platformsData, userData] = await Promise.all([
          getYieldOpportunities(user?.subscriptionLevel || 'free'),
          getPlatforms(),
          getCurrentUser()
        ]);
        
        const foundOpportunity = opportunitiesData.find(opp => opp.id === opportunityId);
        if (!foundOpportunity) {
          throw new Error('Opportunity not found');
        }
        
        const foundPlatform = platformsData.find(p => p.id === foundOpportunity.platformId);
        if (!foundPlatform) {
          throw new Error('Platform not found');
        }
        
        // If user is premium or the opportunity is not premium, fetch historical data
        if (userData.subscriptionLevel === 'premium' || !foundOpportunity.isPremium) {
          const historyData = await getHistoricalYieldData(opportunityId);
          setHistoryData(historyData);
        }
        
        setOpportunity(foundOpportunity);
        setPlatform(foundPlatform);
        setUser(userData);
        setIsSaved(userData.savedOpportunities.includes(opportunityId));
      } catch (error) {
        console.error('Failed to load opportunity data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (opportunityId) {
      loadData();
    }
  }, [opportunityId, user?.subscriptionLevel]);

  const handleSaveToggle = async () => {
    if (!user || !opportunity) return;
    
    setIsSaving(true);
    try {
      const updatedUser = isSaved
        ? await removeSavedOpportunity(opportunity.id)
        : await saveOpportunity(opportunity.id);
      
      setIsSaved(!isSaved);
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update saved opportunity:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !opportunity || !platform) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-lg">Loading opportunity details...</p>
          </div>
        </main>
      </div>
    );
  }

  const apyBadgeVariant = opportunity.apy >= 8 
    ? 'highApy' 
    : opportunity.apy >= 5 
      ? 'mediumApy' 
      : 'lowApy';

  const isPremiumLocked = opportunity.isPremium && user?.subscriptionLevel !== 'premium';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="mb-6"
        >
          ← Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={platform.logo} 
                    alt={platform.name} 
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=' + platform.name.charAt(0);
                    }}
                  />
                  <div>
                    <CardTitle className="text-2xl">{opportunity.name}</CardTitle>
                    <p className="text-muted-foreground">{platform.name}</p>
                  </div>
                </div>
                <Badge variant={apyBadgeVariant} className="text-lg px-3 py-1">
                  {formatPercent(opportunity.apy)} APY
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-muted-foreground text-sm">Asset</p>
                    <p className="font-medium">{opportunity.asset}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">TVL</p>
                    <p className="font-medium">{formatCurrency(opportunity.tvl)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Risk Level</p>
                    <p className="font-medium capitalize">{opportunity.riskLevel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Last Updated</p>
                    <p className="font-medium">
                      {new Date(opportunity.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  {isPremiumLocked ? (
                    <div className="bg-secondary/20 rounded-md p-4 text-center">
                      <p className="mb-2">This premium opportunity requires a premium subscription to view details.</p>
                      <Button variant="premium" size="sm" asChild>
                        <a href="/premium">Upgrade to Premium</a>
                      </Button>
                    </div>
                  ) : (
                    <p>{opportunity.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {opportunity.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {opportunity.isPremium && (
                    <Badge variant="premium">Premium</Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <a 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit {platform.name} →
                  </a>
                  <Button
                    variant={isSaved ? "secondary" : "outline"}
                    onClick={handleSaveToggle}
                    disabled={isSaving}
                  >
                    {isSaved ? 'Saved' : 'Save Opportunity'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {!isPremiumLocked && historyData.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Historical APY</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={historyData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => {
                            const d = new Date(date);
                            return `${d.getMonth() + 1}/${d.getDate()}`;
                          }}
                        />
                        <YAxis 
                          domain={['dataMin - 0.5', 'dataMax + 0.5']}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'APY']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="apy" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Similar Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPremiumLocked ? (
                  <div className="text-center p-4">
                    <p className="mb-2">Premium subscription required to view similar opportunities.</p>
                    <Button variant="premium" size="sm" asChild>
                      <a href="/premium">Upgrade to Premium</a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">
                    Similar opportunities feature coming soon.
                  </p>
                )}
              </CardContent>
            </Card>

            {!isPremiumLocked && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Protocol Security</h4>
                      <div className="flex">
                        <div 
                          className={`h-2 rounded-l-full ${opportunity.riskLevel === 'low' ? 'bg-green-500' : 'bg-gray-200'}`} 
                          style={{ width: '33.33%' }}
                        />
                        <div 
                          className={`h-2 ${opportunity.riskLevel === 'medium' ? 'bg-blue-500' : 'bg-gray-200'}`} 
                          style={{ width: '33.33%' }}
                        />
                        <div 
                          className={`h-2 rounded-r-full ${opportunity.riskLevel === 'high' ? 'bg-yellow-500' : 'bg-gray-200'}`} 
                          style={{ width: '33.33%' }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Protocol Audit Status</h4>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Audited
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      This opportunity has been evaluated by our risk assessment team. 
                      The protocol has undergone security audits and has had a stable history of operation.
                      Always conduct your own research before investing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 