import api from './api';

export interface Tag {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  organizerId: string;
  organizer?: User;
  attendees?: User[];
  tags?: (string | Tag)[];
  interests?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  interests?: string[];
}

export interface CreateEventData {
  title: string;
  description: string;
  location: string;
  date: string;
  tags?: string[];
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  tags?: string[];
}

const EventsService = {
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: CreateEventData): Promise<Event> => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (id: string, data: UpdateEventData): Promise<Event> => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  rsvpToEvent: async (eventId: string): Promise<void> => {
    await api.post(`/events/${eventId}/rsvp`);
  },

  cancelRsvp: async (eventId: string): Promise<void> => {
    await api.delete(`/events/${eventId}/rsvp`);
  },

  getSuggestedAttendees: async (eventId: string): Promise<User[]> => {
    const response = await api.get(`/events/${eventId}/suggested-attendees`);
    return response.data;
  },
};

export default EventsService;