"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, getIdToken } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAppDispatch } from '@/hooks/useRedux';
import { setUser, clearUser, setProfile, setAuthReady } from '@/redux/slices/authSlice';
import Cookies from 'js-cookie';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
        // Firestore profile logic
        const userRef = doc(db, 'users', firebaseUser.uid);
        let profile = null;
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            // Auto-create user profile if not exists
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'freelancer', // Default role, or customize as needed
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, newProfile);
            profile = newProfile;
          } else {
            profile = userDoc.data();
            // Convert Firestore Timestamp to ISO string if needed
            if (profile.createdAt && typeof profile.createdAt.toDate === 'function') {
              profile.createdAt = profile.createdAt.toDate().toISOString();
            }
          }
        } catch (e) {
          // ignore profile fetch error
        }
        // Set user and profile separately
        dispatch(setUser(user));
        if (
          profile &&
          typeof profile.uid === 'string' &&
          typeof profile.email === 'string' &&
          typeof profile.name === 'string' &&
          typeof profile.role === 'string'
        ) {
          dispatch(setProfile({
            uid: profile.uid,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            createdAt: profile.createdAt || null,
          }));
        } else {
          dispatch(setProfile(null));
        }
      } else {
        // User is signed out
        Cookies.remove('auth-token');
        dispatch(clearUser());
      }
      // Set authReady to true after first check
      dispatch(setAuthReady(true));
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
