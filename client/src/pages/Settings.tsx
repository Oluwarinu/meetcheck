import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  User, 
  Calendar, 
  Shield, 
  Bell,
  Crown,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  Headphones
} from "lucide-react";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("subscription");
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true
  });

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await updateProfile({
        full_name: profileData.fullName,
        phone: profileData.phone
      });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-gray-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Current Plan</CardTitle>
              </div>
              <CardDescription className="text-blue-700">
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-semibold text-blue-900">Freemium Plan</span>
                      <Badge className="bg-blue-600">Current Plan</Badge>
                    </div>
                    <p className="text-blue-700">Perfect for getting started with event management</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">Free</div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-lg font-semibold">0/5</div>
                    <div className="text-sm text-gray-600">Events this month</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-lg font-semibold">100</div>
                    <div className="text-sm text-gray-600">Free attendees/event</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-lg font-semibold">No</div>
                    <div className="text-sm text-gray-600">Advanced Analytics</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Headphones className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-lg font-semibold">Standard</div>
                    <div className="text-sm text-gray-600">Support Level</div>
                  </div>
                </div>

                {/* Monthly Event Usage */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Monthly Event Usage</span>
                    <span className="text-sm text-gray-600">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Plan Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Advanced Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Custom Branding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Calendar Sync</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>API Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>White Label</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Priority Support</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Integration</CardTitle>
              <CardDescription>
                Sync your events with external calendar applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Google Calendar</h4>
                    <p className="text-sm text-gray-600">Sync events with Google Calendar</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Outlook Calendar</h4>
                    <p className="text-sm text-gray-600">Sync events with Microsoft Outlook</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button className="mt-2">Update Password</Button>
                </div>
                
                <hr />
                
                <div>
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
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
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, smsNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, pushNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-gray-600">Receive weekly analytics reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, weeklyReports: checked})
                    }
                  />
                </div>
              </div>
              
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}