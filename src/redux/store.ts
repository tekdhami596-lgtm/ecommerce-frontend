import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import themeReducer from "./slice/themeSlice";
import cartReducer from "./slice/cartSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    cart:cartReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
