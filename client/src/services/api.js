  import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

export const magazineService = {
  getAll: (params) => api.get('/magazines', { params }),
  getById: (id) => api.get(`/magazines/${id}`),
  getFeatured: () => api.get('/magazines/featured'),
  getTrending: () => api.get('/magazines/trending'),
  search: (query) => api.get(`/magazines/search?q=${query}`)
};

export const articleService = {
  getByMagazine: (magazineId) => api.get(`/articles/magazine/${magazineId}`),
  likeArticle: (id) => api.put(`/articles/like/${id}`),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getSubscriptions: () => api.get('/users/subscriptions'),
  subscribe: (magazineId) => api.put(`/users/subscribe/${magazineId}`),
  getLiked: () => api.get('/users/liked'),
  getHistory: () => api.get('/users/history'),
  addToHistory: (articleId) => api.put(`/users/history/${articleId}`),
  removeFromHistory: (articleId) => api.delete(`/users/history/${articleId}`),
  getBookmarks: () => api.get('/users/bookmarks'),
  bookmarkArticle: (id) => api.put(`/users/bookmark/${id}`)
};

export default api;
