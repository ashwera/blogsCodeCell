import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Invalid email or password.');
        setLoading(false);
        return null;
      }
      
      localStorage.setItem('cc_user', JSON.stringify(data));
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_user');
    setUser(null);
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'contributor' })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Error creating account.');
        setLoading(false);
        return null;
      }
      
      localStorage.setItem('cc_user', JSON.stringify(data));
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
