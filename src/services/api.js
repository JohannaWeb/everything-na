import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const WS_URL = import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:3001';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Meeting Rooms API
export const getMeetingRooms = async () => {
    const response = await api.get('/meeting-rooms');
    return response.data;
};

export const getMessages = async (roomId) => {
    const response = await api.get(`/meeting-rooms/${roomId}/messages`);
    return response.data;
};

export const sendMessage = async (roomId, content) => {
    const response = await api.post(`/meeting-rooms/${roomId}/messages`, { content });
    return response.data;
};

export const getSharingQueue = async (roomId) => {
    const response = await api.get(`/meeting-rooms/${roomId}/queue`);
    return response.data;
};

export const joinSharingQueue = async (roomId) => {
    const response = await api.post(`/meeting-rooms/${roomId}/queue`);
    return response.data;
};

export const leaveSharingQueue = async (roomId, author) => {
    const response = await api.delete(`/meeting-rooms/${roomId}/queue/${author}`);
    return response.data;
};

// OpenVidu API
export const createSession = async (customSessionId) => {
    const response = await api.post('/openvidu/sessions', { customSessionId });
    return response.data;
};

export const createToken = async (sessionId) => {
    const response = await api.post(`/openvidu/sessions/${sessionId}/connections`, {});
    return response.data;
};

// Just for Today API
export const getDailyReflection = async () => {
    const response = await api.get('/na-daily-reflection');
    return response.data;
};

// WebSocket connection
export const createWebSocketConnection = (token) => {
    return new WebSocket(`${WS_URL}?token=${token}`);
};

export default api;
