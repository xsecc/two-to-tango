import api from './api';
import { jwtDecode } from 'jwt-decode';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  interestIds?: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface DecodedToken {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

const AuthService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    const { access_token, user } = response.data;
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', access_token);
    }
    
    return response.data;
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('token');
  },

  getUserId: (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.sub;
    } catch (error) {
      return null;
    }
  },
};

export default AuthService;