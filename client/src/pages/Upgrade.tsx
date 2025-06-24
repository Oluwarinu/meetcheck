
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

const Upgrade = () => {
  const navigate = useNavigate();
  const { tier } = useSubscription();

  const plans = [
    {
      id: 'professional',
      name: 'Professional',
      price: '₦10,000',
      period: '/month',
      description: 'Perfect for growing organizations',
      icon: <Zap className="h-5 w-5" />,
      features: [
        'Unlimited events',
        'Advanced analytics & reporting',
        'Excel export capabilities',
        'Calendar sync integration',
        'Email notifications',
        'Custom branding options',
        'Priority email support'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'starting at ₦50,000/month',
      description: 'For large organizations',
      icon: <Shield className="h-5 w-5" />,
      features: [
        'All Professional features',
        'API access',
        'White-label solutions',
        'Priority phone & email support',
        'Custom attendee thresholds',
        'Dedicated account manager',
        'SLA guarantees'
      ],
      popular: false
    }
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === 'enterprise') {
      window.open('mailto:sales@meetcheck.com?subject=Enterprise%20Inquiry', '_blank');
    } else {
      // TODO: Implement actual subscription flow
      console.log(`Subscribing to ${planId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upgrade Your Plan
            </h1>
            <p className="text-gray-600">
              Unlock powerful features to enhance your event management
            </p>
            <div className="mt-4">
              <Badge variant="outline" className="text-gray-600">
                Current Plan: {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Recommended
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="py-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className={`w-full mb-6 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {plan.id === 'enterprise' ? 'Contact Sales' : 'Subscribe Now'}
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800 text-sm">
            All plans include <strong>100 free attendees per event</strong>. 
            Additional attendees are charged at <strong>₦1,000 per 100 attendees</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
