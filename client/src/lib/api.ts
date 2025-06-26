const API_BASE_URL = '/api';

interface LoginResponse {
  user: any;
  token: string;
}

interface SignupResponse {
  user: any;
  token: string;
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(email: string, password: string, fullName: string): Promise<SignupResponse> {
    return this.request<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
  }

  async getProfile(): Promise<any> {
    return this.request<any>('/auth/profile');
  }

  async updateProfile(updates: any): Promise<any> {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async resetPassword(email: string): Promise<any> {
    return this.request<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getEvents(): Promise<any[]> {
    return this.request<any[]>('/events');
  }

  async createEvent(eventData: any): Promise<any> {
    return this.request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(eventId: string, updates: any): Promise<any> {
    return this.request<any>(`/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async getEvent(id: string): Promise<any> {
    return this.request<any>(`/events/${id}`);
  }

  async updateEvent(id: string, updates: any): Promise<any> {
    return this.request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteEvent(id: string): Promise<any> {
    return this.request<any>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async getEventParticipants(eventId: string): Promise<any[]> {
    return this.request<any[]>(`/events/${eventId}/participants`);
  }

  async getEventCheckIns(eventId: string): Promise<any[]> {
    return this.request<any[]>(`/events/${eventId}/checkins`);
  }

  async getEventAnalytics(eventId: string): Promise<any> {
    return this.request<any>(`/events/${eventId}/analytics`);
  }

  async getPublicEvent(id: string): Promise<any> {
    return this.request<any>(`/public/events/${id}`);
  }

  async submitPublicCheckIn(eventId: string, checkInData: any): Promise<any> {
    return this.request<any>(`/public/events/${eventId}/checkin`, {
      method: 'POST',
      body: JSON.stringify(checkInData),
    });
  }

  async getSubscription(): Promise<any> {
    return this.request<any>('/subscription');
  }

  async updateSubscription(updates: any): Promise<any> {
    return this.request<any>('/subscription', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getEventTemplates(): Promise<any[]> {
    return this.request<any[]>('/event-templates');
  }

  async createEventTemplate(templateData: any): Promise<any> {
    return this.request<any>('/event-templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }
}

export const apiClient = new ApiClient();