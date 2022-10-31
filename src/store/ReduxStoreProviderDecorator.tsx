import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { combineReducers } from "redux";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses } from "../api/todolists-api";
import { appReducer } from "./app-reducer";
import { authReducer } from "./auth-reducer";
import { RootReducerType, RootStateType } from "./store";
import { tasksReducer } from "./tasks-reducer";
import { todolistsReducer } from "./todolists-reducer";
import thunkMiddleware from "redux-thunk";

const rootReducer: RootReducerType = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

const initialGlobalState: RootStateType = {
  todolists: [],
  tasks: {},
  app: { isInitialize: false, errorMessage: null, isLoading: false },
  auth: {
    id: null,
    email: null,
    login: null,
  },
};

export const decoratorStore = configureStore({
  reducer: rootReducer,
  preloadedState: initialGlobalState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(thunkMiddleware),
});

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={decoratorStore}>{storyFn()}</Provider>;
};
