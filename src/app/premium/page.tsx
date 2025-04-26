'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { getCurrentUser, updateUserSubscription } from '@/lib/api';
import { User } from '@/lib/types';

export default function PremiumPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleUpgrade = async () => {
    if (!user) return;
    
    setIsUpgrading(true);
    try {
      const updatedUser = await updateUserSubscription('premium');
      setUser(updatedUser);
      alert('Upgraded to premium successfully!');
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      alert('Failed to upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleDowngrade = async () => {
    if (!user) return;
    
    setIsUpgrading(true);
    try {
      const updatedUser = await updateUserSubscription('free');
      setUser(updatedUser);
      alert('Downgraded to free successfully.');
    } catch (error) {
      console.error('Failed to downgrade subscription:', error);
      alert('Failed to downgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-10">
            <h1 className="text-4xl font-bold mb-4">Premium Subscription</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Unlock full access to all yield opportunities and advanced features.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Free Plan</CardTitle>
                  <CardDescription>Basic access to yield opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-6">$0<span className="text-muted-foreground text-sm font-normal">/month</span></p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>View basic yield opportunities</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>Save your favorite opportunities</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>Basic APY information</span>
                    </li>
                    <li className="flex items-center opacity-50">
                      <CrossIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Premium opportunities</span>
                    </li>
                    <li className="flex items-center opacity-50">
                      <CrossIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Historical APY data</span>
                    </li>
                    <li className="flex items-center opacity-50">
                      <CrossIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Risk assessment reports</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {user?.subscriptionLevel === 'premium' ? (
                    <Button 
                      onClick={handleDowngrade} 
                      disabled={isUpgrading}
                      className="w-full"
                      variant="outline"
                    >
                      Downgrade to Free
                    </Button>
                  ) : (
                    <Button 
                      disabled={true}
                      className="w-full"
                      variant="outline"
                    >
                      Current Plan
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Premium Plan */}
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Premium Plan</CardTitle>
                    <Badge variant="premium">Recommended</Badge>
                  </div>
                  <CardDescription>Full access to all features</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-6">$19.99<span className="text-muted-foreground text-sm font-normal">/month</span></p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>All free plan features</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>Access to premium opportunities</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>Detailed historical APY data</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>Risk assessment reports</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>Email notifications for APY changes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>Priority customer support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {user?.subscriptionLevel === 'premium' ? (
                    <Button 
                      disabled={true}
                      className="w-full"
                      variant="premium"
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleUpgrade} 
                      disabled={isUpgrading}
                      className="w-full"
                      variant="premium"
                    >
                      Upgrade to Premium
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Premium Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Premium Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Access high-yield opportunities not available to free users. 
                    These typically offer 2-3x higher APYs than standard opportunities.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Historical Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View detailed historical APY charts to analyze performance trends 
                    and make more informed investment decisions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get detailed risk assessment reports for each yield opportunity,
                    including protocol security, liquidity analysis, and more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I cancel my premium subscription?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel your premium subscription at any time. 
                    You'll continue to have premium access until the end of your billing period.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How often is yield data updated?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    For free users, yield data is updated once per day. Premium users get real-time 
                    yield updates as they occur across platforms.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We offer a 7-day money-back guarantee if you're not satisfied with the premium features.
                    Contact our support team to request a refund.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
} 