const API_BASE = '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  }

  // Auth methods
  async signup(email: string, password: string, full_name: string) {
    const response = await this.request<{ user: any; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async logout() {
    this.clearToken();
  }

  async getProfile() {
    return this.request<any>('/auth/profile');
  }

  async updateProfile(updates: any) {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async resetPassword(email: string) {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Event methods
  async getEvents() {
    return this.request<any[]>('/events');
  }

  async createEvent(eventData: any) {
    return this.request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getEvent(id: string) {
    return this.request<any>(`/events/${id}`);
  }

  async updateEvent(id: string, updates: any) {
    return this.request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteEvent(id: string) {
    return this.request<any>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Participant methods
  async getEventParticipants(eventId: string) {
    return this.request<any[]>(`/events/${eventId}/participants`);
  }

  async createParticipant(eventId: string, participantData: any) {
    return this.request<any>(`/events/${eventId}/participants`, {
      method: 'POST',
      body: JSON.stringify(participantData),
    });
  }

  // Check-in methods
  async getEventCheckIns(eventId: string) {
    return this.request<any[]>(`/events/${eventId}/checkins`);
  }

  async checkIn(eventId: string, checkInData: any) {
    return this.request<any>(`/events/${eventId}/checkin`, {
      method: 'POST',
      body: JSON.stringify(checkInData),
    });
  }

  // Analytics methods
  async getEventAnalytics(eventId: string) {
    return this.request<any>(`/events/${eventId}/analytics`, {
      method: 'POST',
    });
  }

  // Payment methods
  async initializePayment(paymentData: any) {
    return this.request<any>('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async verifyPayment(reference: string) {
    return this.request<any>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ reference }),
    });
  }
}

export const apiClient = new ApiClient();