import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  interests?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  interestIds?: string[];
}

const UsersService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
};

export default UsersService;