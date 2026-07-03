// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../services/api';

// ID de carrito del usuario logueado (ajustar según tu lógica de auth)
const getCarritoId = () => localStorage.getItem('carritoId') || 1;

// GET /api/carritos/{id}
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetch(`/carritos/${getCarritoId()}`);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST /api/carritos/{id}/productos/{productoId}?cantidad=1
export const addProductoToCart = createAsyncThunk(
  'cart/addProducto',
  async ({ productoId, cantidad = 1 }, { rejectWithValue }) => {
    try {
      return await apiFetch(
        `/carritos/${getCarritoId()}/productos/${productoId}?cantidad=${cantidad}`,
        { method: 'POST' }
      );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE /api/carritos/{id}/productos/{productoId}
export const removeProductoFromCart = createAsyncThunk(
  'cart/removeProducto',
  async (productoId, { rejectWithValue }) => {
    try {
      return await apiFetch(
        `/carritos/${getCarritoId()}/productos/${productoId}`,
        { method: 'DELETE' }
      );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST /api/carritos/{id}/checkout
export const checkoutCart = createAsyncThunk(
  'cart/checkout',
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetch(`/carritos/${getCarritoId()}/checkout`, { method: 'POST' });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE /api/carritos/{id}/vaciar
export const clearCartApi = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetch(`/carritos/${getCarritoId()}/vaciar`, { method: 'DELETE' });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],       // productos del carrito (ItemCarrito[])
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.productos || [];
        state.total = action.payload?.precioTotal || 0;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addProductoToCart
      .addCase(addProductoToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductoToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.productos || [];
        state.total = action.payload?.precioTotal || 0;
      })
      .addCase(addProductoToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // removeProductoFromCart
      .addCase(removeProductoFromCart.fulfilled, (state, action) => {
        state.items = action.payload?.productos || [];
        state.total = action.payload?.precioTotal || 0;
      })
      // clearCartApi
      .addCase(clearCartApi.fulfilled, (state, action) => {
        state.items = action.payload?.productos || [];
        state.total = action.payload?.precioTotal || 0;
      })
      // checkoutCart
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
