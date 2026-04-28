import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, getIdTokenResult } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const tokenResult = await getIdTokenResult(currentUser);
          const role = tokenResult?.claims?.admin ? 'admin' : 'contributor';
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            role
          });
        } catch (err) {
          console.error('Failed to fetch custom claims:', err);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            role: 'contributor'
          });
        }
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
