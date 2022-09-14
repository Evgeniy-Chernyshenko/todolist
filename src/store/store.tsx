import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TasksActionType, tasksReducer } from "./tasks-reducer";
import { TodolistActionType, todolistsReducer } from "./todolists-reducer";

export type AppStateType = ReturnType<typeof store.getState>;

type AppActionsType = TodolistActionType | TasksActionType;

export type AppDispatch = ThunkDispatch<AppStateType, unknown, AppActionsType>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppStateType,
  unknown,
  AppActionsType
>;

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.store = store;
