
import { supabase } from './supabase';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  // Auth methods
  async signup(email: string, password: string, full_name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name
        }
      }
    });

    if (error) throw new Error(error.message);
    return { user: data.user, token: data.session?.access_token };
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error(error.message);
    return { user: data.user, token: data.session?.access_token };
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateProfile(updates: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
    return { message: 'Password reset email sent' };
  }

  // Event methods
  async getEvents() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async createEvent(eventData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('events')
      .insert({ ...eventData, user_id: user.id })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getEvent(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateEvent(id: string, updates: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteEvent(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    return { success: true };
  }

  // Participant methods
  async getEventParticipants(eventId: string) {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async createParticipant(eventId: string, participantData: any) {
    const { data, error } = await supabase
      .from('participants')
      .insert({ ...participantData, event_id: eventId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Check-in methods
  async getEventCheckIns(eventId: string) {
    const { data, error } = await supabase
      .from('checkins')
      .select('*, participants(*)')
      .eq('event_id', eventId)
      .order('checked_in_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async checkIn(eventId: string, checkInData: any) {
    const { data, error } = await supabase
      .from('checkins')
      .insert({ ...checkInData, event_id: eventId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Analytics methods
  async getEventAnalytics(eventId: string) {
    // Get basic event data
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError) throw new Error(eventError.message);

    // Get participants count
    const { count: participantsCount, error: participantsError } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (participantsError) throw new Error(participantsError.message);

    // Get check-ins count
    const { count: checkInsCount, error: checkInsError } = await supabase
      .from('checkins')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (checkInsError) throw new Error(checkInsError.message);

    return {
      event,
      totalParticipants: participantsCount || 0,
      totalCheckIns: checkInsCount || 0,
      attendanceRate: participantsCount ? ((checkInsCount || 0) / participantsCount) * 100 : 0
    };
  }
}

export const apiClient = new ApiClient();
