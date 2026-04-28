export const getAuthToken = () => {
  try {
    const saved = localStorage.getItem('cc_user');
    if (saved) {
      const user = JSON.parse(saved);
      return user.token;
    }
  } catch (e) {}
  return null;
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Use ngrok URL as base for API requests
  const BASE_URL = 'https://kisha-volcanologic-motherly.ngrok-free.dev/api';
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data;
};
