import { createSlice } from '@reduxjs/toolkit';

// Intentamos cargar los favoritos guardados en el navegador
const initialState = {
    items: JSON.parse(localStorage.getItem('favoritos')) || [],
};

// Slice de favoritos: no depende del backend, se persiste directo en localStorage
const favoritosSlice = createSlice({
    name: 'favoritos',
    initialState,
    reducers: {
        // Agrega o quita un producto de favoritos según si ya estaba en la lista
        toggleFavorito: (state, action) => {
            const producto = action.payload;
            const existe = state.items.find(item => item.id === producto.id);

            if (existe) {
                // Si ya existe, lo removemos (quitar favorito)
                state.items = state.items.filter(item => item.id !== producto.id);
            } else {
                // Si no existe, lo agregamos (sumar favorito)
                state.items.push(producto);
            }

            // Guardamos la lista actualizada en localStorage
            localStorage.setItem('favoritos', JSON.stringify(state.items));
        },
    },
});

export const { toggleFavorito } = favoritosSlice.actions;
export default favoritosSlice.reducer;