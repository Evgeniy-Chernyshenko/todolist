import { Provider } from "react-redux";
import { combineReducers, legacy_createStore } from "redux";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses } from "../api/todolists-api";
import { RootStateType } from "./store";
import { tasksReducer } from "./tasks-reducer";
import { todolistsReducer } from "./todolists-reducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});

const initialGlobalState: RootStateType = {
  todolists: [
    {
      id: "todolist1Id",
      filter: "all",
      title: "Todolist 1",
      addedDate: "",
      order: 0,
      isLoading: false,
    },
    {
      id: "todolist2Id",
      filter: "all",
      title: "Todolist 2",
      addedDate: "",
      order: 0,
      isLoading: false,
    },
  ],
  tasks: {
    todolist1Id: [
      {
        id: v1(),
        status: TaskStatuses.New,
        title: "Task 1",
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolist1Id",
        isLoading: false,
      },
      {
        id: v1(),
        status: TaskStatuses.New,
        title: "Task 2",
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolist1Id",
        isLoading: false,
      },
    ],
    todolist2Id: [
      {
        id: v1(),
        status: TaskStatuses.New,
        title: "Task 3",
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolist1Id",
        isLoading: false,
      },
      {
        id: v1(),
        status: TaskStatuses.New,
        title: "Task 4",
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolist1Id",
        isLoading: false,
      },
    ],
  },
  app: { errorMessage: null, isLoading: false },
};

export const decoratorStore = legacy_createStore(
  rootReducer,
  initialGlobalState
);

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={decoratorStore}>{storyFn()}</Provider>;
};
