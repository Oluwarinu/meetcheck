
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      id: 'freemium',
      name: 'Freemium/Basic',
      price: 'Free',
      description: 'Perfect for small parties, clubs, and one-off events',
      icon: <Star className="h-5 w-5" />,
      features: [
        'Core attendance tracking',
        'Up to 5 events per month',
        'Basic reporting',
        '100 free attendees per event',
        'QR code generation',
        'Basic check-in functionality'
      ],
      limitations: [
        'Limited to 5 events per month',
        'Basic reporting only',
        'No custom branding'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '₦10,000',
      period: '/month',
      description: 'Ideal for mid-sized organizations and recurring events',
      icon: <Zap className="h-5 w-5" />,
      features: [
        'Unlimited events',
        'Advanced analytics & reporting',
        'Calendar sync integration',
        'Email notifications',
        'Custom branding options',
        '100 free attendees per event',
        'Export data functionality',
        'Priority email support'
      ],
      limitations: [],
      cta: 'Start Professional',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'starting at ₦50,000/month',
      description: 'For large corporations and educational institutions',
      icon: <Shield className="h-5 w-5" />,
      features: [
        'All Professional features',
        'API access for custom integrations',
        'White-label solutions',
        'Priority phone & email support',
        'Custom attendee thresholds',
        'Dedicated account manager',
        'Custom reporting',
        'SLA guarantees'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const handleSubscribe = (tierId: string) => {
    if (tierId === 'freemium') {
      navigate('/signup');
    } else if (tierId === 'enterprise') {
      // Handle enterprise contact
      window.open('mailto:sales@meetcheck.com?subject=Enterprise%20Inquiry', '_blank');
    } else {
      // Handle professional subscription
      navigate('/subscribe/professional');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose the Perfect Plan for Your Events
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Scale your event management with flexible pricing that grows with your needs
        </p>
      </div>

      {/* Usage-based pricing info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Usage-Based Add-On Pricing</h3>
        <p className="text-blue-800">
          Each event includes up to <strong>100 attendees free</strong>. For events with more than 100 attendees, 
          an additional fee of <strong>₦1,000 per every 100 attendees</strong> (or fraction thereof) applies.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {tiers.map((tier) => (
          <Card key={tier.id} className={`relative ${tier.popular ? 'border-blue-500 border-2' : ''}`}>
            {tier.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${tier.popular ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {tier.icon}
                </div>
              </div>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <div className="py-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-gray-500">{tier.period}</span>}
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className={`w-full mb-6 ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                onClick={() => handleSubscribe(tier.id)}
              >
                {tier.cta}
              </Button>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Features included:</h4>
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                
                {tier.limitations.length > 0 && (
                  <div className="pt-4">
                    <h4 className="font-semibold text-gray-600 text-sm">Limitations:</h4>
                    {tier.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-3 mt-2">
                        <div className="h-1 w-1 bg-gray-400 rounded-full flex-shrink-0 ml-1.5" />
                        <span className="text-xs text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">How does the usage-based pricing work?</h3>
            <p className="text-gray-600">
              Every event includes 100 free attendees. If your event has more than 100 attendees, 
              you'll be charged ₦1,000 for every additional 100 attendees (or any part thereof). 
              For example, 250 attendees would incur an additional charge of ₦2,000.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected 
              in your next billing cycle, and you'll have immediate access to new features.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards, bank transfers, and local Nigerian payment methods 
              through our secure payment partners Stripe and Paystack.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
