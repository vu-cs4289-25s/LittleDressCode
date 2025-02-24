import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer } from "redux-persist";

//? Reducers
import userReducer from "./slices/user.slices";

import apiSlice from "@/services/api";

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const userPersistedReducer = persistReducer(persistConfig, userReducer);

//? Actions
export * from "./slices/user.slices";

export const store = configureStore({
  reducer: {
    user: userPersistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
