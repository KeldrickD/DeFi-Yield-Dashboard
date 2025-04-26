import { useMemo, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { YieldOpportunity, Platform, User } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { saveOpportunity, removeSavedOpportunity } from '@/lib/api';

interface YieldCardProps {
  opportunity: YieldOpportunity;
  platform: Platform;
  user: User | null;
  onSave?: (user: User) => void;
  showDetailedView?: boolean;
}

export function YieldCard({
  opportunity,
  platform,
  user,
  onSave,
  showDetailedView = false,
}: YieldCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(() => 
    user?.savedOpportunities.includes(opportunity.id) || false
  );

  const apyBadgeVariant = useMemo(() => {
    if (opportunity.apy >= 8) return 'highApy';
    if (opportunity.apy >= 5) return 'mediumApy';
    return 'lowApy';
  }, [opportunity.apy]);

  const handleSaveToggle = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const updatedUser = isSaved
        ? await removeSavedOpportunity(opportunity.id)
        : await saveOpportunity(opportunity.id);
      
      setIsSaved(!isSaved);
      onSave?.(updatedUser);
    } catch (error) {
      console.error('Failed to update saved opportunity:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <img 
              src={platform.logo} 
              alt={platform.name} 
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/30x30?text=' + platform.name.charAt(0);
              }}
            />
            <CardTitle className="text-lg">{opportunity.name}</CardTitle>
          </div>
          <Badge variant={apyBadgeVariant}>{formatPercent(opportunity.apy)} APY</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Asset</p>
            <p className="font-medium">{opportunity.asset}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Platform</p>
            <p className="font-medium">{platform.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">TVL</p>
            <p className="font-medium">{formatCurrency(opportunity.tvl)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Risk</p>
            <p className="font-medium capitalize">{opportunity.riskLevel}</p>
          </div>
        </div>

        {showDetailedView && (
          <div className="mt-4">
            <p className="text-muted-foreground text-sm mb-1">Description</p>
            <p className="text-sm">{opportunity.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {opportunity.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {opportunity.isPremium && !showDetailedView && (
          <div className="mt-4 bg-secondary/20 p-2 rounded-md">
            <p className="text-xs text-center">
              {user?.subscriptionLevel === 'premium' 
                ? 'Premium opportunity - View details' 
                : 'Upgrade to premium to see full details'}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full">
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Visit {platform.name} →
          </a>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveToggle}
            disabled={isSaving || !user}
          >
            {isSaved ? 'Unsave' : 'Save'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 