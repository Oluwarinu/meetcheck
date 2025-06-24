// Paystack payment integration
export interface PaystackConfig {
  key: string;
  email: string;
  amount: number; // Amount in kobo (multiply by 100)
  currency?: string;
  ref?: string;
  callback: (response: any) => void;
  onClose: () => void;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  amount: number; // In kobo
  interval: 'monthly' | 'yearly';
  features: string[];
}

export const SUBSCRIPTION_PLANS: PaymentPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    amount: 0,
    interval: 'monthly',
    features: [
      'Up to 3 events per month',
      'Up to 50 attendees per event',
      'Basic analytics',
      'QR code check-ins',
      'Email support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing businesses',
    amount: 500000, // ₦5,000 in kobo
    interval: 'monthly',
    features: [
      'Up to 20 events per month',
      'Up to 500 attendees per event',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      'Export data',
      'Custom forms'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    amount: 1500000, // ₦15,000 in kobo
    interval: 'monthly',
    features: [
      'Unlimited events',
      'Unlimited attendees',
      'Advanced analytics & reporting',
      'White-label solution',
      'Dedicated support',
      'API access',
      'Custom integrations',
      'Multi-user accounts'
    ]
  }
];

export class PaystackService {
  private publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  generateReference(): string {
    return `meetcheck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async initializePayment(config: PaystackConfig): Promise<void> {
    // Load Paystack inline script if not already loaded
    if (!window.PaystackPop) {
      await this.loadPaystackScript();
    }

    const paystack = window.PaystackPop.setup({
      key: config.key,
      email: config.email,
      amount: config.amount,
      currency: config.currency || 'NGN',
      ref: config.ref || this.generateReference(),
      callback: config.callback,
      onClose: config.onClose,
      metadata: config.metadata
    });

    paystack.openIframe();
  }

  private loadPaystackScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.head.appendChild(script);
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount / 100);
  }
}

// Global Paystack types
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}