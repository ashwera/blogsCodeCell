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
      // In production this calls /api/auth/login
      // For now we mock two users so the UI is fully functional
      await new Promise(r => setTimeout(r, 900));
      const mockUsers = [
        { _id: '1', name: 'Syeda Fatima', email: 'admin@codecell.dev', role: 'admin', token: 'mock-admin-token' },
        { _id: '2', name: 'Ayesha R.',    email: 'ayesha@contributor.dev', role: 'contributor', token: 'mock-contrib-token' },
        { _id: '3', name: 'Bilal K.',     email: 'bilal@contributor.dev',  role: 'contributor', token: 'mock-contrib-token2' },
      ];
      const found = mockUsers.find(u => u.email === email);
      if (!found || password !== 'codecell123') {
        setError('Invalid email or password.');
        setLoading(false);
        return null;
      }
      localStorage.setItem('cc_user', JSON.stringify(found));
      setUser(found);
      setLoading(false);
      return found;
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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
