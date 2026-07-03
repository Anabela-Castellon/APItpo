import { configureStore } from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from 'redux-persist';
import webStorage from 'redux-persist/lib/storage';
import favoritosReducer from './favoritosSlice';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import productosReducer from './productsSlice';
import consultasReducer from './consultasSlice';

const authPersistConfig = {
    key: 'auth',
    storage: webStorage.default || webStorage,
    whitelist: ['token', 'isLoggedIn'],
};

const syncTokenWithLocalStorage = (storeApi) => (next) => (action) => {
    const result = next(action);
    const token = storeApi.getState().auth.token;

    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }

    return result;
};

const store = configureStore({
    reducer: {
        favoritos: favoritosReducer,
        cart: cartReducer,
        auth: persistReducer(authPersistConfig, authReducer),
        productos: productosReducer,
        consultas: consultasReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(syncTokenWithLocalStorage),
});

export const persistor = persistStore(store);
export default store;
