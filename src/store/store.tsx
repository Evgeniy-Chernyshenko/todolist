import { combineReducers, createStore } from "redux";
import { tasksReducer } from "./tasks-reducer";
import { todolistsReducer } from "./todolists-reducer";

export type AppStateType = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});

export const store = createStore(rootReducer);

// @ts-ignore
window.store = store;
