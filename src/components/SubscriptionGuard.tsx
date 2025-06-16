
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { hasFeatureAccess, SubscriptionTier, TierLimits } from '@/utils/subscriptionTiers';

interface SubscriptionGuardProps {
  requiredFeature: keyof TierLimits;
  requiredTier?: SubscriptionTier;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  requiredFeature,
  requiredTier = 'professional',
  children,
  fallbackTitle = 'Upgrade Required',
  fallbackDescription = 'This feature requires a higher subscription tier.'
}) => {
  const { tier } = useSubscription();
  
  const hasAccess = hasFeatureAccess(tier, requiredFeature);

  if (hasAccess) {
    return <>{children}</>;
  }

  const handleUpgrade = () => {
    window.open('/pricing', '_blank');
  };

  return (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-yellow-100">
            <Crown className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        <CardTitle className="flex items-center justify-center space-x-2">
          <Lock className="h-5 w-5 text-yellow-600" />
          <span>{fallbackTitle}</span>
        </CardTitle>
        <CardDescription className="text-center max-w-md mx-auto">
          {fallbackDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center space-x-2">
          <Badge variant="outline" className="text-gray-600">
            Current: {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Badge>
          <Badge className="bg-yellow-600">
            Required: {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
          </Badge>
        </div>
        
        <Button onClick={handleUpgrade} className="bg-yellow-600 hover:bg-yellow-700">
          Upgrade Now
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        
        <p className="text-xs text-gray-500">
          Unlock this feature and many more with a subscription upgrade
        </p>
      </CardContent>
    </Card>
  );
};
