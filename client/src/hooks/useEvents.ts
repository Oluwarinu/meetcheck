import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query keys for cache management
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};

// Custom hook for fetching events with caching
export function useEvents() {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: () => apiClient.getEvents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

// Custom hook for creating events with optimistic updates
export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (eventData: any) => apiClient.createEvent(eventData),
    onMutate: async (newEvent) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: eventKeys.lists() });

      // Snapshot previous value
      const previousEvents = queryClient.getQueryData(eventKeys.lists());

      // Optimistically update cache
      queryClient.setQueryData(eventKeys.lists(), (old: any[]) => {
        return old ? [{ ...newEvent, id: 'temp-' + Date.now() }, ...old] : [newEvent];
      });

      return { previousEvents };
    },
    onError: (err, newEvent, context) => {
      // Rollback on error
      if (context?.previousEvents) {
        queryClient.setQueryData(eventKeys.lists(), context.previousEvents);
      }
      toast({
        title: "Creation Failed",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Event Created",
        description: "Your event has been created successfully.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

// Custom hook for updating events
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      apiClient.updateEvent(id, updates),
    onSuccess: (data, variables) => {
      // Update specific event in cache
      queryClient.setQueryData(eventKeys.detail(variables.id), data);
      
      // Update event in list cache
      queryClient.setQueryData(eventKeys.lists(), (old: any[]) => {
        return old ? old.map((event: any) => 
          event.id === variables.id ? { ...event, ...data } : event
        ) : [];
      });

      toast({
        title: "Event Updated",
        description: "Your event has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update event. Please try again.",
        variant: "destructive"
      });
    },
  });
}

// Custom hook for deleting events
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (eventId: string) => apiClient.deleteEvent(eventId),
    onSuccess: (_, eventId) => {
      // Remove from cache
      queryClient.setQueryData(eventKeys.lists(), (old: any[]) => {
        return old ? old.filter((event: any) => event.id !== eventId) : [];
      });

      toast({
        title: "Event Deleted",
        description: "Your event has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete event. Please try again.",
        variant: "destructive"
      });
    },
  });
}

// Hook for computing dashboard stats from cached events
export function useEventStats() {
  const { data: events = [], isLoading } = useEvents();

  const stats = React.useMemo(() => {
    if (!events.length) {
      return {
        totalEvents: 0,
        activeEvents: 0,
        totalStudents: 0,
        avgAttendance: 0
      };
    }

    const today = new Date();
    const activeEvents = events.filter((event: any) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === today.toDateString();
    }).length;

    const totalStudents = events.reduce((sum: number, event: any) => 
      sum + (event.current_attendees || 0), 0);

    // Calculate average attendance rate
    const eventsWithAttendees = events.filter((event: any) => 
      event.current_attendees && event.capacity);
    const avgAttendance = eventsWithAttendees.length > 0 
      ? Math.round(
          eventsWithAttendees.reduce((sum: number, event: any) => 
            sum + ((event.current_attendees / event.capacity) * 100), 0
          ) / eventsWithAttendees.length
        )
      : 0;

    return {
      totalEvents: events.length,
      activeEvents,
      totalStudents,
      avgAttendance
    };
  }, [events]);

  return { stats, isLoading };
}