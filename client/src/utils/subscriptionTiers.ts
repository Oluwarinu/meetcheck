
export type SubscriptionTier = 'freemium' | 'professional' | 'enterprise';

export interface TierLimits {
  maxEventsPerMonth: number | null; // null means unlimited
  hasAdvancedAnalytics: boolean;
  hasCustomBranding: boolean;
  hasApiAccess: boolean;
  hasWhiteLabel: boolean;
  hasPrioritySupport: boolean;
  hasCalendarSync: boolean;
  hasEmailNotifications: boolean;
  maxFreeAttendeesPerEvent: number;
  usageBasedPricing: boolean;
}

export const tierLimits: Record<SubscriptionTier, TierLimits> = {
  freemium: {
    maxEventsPerMonth: 5,
    hasAdvancedAnalytics: false,
    hasCustomBranding: false,
    hasApiAccess: false,
    hasWhiteLabel: false,
    hasPrioritySupport: false,
    hasCalendarSync: false,
    hasEmailNotifications: false,
    maxFreeAttendeesPerEvent: 100,
    usageBasedPricing: true
  },
  professional: {
    maxEventsPerMonth: null, // unlimited
    hasAdvancedAnalytics: true,
    hasCustomBranding: true,
    hasApiAccess: false,
    hasWhiteLabel: false,
    hasPrioritySupport: false,
    hasCalendarSync: true,
    hasEmailNotifications: true,
    maxFreeAttendeesPerEvent: 100,
    usageBasedPricing: true
  },
  enterprise: {
    maxEventsPerMonth: null, // unlimited
    hasAdvancedAnalytics: true,
    hasCustomBranding: true,
    hasApiAccess: true,
    hasWhiteLabel: true,
    hasPrioritySupport: true,
    hasCalendarSync: true,
    hasEmailNotifications: true,
    maxFreeAttendeesPerEvent: 100, // can be customized
    usageBasedPricing: true // can be customized
  }
};

export const tierPricing = {
  freemium: { monthly: 0, currency: 'NGN' },
  professional: { monthly: 10000, currency: 'NGN' },
  enterprise: { monthly: 50000, currency: 'NGN', custom: true }
};

export const calculateUsageCharge = (attendees: number, freeLimit: number = 100): number => {
  if (attendees <= freeLimit) return 0;
  const extraAttendees = attendees - freeLimit;
  const blocks = Math.ceil(extraAttendees / 100);
  return blocks * 1000; // ₦1,000 per 100 attendees
};

export const canCreateEvent = (tier: SubscriptionTier, currentMonthEvents: number): boolean => {
  const limits = tierLimits[tier];
  if (limits.maxEventsPerMonth === null) return true;
  return currentMonthEvents < limits.maxEventsPerMonth;
};

export const hasFeatureAccess = (tier: SubscriptionTier, feature: keyof TierLimits): boolean => {
  return tierLimits[tier][feature] as boolean;
};
