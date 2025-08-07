import api from './api';

export interface Interest {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const InterestsService = {
  getAllInterests: async (): Promise<Interest[]> => {
    const response = await api.get('/interests');
    return response.data;
  },

  getInterestById: async (id: string): Promise<Interest> => {
    const response = await api.get(`/interests/${id}`);
    return response.data;
  },

  createInterest: async (name: string): Promise<Interest> => {
    const response = await api.post('/interests', { name });
    return response.data;
  },
};

export default InterestsService;