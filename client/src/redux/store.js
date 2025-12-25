import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Fallbacks for environments where the imported `storage` doesn't expose getItem/setItem
const noopStorage = {
  getItem: (_key) => Promise.resolve(null),
  setItem: (_key, _value) => Promise.resolve(),
  removeItem: (_key) => Promise.resolve(),
};

const createLocalStorageWrapper = () => ({
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
});

const storageEngine =
  storage && typeof storage.getItem === 'function'
    ? storage
    : typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
    ? createLocalStorageWrapper()
    : noopStorage;

const rootReducer = combineReducers({ user: userReducer });

const persistConfig = {
  key: 'root',
  storage: storageEngine,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);