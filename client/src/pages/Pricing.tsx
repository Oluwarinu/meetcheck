
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCircle } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";
import { SUBSCRIPTION_PLANS, PaymentPlan } from "@/lib/paystack";
import { useAuth } from "@/contexts/AuthContext";

export default function Pricing() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSelectPlan = (plan: PaymentPlan) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Redirect to dashboard after successful payment
    window.location.href = '/dashboard';
  };

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



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MeetCheck</span>
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your event management needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan, index) => (
            <Card key={index} className={`relative ${plan.id === 'professional' ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
              {plan.id === 'professional' && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN'
                    }).format(plan.amount / 100)}
                  </span>
                  <span className="text-gray-600 ml-1">/{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.id === 'professional' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.id === 'professional' ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.id === "free" ? "Get Started" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
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
}
