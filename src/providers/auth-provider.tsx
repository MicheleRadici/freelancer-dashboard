"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, getIdToken } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAppDispatch } from '@/hooks/useRedux';
import { setUser, clearUser } from '@/redux/slices/authSlice';
import Cookies from 'js-cookie';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  // Context can be extended in the future if needed
}

const AuthContext = createContext<AuthContextType>({});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in
        const user = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
        };
        // Get Firebase ID token and set cookie
        const token = await getIdToken(firebaseUser);
        Cookies.set('auth-token', token, { expires: 1 });
        // Fetch Firestore profile
        let profile = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          profile = userDoc.exists() ? userDoc.data() : null;
        } catch (e) {
          // ignore profile fetch error
        }
        // Set user and profile separately
        dispatch({ type: 'auth/setUser', payload: user });
        dispatch({ type: 'auth/profile', payload: profile });
      } else {
        // User is signed out
        Cookies.remove('auth-token');
        dispatch(clearUser());
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
