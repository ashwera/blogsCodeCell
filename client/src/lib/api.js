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

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data;
};
