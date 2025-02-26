// frontend/store/slices/user.slices.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Async Thunk for Google Sign-in (Placeholder - implement actual logic)
export const googleSignInAction = createAsyncThunk(
  "auth/googleSignIn",
  async (_, { rejectWithValue }) => {
    try {
      // ** REPLACE THIS WITH ACTUAL GOOGLE SIGN-IN LOGIC (e.g., Expo AuthSession, Firebase)**
      console.log("Simulating Google Sign-in...");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call delay
      const mockUser = {
        uid: "mockUserId123",
        email: "test@example.com",
        displayName: "Test User",
      }; // Mock user data
      return mockUser;
    } catch (error) {
      console.error("Google Sign-in error:", error);
      return rejectWithValue({
        message: "Google sign-in failed.",
        error: error.message,
      });
    }
  }
);

export const emailPasswordSignUpAction = createAsyncThunk(
  "auth/emailPasswordSignUp",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log("Simulating Email/Password Sign-up...", email);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call delay
      const mockUser = {
        uid: "mockUserId456",
        email: email,
        displayName: "New User",
      }; // Mock user data
      return mockUser;
    } catch (error) {
      console.error("Email/Password Sign-up error:", error);
      return rejectWithValue({
        message: "Email/password sign-up failed.",
        error: error.message,
      });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed (e.g., logout)
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null; // To clear error messages
    },
  },
  extraReducers: (builder) => {
    // --- Google Sign-in ---
    builder.addCase(googleSignInAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(googleSignInAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload; // Store user data in state
    });
    builder.addCase(googleSignInAction.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload; // Store error message
    });

    // --- Email/Password Sign-up ---
    builder.addCase(emailPasswordSignUpAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(emailPasswordSignUpAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(emailPasswordSignUpAction.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    });
  },
});

export const { logout, clearError } = userSlice.actions; // Export sync actions
export const {
  googleSignInAction: googleSignIn, // Export async actions with shorter names for component usage
  emailPasswordSignUpAction: emailPasswordSignUp,
} = userSlice.actions; // Export async actions

export default userSlice.reducer;
