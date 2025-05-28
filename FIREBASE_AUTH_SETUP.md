# Firebase Authentication Setup

This project uses Firebase Authentication with Redux for state management. Follow these steps to set up Firebase auth:

## Prerequisites

1. Node.js installed
2. A Firebase project set up at https://console.firebase.google.com/

## Setup Instructions

### 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
4. Get your Firebase configuration:
   - Go to Project settings > General
   - Scroll down to "Your apps" section
   - If no web app exists, click "Add app" and choose web
   - Copy the Firebase config object

### 2. Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase configuration in `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### 3. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Features Implemented

### ✅ Firebase Authentication
- Email/password registration
- Email/password login
- User session persistence
- Automatic logout

### ✅ Redux Integration
- Centralized auth state management
- Loading and error states
- Async thunks for auth operations

### ✅ Route Protection
- Protected dashboard routes
- Redirect authenticated users from auth pages
- Loading states during auth checks

### ✅ UI Components
- Professional login/register forms
- Form validation with Zod
- Error handling and display
- User dropdown menu with logout

## File Structure

```
src/
├── lib/
│   └── firebase.ts              # Firebase configuration
├── redux/
│   ├── store.ts                 # Redux store configuration
│   └── slices/
│       └── authSlice.ts         # Authentication slice
├── hooks/
│   ├── useAuth.ts               # Authentication hook
│   └── useRedux.ts              # Redux hooks
├── providers/
│   └── auth-provider.tsx        # Firebase auth state provider
├── components/
│   ├── forms/
│   │   ├── login-form.tsx       # Login form component
│   │   └── register-form.tsx    # Registration form component
│   └── shared/
│       ├── protected-route.tsx  # Route protection component
│       ├── auth-redirect.tsx    # Auth redirect component
│       └── dashboard-header.tsx # Header with user menu
└── app/
    ├── providers.tsx            # App providers
    ├── auth/                    # Authentication pages
    └── dashboard/               # Protected dashboard pages
```

## Usage

### 1. Authentication Forms
The login and register forms are located at:
- `/auth/login` - Login form
- `/auth/register` - Registration form

### 2. Using the Auth Hook
```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, error, login, register, signOut } = useAuth();

  // Use the auth state and methods
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={signOut}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### 3. Protecting Routes
Routes are automatically protected using the layout components:
- Dashboard routes are protected via `dashboard/layout.tsx`
- Auth routes redirect logged-in users via `auth/layout.tsx`

## Firebase Rules

For security, make sure to set up appropriate Firestore security rules if you plan to use Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

1. **Firebase not configured**: Make sure your `.env.local` file exists and contains valid Firebase config
2. **Auth not persisting**: Check that the `AuthProvider` is wrapped around your app in `providers.tsx`
3. **Routes not protecting**: Ensure the `ProtectedRoute` component is used in dashboard layout
4. **Build errors**: Make sure all environment variables are prefixed with `NEXT_PUBLIC_`
