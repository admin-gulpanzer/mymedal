const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiClient {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    try {
      // For development, use a mock token that the backend recognizes
      headers['Authorization'] = 'Bearer demo-token-123';
    } catch (error) {
      console.warn('No auth token available');
    }
    
    return headers;
  }

  async get(endpoint: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async patch(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async delete(endpoint: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const apiClient = new ApiClient();

// API endpoints
export const raceApi = {
  getAllRaces: () => apiClient.get('/api/races'),
  getRace: (id: number) => apiClient.get(`/api/races/${id}`),
  getRaceStats: (id: number) => apiClient.get(`/api/races/${id}/stats`),
};

export const medalApi = {
  getUserMedals: () => apiClient.get('/api/medals'),
  claimMedal: (data: { race_id: number; bib_number: string; full_name: string; notes?: string }) => 
    apiClient.post('/api/medals/claim', data),
  updateMedal: (id: number, data: { notes?: string; medal_image_url?: string }) => 
    apiClient.patch(`/api/medals/${id}`, data),
  deleteMedal: (id: number) => apiClient.delete(`/api/medals/${id}`),
};

export const userApi = {
  getProfile: () => apiClient.get('/api/user/profile'),
  updateProfile: (data: { displayName?: string }) => 
    apiClient.patch('/api/user/profile', data),
};
