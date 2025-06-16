
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

interface UpgradeFeature {
  featureName: string;
  description: string;
  requiredPlan: 'Professional' | 'Enterprise';
}

const upgradeFeatures: UpgradeFeature[] = [
  {
    featureName: 'Excel Export',
    description: 'Download reports in Excel format for advanced data analysis',
    requiredPlan: 'Professional'
  },
  {
    featureName: 'Advanced Reports',
    description: 'Access detailed event analytics with custom metrics',
    requiredPlan: 'Professional'
  },
  {
    featureName: 'Advanced Analytics',
    description: 'Real-time dashboards, funnel analysis, and segmentation',
    requiredPlan: 'Professional'
  }
];

const UpgradeTable: React.FC = () => {
  const { tier } = useSubscription();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/upgrade');
  };

  const getCurrentPlanDisplay = () => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-amber-100">
            <Crown className="h-6 w-6 text-amber-600" />
          </div>
        </div>
        <CardTitle className="flex items-center justify-center space-x-2 text-xl">
          <span>Upgrade Features</span>
        </CardTitle>
        <p className="text-muted-foreground">
          Unlock powerful features to enhance your event analytics experience
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-amber-200">
                <TableHead className="font-semibold text-gray-700">Feature Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Description</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Current Plan</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Required Plan</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upgradeFeatures.map((feature, index) => (
                <TableRow key={index} className="border-amber-100 hover:bg-amber-25">
                  <TableCell className="font-medium text-gray-900">
                    {feature.featureName}
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-xs">
                    {feature.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
                      {getCurrentPlanDisplay()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-amber-600 hover:bg-amber-700 text-white">
                      {feature.requiredPlan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      onClick={handleUpgrade} 
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2"
                    >
                      Upgrade Now
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Unlock all these features and many more with a subscription upgrade
          </p>
          <Button 
            onClick={handleUpgrade} 
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-base"
          >
            View All Plans
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradeTable;
