import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle common response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const requestUrl = error.config?.url || '';
      const isAuthRoute = requestUrl.includes('/auth/');

      if (error.response.status === 401 && !isAuthRoute) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('hosteljugaad_user');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      }
    } else if (error.request) {
      error.message = 'Network error — server is unreachable. Please try again later.';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH APIs ============
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// ============ ITEM/MARKETPLACE APIs ============
export const itemAPI = {
  // Items ko fetch karne ke liye
  getItems: (category = 'All', search = '') => {
    return api.get('/items', {
      params: {
        category: category !== 'All' ? category : undefined,
        search: search || undefined,
      },
    });
  },

  // Ek item ko fetch karne ke liye
  getItemById: (id) => api.get(`/items/${id}`),

  // Naya item add karne ke liye
  addItem: (itemData, imageFile) => {
    const formData = new FormData();
    formData.append('title', itemData.title);
    formData.append('description', itemData.description);
    formData.append('category', itemData.category);
    formData.append('price', itemData.price);
    formData.append('originalPrice', itemData.originalPrice);
    formData.append('condition', itemData.condition);
    formData.append('sellerId', itemData.sellerId);
    formData.append('sellerName', itemData.sellerName);
    formData.append('sellerContact', itemData.sellerContact);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Item ko sold mark karne ke liye
  markAsSold: (id, userId) => api.put(`/items/${id}/sold`, { userId }),

  // Item delete karne ke liye
  deleteItem: (id, userId) => api.delete(`/items/${id}`, { data: { userId } }),
};

// ============ PYQ APIs ============
export const pyqAPI = {
  // Saare PYQs fetch karne ke liye
  getPYQs: () => api.get('/pyqs'),

  // Naya PYQ upload karne ke liye
  uploadPYQ: (pyqData, file) => {
    const formData = new FormData();
    formData.append('subject', pyqData.subject);
    formData.append('code', pyqData.code);
    formData.append('examType', pyqData.examType);
    formData.append('year', pyqData.year);
    formData.append('uploaderId', pyqData.uploaderId);
    
    if (file) {
      formData.append('file', file);
    }

    return api.post('/pyqs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
