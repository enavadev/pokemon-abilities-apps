import axios from 'axios';
import { apiConfig } from '../config/apiConfig';

const API_BASE_URL = apiConfig.apiUrl;

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




