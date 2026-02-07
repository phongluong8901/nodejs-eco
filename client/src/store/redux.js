import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice'
import productSlice from './products/productSlice';
import { Product } from '../components';
import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore} from 'redux-persist'
import userSlice from './user/userSlice';


const commonConfig = {
  key: 'shop/user',
  storage
}

const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token']
}

export const store = configureStore({
  reducer: {
    app: appSlice,
    products: productSlice,
    user: persistReducer(userConfig, userSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);