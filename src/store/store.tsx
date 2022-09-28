import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AppActionType, appReducer } from "./app-reducer";
import { TasksActionType, tasksReducer } from "./tasks-reducer";
import { TodolistActionType, todolistsReducer } from "./todolists-reducer";

export type RootStateType = ReturnType<typeof store.getState>;

export type InferActionTypes<T> = T extends {
  [keys: string]: (...args: any[]) => infer U;
}
  ? U
  : never;

type AppActionsType = TodolistActionType | TasksActionType | AppActionType;

export type AppDispatch = ThunkDispatch<RootStateType, unknown, AppActionsType>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootStateType,
  unknown,
  AppActionsType
>;

export type AppThunks = { [key: string]: (...args: any) => AppThunk };

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.store = store;
