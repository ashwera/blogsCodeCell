import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Map firebase user and inject a default role so the Nav works
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          role: 'admin' // Granting admin role to all authenticated users for now
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // user state is updated via onAuthStateChanged
      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
      setLoading(false);
      return null;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };
  
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      console.error(err);
      setError('Failed to send reset email.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, resetPassword, loading, error, setError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
