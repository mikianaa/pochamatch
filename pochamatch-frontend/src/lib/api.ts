import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  email: string;
  nickname: string;
  created_at: string;
  profile_completed: boolean;
  profile?: Profile;
}

export interface Profile {
  user_id: number;
  nickname: string;
  birthdate?: string;
  prefecture?: string;
  hometown?: string;
  education?: string;
  occupation?: string;
  income?: string;
  body_type?: string;
  height?: number;
  personality?: string[];
  sociability?: string;
  mbti?: string;
  holiday?: string;
  smoking?: string;
  drinking?: string;
  hobbies?: string;
  roommate?: string;
  date_cost?: string;
  meeting_preference?: string;
  marriage_intention?: string;
  want_children?: string;
  housework?: string;
  marital_status?: string;
  bio?: string;
  photo_url?: string;
  verified: boolean;
  age?: number;
}

export interface Match {
  match_id: number;
  created_at: string;
  user: User;
}

export interface Message {
  id: number;
  match_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface Stats {
  remaining_likes: number;
  likes_sent: number;
  likes_received: number;
  matches: number;
  verified: boolean;
  premium: boolean;
}

export const authAPI = {
  signup: async (email: string, password: string, nickname: string) => {
    const response = await api.post('/api/auth/signup', { email, password, nickname });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },
};

export const userAPI = {
  getUsers: async (filters?: { body_type?: string; prefecture?: string; show_no_icon?: boolean }) => {
    const response = await api.get<User[]>('/api/users', { params: filters });
    return response.data;
  },
  getUser: async (userId: number) => {
    const response = await api.get<User>(`/api/users/${userId}`);
    return response.data;
  },
};

export const profileAPI = {
  getMyProfile: async () => {
    const response = await api.get<Profile>('/api/profile');
    return response.data;
  },
  updateProfile: async (profileData: Partial<Profile>) => {
    const response = await api.put<Profile>('/api/profile', profileData);
    return response.data;
  },
};

export const likeAPI = {
  createLike: async (targetUserId: number) => {
    const response = await api.post('/api/likes', { target_user_id: targetUserId });
    return response.data;
  },
  getSentLikes: async () => {
    const response = await api.get<User[]>('/api/likes/sent');
    return response.data;
  },
  getReceivedLikes: async () => {
    const response = await api.get<User[]>('/api/likes/received');
    return response.data;
  },
};

export const matchAPI = {
  getMatches: async () => {
    const response = await api.get<Match[]>('/api/matches');
    return response.data;
  },
  getMessages: async (matchId: number) => {
    const response = await api.get<Message[]>(`/api/matches/${matchId}/messages`);
    return response.data;
  },
  sendMessage: async (matchId: number, content: string) => {
    const response = await api.post<Message>(`/api/matches/${matchId}/messages`, { content });
    return response.data;
  },
};

export const statsAPI = {
  getStats: async () => {
    const response = await api.get<Stats>('/api/stats');
    return response.data;
  },
};

export default api;
