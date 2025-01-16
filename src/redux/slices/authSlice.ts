import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await fetch('https://json-server-production-ac12.up.railway.app/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    const users = await response.json();

    const user = users.find(
      (u: any) => u.email === credentials.email && u.password === credentials.password
    );
    if (!user) throw new Error('Invalid email or password');

    // Generate token (mock)
    const token = Math.random().toString(36).substring(2);
    const expiresAt = Date.now() + 20 * 60 * 1000; // 20 minutes

    // Save token in db.json
    const saveTokenResponse = await fetch('https://json-server-production-ac12.up.railway.app/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userId: user.id, expiresAt }),
    });
    if (!saveTokenResponse.ok) throw new Error('Failed to save token');

    return { user, token, expiresAt };
  }
);

// Refresh token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    const currentToken = state.auth.token;
    if (!currentToken) throw new Error('Login Required');

    const response = await fetch('https://json-server-production-ac12.up.railway.app/tokens');
    if (!response.ok) throw new Error('Failed to fetch tokens');
    const tokens = await response.json();

    const tokenData = tokens.find((t: any) => t.token === currentToken);
    if (!tokenData) throw new Error('Session expired. Please log in again.');

    if (tokenData.expiresAt < Date.now()) {
      // Generate a new token
      const newToken = Math.random().toString(36).substring(2);
      const newExpiresAt = Date.now() + 20 * 60 * 1000; // 20 minutes

      const updateTokenResponse = await fetch(`https://json-server-production-ac12.up.railway.app/tokens/${tokenData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: newToken, expiresAt: newExpiresAt }),
      });
      if (!updateTokenResponse.ok) throw new Error('Failed to refresh token');

      return { token: newToken, expiresAt: newExpiresAt };
    }

    return { token: currentToken, expiresAt: tokenData.expiresAt };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.error.message || 'Session expired. Please log in again.';
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
