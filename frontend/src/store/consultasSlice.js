// src/store/consultasSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../services/api';

export const crearConsulta = createAsyncThunk(
  'consultas/crear',
  async ({ nombre, email, asunto, mensaje }, { rejectWithValue }) => {
    try {
      return await apiFetch('/consultas', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, asunto, mensaje }),
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchConsultas = createAsyncThunk(
  'consultas/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetch('/consultas');
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const actualizarEstadoConsulta = createAsyncThunk(
  'consultas/actualizarEstado',
  async ({ id, estado }, { rejectWithValue }) => {
    try {
      return await apiFetch(`/consultas/${id}/estado`, {
        method: 'PUT',
        body: JSON.stringify({ estado }),
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  enviando: false,
  error: null,
};

const consultasSlice = createSlice({
  name: 'consultas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(crearConsulta.pending, (state) => {
        state.enviando = true;
        state.error = null;
      })
      .addCase(crearConsulta.fulfilled, (state) => {
        state.enviando = false;
      })
      .addCase(crearConsulta.rejected, (state, action) => {
        state.enviando = false;
        state.error = action.payload;
      })
      .addCase(fetchConsultas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchConsultas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(actualizarEstadoConsulta.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index >= 0) state.items[index] = action.payload;
      });
  },
});

export default consultasSlice.reducer;
