import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Define the type for an event based on existing usage if possible.
// For now, using 'any'. This should be refined with actual event type.
interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  capacity?: number;
  checkin_enabled?: boolean;
  checkin_deadline?: string | null;
  current_attendees?: number;
  total_checked_in?: number;
  status?: 'upcoming' | 'today' | 'completed';
  description?: string;
  // Add any other event properties here
}

export const useEventsQuery = () => {
  return useQuery<Event[], Error>({
    queryKey: ['events'],
    queryFn: () => apiClient.getEvents(),
    // You can add other React Query options here, like staleTime, cacheTime, etc.
    // For example, to keep data fresh but avoid too many refetches:
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 15 * 60 * 1000, // 15 minutes
  });
};
