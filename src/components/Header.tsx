import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { getCurrentUser } from '@/lib/api';
import { User } from '@/lib/types';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
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

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <h1 className="text-xl font-bold">DeFi Yield Dashboard</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Dashboard
          </Link>
          <Link href="/opportunities" className="text-sm font-medium hover:text-primary">
            Opportunities
          </Link>
          <Link href="/saved" className="text-sm font-medium hover:text-primary">
            Saved
          </Link>
          <Link href="/premium" className="text-sm font-medium hover:text-primary">
            Premium
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {!loading && user && (
            <>
              {user.subscriptionLevel === 'premium' ? (
                <Badge variant="premium" className="h-7 px-3 py-1">Premium</Badge>
              ) : (
                <Link href="/premium">
                  <Button variant="premium" size="sm">
                    Upgrade to Premium
                  </Button>
                </Link>
              )}
              <span className="text-sm font-medium">{user.email}</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 