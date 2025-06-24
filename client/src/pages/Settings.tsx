import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  Globe, 
  Shield,
  Crown,
  Settings as SettingsIcon,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { tierLimits, tierPricing, SubscriptionTier } from '@/utils/subscriptionTiers';
import CalendarSync from '@/components/calendar/CalendarSync';
import { SubscriptionGuard } from '@/components/SubscriptionGuard';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { toast } = useToast();
  const { tier, currentMonthEvents } = useSubscription();
  const { profile, updateProfile, loading: authLoading, error: authError, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [userProfile, setUserProfile] = useState({
    firstName: profile?.full_name?.split(' ')[0] || '',
    lastName: profile?.full_name?.split(' ')[1] || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || '',
    company: 'TechCorp Solutions',
    position: 'Event Manager',
    address: '123 Business Ave, Suite 100',
    city: 'San Francisco',
    country: 'United States'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    eventReminders: true,
    weeklyReports: true
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await updateProfile({
      full_name: userProfile.firstName + ' ' + userProfile.lastName,
      phone: userProfile.phone,
      avatar_url: userProfile.avatar_url,
    });
    await refreshProfile();
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been saved successfully.',
    });
    setIsLoading(false);
  };

  const handleChangePassword = async () => {
    toast({
      title: "Password change requested",
      description: "Please check your email for password reset instructions.",
    });
  };

  const handleManageSubscription = () => {
    // TODO: Implement customer portal
    toast({
      title: "Redirecting to billing portal",
      description: "You'll be redirected to manage your subscription.",
    });
  };

  const handleUpgradePlan = () => {
    window.open('/pricing', '_blank');
  };

  const getCurrentTierInfo = (currentTier: SubscriptionTier) => {
    const limits = tierLimits[currentTier];
    const pricing = tierPricing[currentTier];
    
    return {
      name: currentTier.charAt(0).toUpperCase() + currentTier.slice(1),
      limits,
      pricing
    };
  };

  const tierInfo = getCurrentTierInfo(tier);
  const usagePercentage = tierInfo.limits.maxEventsPerMonth 
    ? (currentMonthEvents / tierInfo.limits.maxEventsPerMonth) * 100 
    : 0;

  // Test API connectivity
  const testAPIConnection = async () => {
    if (!profile?.id) {
      toast({ title: 'Not logged in', description: 'You must be logged in to test connectivity.', variant: 'destructive' });
      return;
    }
    try {
      await updateProfile({}); // Test API call
      toast({ title: 'API Connection Successful', description: 'Successfully connected to the API.' });
    } catch (error: any) {
      toast({ title: 'API Connection Failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="subscription" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                <span>Current Plan</span>
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-semibold text-blue-900">{tierInfo.name} Plan</h3>
                      <Badge className="bg-blue-600">Current Plan</Badge>
                    </div>
                    <p className="text-blue-700 mb-4">
                      {tier === 'freemium' && 'Perfect for getting started with event management'}
                      {tier === 'professional' && 'Full access to professional features'}
                      {tier === 'enterprise' && 'Enterprise-grade event management solution'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">
                      {tierInfo.pricing.monthly === 0 ? 'Free' : `₦${tierInfo.pricing.monthly.toLocaleString()}`}
                    </div>
                    {tierInfo.pricing.monthly > 0 && <div className="text-sm text-blue-600">/month</div>}
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-semibold text-blue-900">
                      {currentMonthEvents}
                      {tierInfo.limits.maxEventsPerMonth && `/${tierInfo.limits.maxEventsPerMonth}`}
                    </div>
                    <div className="text-xs text-blue-600">Events this month</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-semibold text-blue-900">{tierInfo.limits.maxFreeAttendeesPerEvent}</div>
                    <div className="text-xs text-blue-600">Free attendees/event</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-semibold text-blue-900">
                      {tierInfo.limits.hasAdvancedAnalytics ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-blue-600">Advanced Analytics</div>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-semibold text-blue-900">
                      {tierInfo.limits.hasPrioritySupport ? 'Priority' : 'Standard'}
                    </div>
                    <div className="text-xs text-blue-600">Support Level</div>
                  </div>
                </div>

                {/* Usage Progress for Freemium */}
                {tier === 'freemium' && tierInfo.limits.maxEventsPerMonth && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-blue-700">Monthly Event Usage</span>
                      <span className="text-sm text-blue-700">{Math.round(usagePercentage)}%</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                    {usagePercentage > 80 && (
                      <p className="text-sm text-amber-600 mt-1">
                        You're approaching your monthly limit. Consider upgrading for unlimited events.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Feature Access */}
              <div className="space-y-4">
                <h4 className="font-medium">Plan Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${tierInfo.limits.hasAdvancedAnalytics ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Advanced Analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${tierInfo.limits.hasCustomBranding ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Custom Branding</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${tierInfo.limits.hasCalendarSync ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Calendar Sync</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${tierInfo.limits.hasApiAccess ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">API Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${tierInfo.limits.hasWhiteLabel ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">White Label</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${tierInfo.limits.hasPrioritySupport ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Priority Support</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleUpgradePlan} variant="outline" className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>{tier === 'freemium' ? 'Upgrade Plan' : 'Change Plan'}</span>
                </Button>
                {tier !== 'freemium' && (
                  <Button onClick={handleManageSubscription} variant="outline">
                    Manage Billing
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          {tier !== 'freemium' && (
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your recent billing history and invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">December 2024</h5>
                      <p className="text-sm text-gray-600">Professional Plan</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₦10,000</div>
                      <Badge variant="secondary">Paid</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">November 2024</h5>
                      <p className="text-sm text-gray-600">Professional Plan + Usage (150 extra attendees)</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₦12,000</div>
                      <Badge variant="secondary">Paid</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={userProfile.firstName}
                    onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userProfile.lastName}
                    onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number</span>
                </Label>
                <Input
                  id="phone"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Company</span>
                  </Label>
                  <Input
                    id="company"
                    value={userProfile.company}
                    onChange={(e) => setUserProfile({...userProfile, company: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={userProfile.position}
                    onChange={(e) => setUserProfile({...userProfile, position: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                </Label>
                <Textarea
                  id="address"
                  value={userProfile.address}
                  onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={userProfile.city}
                    onChange={(e) => setUserProfile({...userProfile, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={userProfile.country}
                    onChange={(e) => setUserProfile({...userProfile, country: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab - Professional/Enterprise Only */}
        <TabsContent value="calendar" className="space-y-6">
          <SubscriptionGuard
            requiredFeature="hasCalendarSync"
            fallbackTitle="Calendar Sync Available with Professional Plan"
            fallbackDescription="Sync your events with Google Calendar, Outlook, and other popular calendar applications with our Professional or Enterprise plans."
          >
            <CalendarSync />
          </SubscriptionGuard>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Password & Security</span>
              </CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                  </div>
                  <Button variant="outline" onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Disabled</Badge>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-800">Account Security Status</h3>
                      <p className="text-sm text-green-600">Your account is secure with current settings</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, emailNotifications: checked})
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, pushNotifications: checked})
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Event Reminders</h4>
                    <p className="text-sm text-gray-600">Get reminded about upcoming events</p>
                  </div>
                  <Switch
                    checked={notifications.eventReminders}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, eventReminders: checked})
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-gray-600">Receive weekly attendance reports</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, weeklyReports: checked})
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Regional Settings</span>
              </CardTitle>
              <CardDescription>
                Configure your language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" value="English (US)" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" value="West Africa Time (WAT)" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Input id="dateFormat" value="DD/MM/YYYY" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Input id="timeFormat" value="24-hour" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add a button in the settings UI: */}
      <Button onClick={testSupabaseConnection} className="mt-4">Test Supabase Connection</Button>
    </div>
  );
};

export default Settings;
