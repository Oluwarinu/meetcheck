import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaystackService, PaymentPlan, SUBSCRIPTION_PLANS } from '@/lib/paystack';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: PaymentPlan;
  onSuccess?: () => void;
}

export function PaymentModal({ isOpen, onClose, selectedPlan, onSuccess }: PaymentModalProps) {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystack] = useState(new PaystackService(import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''));

  const plan = selectedPlan || SUBSCRIPTION_PLANS.find(p => p.id === 'professional')!;

  const handlePayment = async () => {
    if (!user || !profile) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }

    if (plan.amount === 0) {
      // Free plan - no payment needed
      onSuccess?.();
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      // Initialize payment with backend
      const initData = await apiClient.initializePayment({
        email: profile.email,
        amount: plan.amount / 100, // Convert from kobo to naira
        plan: plan.id,
        metadata: {
          plan_name: plan.name,
          user_id: user.id
        }
      });

      // Initialize Paystack payment
      await paystack.initializePayment({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
        email: profile.email,
        amount: plan.amount,
        ref: initData.reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: plan.name
            },
            {
              display_name: "User ID",
              variable_name: "user_id", 
              value: user.id
            }
          ]
        },
        callback: async (response) => {
          try {
            // Verify payment with backend
            const verification = await apiClient.verifyPayment(response.reference);
            
            if (verification.success) {
              toast({
                title: "Payment Successful!",
                description: `You've successfully subscribed to the ${plan.name} plan.`,
              });
              onSuccess?.();
              onClose();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            toast({
              title: "Payment Verification Failed",
              description: error.message || "There was an issue verifying your payment.",
              variant: "destructive"
            });
          }
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
        }
      });
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name}</DialogTitle>
          <DialogDescription>
            Upgrade your account to access premium features
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {plan.name}
              <Badge variant="secondary">{plan.interval}</Badge>
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">
              {paystack.formatAmount(plan.amount)}
              <span className="text-sm font-normal text-muted-foreground">
                /{plan.interval}
              </span>
            </div>
            
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                {plan.amount === 0 ? 'Select Plan' : 'Pay Now'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}