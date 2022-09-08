import { Provider } from "react-redux";
import { combineReducers, legacy_createStore } from "redux";
import { v1 } from "uuid";
import { AppStateType } from "./store";
import { tasksReducer } from "./tasks-reducer";
import { todolistsReducer } from "./todolists-reducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});

const initialGlobalState: AppStateType = {
  todolists: [
    { id: "todolist1Id", filter: "all", title: "Todolist 1" },
    { id: "todolist2Id", filter: "all", title: "Todolist 2" },
  ],
  tasks: {
    todolist1Id: [
      { id: v1(), isDone: false, title: "Task 1" },
      { id: v1(), isDone: false, title: "Task 2" },
    ],
    todolist2Id: [
      { id: v1(), isDone: false, title: "Task 3" },
      { id: v1(), isDone: false, title: "Task 4" },
    ],
  },
};

export const decoratorStore = legacy_createStore(
  rootReducer,
  initialGlobalState
);

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={decoratorStore}>{storyFn()}</Provider>;
};
