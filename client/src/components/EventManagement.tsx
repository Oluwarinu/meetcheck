import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { Settings, Trash2, Calendar, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  checkin_enabled: boolean;
  checkin_deadline: string | null;
}

interface EventManagementProps {
  event: Event;
  onEventUpdate: (updatedEvent: Event) => void;
  onEventDelete: (eventId: string) => void;
}

export function EventManagement({ event, onEventUpdate, onEventDelete }: EventManagementProps) {
  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [checkinEnabled, setCheckinEnabled] = useState(event.checkin_enabled);
  const [checkinDeadline, setCheckinDeadline] = useState(
    event.checkin_deadline ? new Date(event.checkin_deadline).toISOString().slice(0, 16) : ''
  );

  const handleUpdateSettings = async () => {
    try {
      const updates = {
        checkin_enabled: checkinEnabled,
        checkin_deadline: checkinDeadline ? new Date(checkinDeadline).toISOString() : null
      };

      const updatedEvent = await apiClient.updateEvent(event.id, updates);
      
      onEventUpdate(updatedEvent);
      setIsSettingsOpen(false);
      
      toast({
        title: "Settings Updated",
        description: "Event check-in settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update event settings.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    try {
      await apiClient.deleteEvent(event.id);
      onEventDelete(event.id);
      
      toast({
        title: "Event Deleted",
        description: "The event has been permanently deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete event.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Event Check-in Settings</DialogTitle>
            <DialogDescription>
              Manage check-in availability and deadline for {event.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Check-in Enable/Disable */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Check-in</Label>
                <div className="text-sm text-muted-foreground">
                  Allow participants to check in using QR code
                </div>
              </div>
              <Switch
                checked={checkinEnabled}
                onCheckedChange={setCheckinEnabled}
              />
            </div>

            {/* Check-in Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Check-in Deadline</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Set when the QR code will stop working (optional)
              </div>
              <div className="relative">
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={checkinDeadline}
                  onChange={(e) => setCheckinDeadline(e.target.value)}
                  disabled={!checkinEnabled}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {checkinDeadline && (
                <div className="text-sm text-muted-foreground">
                  QR code will expire: {new Date(checkinDeadline).toLocaleString()}
                </div>
              )}
            </div>

            {/* Current Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Status</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${checkinEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                    Check-in is {checkinEnabled ? 'enabled' : 'disabled'}
                  </div>
                  {checkinEnabled && checkinDeadline && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Expires {new Date(checkinDeadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone and will permanently remove:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All participant registrations</li>
                <li>All check-in records</li>
                <li>Event analytics data</li>
                <li>QR codes</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Event'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}