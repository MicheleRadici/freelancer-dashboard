import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import Cookies from 'js-cookie';

// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: string;
  createdAt?: any;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authReady: boolean; // <-- add this
}

// Initial state
const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authReady: false, // <-- add this
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Fetch Firestore profile
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const profile = userDoc.exists() ? userDoc.data() : null;
      
      return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        profile,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed. Please check your credentials.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password, role }: { name: string; email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: name });
      
      // Save additional user info in Firestore
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name,
        role,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      
      return {
        id: firebaseUser.uid,
        name: name,
        email: firebaseUser.email || '',
        profile,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed. Please try again.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      // Remove auth token cookie on logout
      Cookies.remove('auth-token');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed.');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
    },
    setAuthReady: (state, action: PayloadAction<boolean>) => {
      state.authReady = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
        };
        state.profile = action.payload.profile || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register cases
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
        };
        state.profile = action.payload.profile || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout cases
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.profile = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setUser, setProfile, clearUser, setAuthReady } = authSlice.actions;
export default authSlice.reducer;
