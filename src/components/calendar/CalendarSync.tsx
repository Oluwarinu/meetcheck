
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, CheckCircle, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalendarProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
  eventsCount?: number;
}

const CalendarSync = () => {
  const { toast } = useToast();
  const [autoSync, setAutoSync] = useState(true);
  const [calendarProviders, setCalendarProviders] = useState<CalendarProvider[]>([
    {
      id: 'google',
      name: 'Google Calendar',
      icon: <Calendar className="h-5 w-5" />,
      connected: true,
      lastSync: '2 minutes ago',
      eventsCount: 12
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: <Calendar className="h-5 w-5" />,
      connected: false
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: <Calendar className="h-5 w-5" />,
      connected: false
    }
  ]);

  const handleConnect = (providerId: string) => {
    // TODO: Implement actual calendar connection logic
    setCalendarProviders(providers =>
      providers.map(provider =>
        provider.id === providerId
          ? { ...provider, connected: true, lastSync: 'Just now', eventsCount: 0 }
          : provider
      )
    );
    
    toast({
      title: "Calendar connected",
      description: `Successfully connected to ${calendarProviders.find(p => p.id === providerId)?.name}`,
    });
  };

  const handleDisconnect = (providerId: string) => {
    setCalendarProviders(providers =>
      providers.map(provider =>
        provider.id === providerId
          ? { ...provider, connected: false, lastSync: undefined, eventsCount: undefined }
          : provider
      )
    );
    
    toast({
      title: "Calendar disconnected",
      description: `Disconnected from ${calendarProviders.find(p => p.id === providerId)?.name}`,
    });
  };

  const handleSyncNow = () => {
    toast({
      title: "Syncing calendars",
      description: "Calendar synchronization started...",
    });
    
    setTimeout(() => {
      setCalendarProviders(providers =>
        providers.map(provider =>
          provider.connected
            ? { ...provider, lastSync: 'Just now' }
            : provider
        )
      );
      
      toast({
        title: "Sync completed",
        description: "All connected calendars have been synchronized.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendar Integration</h2>
        <p className="text-gray-600">Sync your events with popular calendar applications</p>
      </div>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>Sync Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Automatic Synchronization</h4>
              <p className="text-sm text-gray-600">Automatically sync events when changes are made</p>
            </div>
            <Switch
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={handleSyncNow} variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Sync Now</span>
            </Button>
            <div className="text-sm text-gray-500">
              Last manual sync: Never
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Providers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Connected Calendars</h3>
        
        {calendarProviders.map((provider) => (
          <Card key={provider.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {provider.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{provider.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {provider.connected ? (
                        <>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                          {provider.lastSync && (
                            <span className="text-sm text-gray-500">
                              Last sync: {provider.lastSync}
                            </span>
                          )}
                        </>
                      ) : (
                        <Badge variant="outline">Not connected</Badge>
                      )}
                    </div>
                    {provider.connected && provider.eventsCount !== undefined && (
                      <p className="text-sm text-gray-600 mt-1">
                        {provider.eventsCount} events synchronized
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {provider.connected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(provider.id)}
                      >
                        Disconnect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://${provider.id}.com/calendar`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(provider.id)}
                      size="sm"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle>Synchronization Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">All Systems Operational</h4>
                <p className="text-sm text-green-600">Calendar synchronization is working properly</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <p className="text-sm text-gray-600">Events Synced</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">1</div>
                <p className="text-sm text-gray-600">Connected Calendars</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <p className="text-sm text-gray-600">Sync Errors</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Sync Issues?</h4>
                <p className="text-sm text-gray-600">
                  If events aren't syncing properly, try disconnecting and reconnecting your calendar.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Privacy & Permissions</h4>
                <p className="text-sm text-gray-600">
                  We only sync event details you've created in MeetCheck. Your personal calendar events remain private.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarSync;
