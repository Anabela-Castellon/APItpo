import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, getRolesFromToken } from '../services/api';

// Thunk async: llama a POST /api/auth/login y devuelve el JWT recibido
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, ['contrase\u00f1a']: password }),
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  token: localStorage.getItem('token') || null,
  isLoggedIn: !!localStorage.getItem('token'),
  roles: getRolesFromToken(localStorage.getItem('token')),
  loading: false,
  error: null,
};

// Slice de autenticación: guarda el token JWT, si hay sesión activa y los roles del usuario
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Cierra sesión (limpia token, flag y roles)
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.roles = [];
    },
    // Guarda un token recibido fuera del thunk de login (ej: justo después de registrarse)
    setCredentials: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
      state.roles = getRolesFromToken(action.payload);
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
        state.token = action.payload;
        state.isLoggedIn = true;
        state.roles = getRolesFromToken(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
