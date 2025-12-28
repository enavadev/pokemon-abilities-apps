import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:18081'
    : `http://${window.location.hostname}:18081`);

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  tokenaccess: string;
  expiration: string;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/api/v1/auth`,
      { username, password } as LoginRequest,
    );
    return response.data;
  },
};

