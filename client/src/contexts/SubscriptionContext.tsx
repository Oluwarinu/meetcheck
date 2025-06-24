
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubscriptionTier } from '@/utils/subscriptionTiers';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isLoading: boolean;
  currentMonthEvents: number;
  refreshSubscription: () => Promise<void>;
  updateEventCount: (count: number) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [tier, setTier] = useState<SubscriptionTier>('freemium');
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonthEvents, setCurrentMonthEvents] = useState(0);

  const refreshSubscription = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual subscription check via Supabase edge function
      // For now, we'll use localStorage to simulate subscription state
      const savedTier = localStorage.getItem('subscriptionTier') as SubscriptionTier;
      const savedEventCount = localStorage.getItem('currentMonthEvents');
      
      if (savedTier) {
        setTier(savedTier);
      }
      if (savedEventCount) {
        setCurrentMonthEvents(parseInt(savedEventCount, 10));
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateEventCount = (count: number) => {
    setCurrentMonthEvents(count);
    localStorage.setItem('currentMonthEvents', count.toString());
  };

  useEffect(() => {
    refreshSubscription();
  }, []);

  const value = {
    tier,
    isLoading,
    currentMonthEvents,
    refreshSubscription,
    updateEventCount
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
