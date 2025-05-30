import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPercent(percent: number): string {
  return `${percent.toFixed(2)}%`;
}

export const SUBSCRIPTION_LEVELS = {
  FREE: 'free',
  PREMIUM: 'premium',
}; 