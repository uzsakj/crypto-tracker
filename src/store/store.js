import { configureStore } from '@reduxjs/toolkit';
import { coinGeckoApi } from './coinGeckoApi';

export const store = configureStore({
    reducer: {
        [coinGeckoApi.reducerPath]: coinGeckoApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(coinGeckoApi.middleware),
});
