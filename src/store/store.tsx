import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "./auth-reducer";
import { tasksReducer } from "./tasks-reducer";
import { todolistsReducer } from "./todolists-reducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(thunkMiddleware),
});

// @ts-ignore
window.store = store;

export type RootStateType = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type RootReducerType = typeof rootReducer;
