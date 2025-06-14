
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
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - in real app this would come from your auth system
  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
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
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleChangePassword = async () => {
    toast({
      title: "Password change requested",
      description: "Please check your email for password reset instructions.",
    });
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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

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

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                <span>Subscription & Billing</span>
              </CardTitle>
              <CardDescription>
                Manage your subscription plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-semibold text-blue-900">Professional Plan</h3>
                      <Badge className="bg-blue-600">Current Plan</Badge>
                    </div>
                    <p className="text-blue-700 mb-4">Full access to all MeetCheck features</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Events:</span>
                        <p className="text-blue-600">Unlimited</p>
                      </div>
                      <div>
                        <span className="font-medium">Attendees:</span>
                        <p className="text-blue-600">Up to 10,000</p>
                      </div>
                      <div>
                        <span className="font-medium">Analytics:</span>
                        <p className="text-blue-600">Advanced</p>
                      </div>
                      <div>
                        <span className="font-medium">Support:</span>
                        <p className="text-blue-600">Priority</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">$49</div>
                    <div className="text-sm text-blue-600">/month</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Billing Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Next Billing Date</h5>
                    <p className="text-gray-600">January 15, 2024</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Payment Method</h5>
                    <p className="text-gray-600">•••• •••• •••• 4242</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline">Upgrade Plan</Button>
                  <Button variant="outline">Update Payment</Button>
                  <Button variant="outline">View Invoices</Button>
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
                  <Input id="timezone" value="Pacific Time (PT)" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Input id="dateFormat" value="MM/DD/YYYY" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Input id="timeFormat" value="12-hour" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
