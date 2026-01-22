// na-app-react/src/services/auth.js

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return { user: { username }, token: data.token };
};

export const registerUser = async (username, password) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  // After registration, automatically log in to get token
  return await loginUser(username, password);
};
