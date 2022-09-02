import { v1 } from "uuid";
import {
  // todolist1Id,
  // todolist2Id,
  todolistsActions,
} from "./todolists-reducer";

type ActionKeys = keyof typeof tasksActions;
type ActionType =
  | ReturnType<typeof tasksActions[ActionKeys]>
  | ReturnType<typeof todolistsActions.removeTodolist>
  | ReturnType<typeof todolistsActions.addTodolist>;

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

export type TasksStateType = { [key: string]: TaskType[] };

const initialState: TasksStateType = {
  // [todolist1Id]: [
  //   { id: v1(), title: "HTML", isDone: true },
  //   { id: v1(), title: "CSS", isDone: true },
  //   { id: v1(), title: "JS", isDone: true },
  //   { id: v1(), title: "React", isDone: false },
  // ],
  // [todolist2Id]: [
  //   { id: v1(), title: "Bread", isDone: true },
  //   { id: v1(), title: "Laptop", isDone: true },
  //   { id: v1(), title: "Milk", isDone: false },
  // ],
};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionType
): TasksStateType => {
  switch (action.type) {
    case "REMOVE_TASK": {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (v) => v.id !== action.id
        ),
      };
    }

    case "ADD_TASK": {
      return {
        ...state,
        [action.todolistId]: [
          ...state[action.todolistId],
          { id: action.id, isDone: false, title: action.title },
        ],
      };
    }

    case "CHANGE_TASK_STATUS":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((v) =>
          v.id === action.id ? { ...v, isDone: action.isDone } : v
        ),
      };

    case "CHANGE_TASK_TITLE":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((v) =>
          v.id === action.id ? { ...v, title: action.title } : v
        ),
      };

    case "ADD_TODOLIST": {
      return { ...state, [action.id]: [] };
    }

    case "REMOVE_TODOLIST": {
      const stateCopy = { ...state };
      delete stateCopy[action.id];
      return stateCopy;
    }

    default:
      return state;
  }
};

export const tasksActions = {
  removeTask: (id: string, todolistId: string) => ({
    type: "REMOVE_TASK" as const,
    id,
    todolistId,
  }),
  addTask: (title: string, todolistId: string) => ({
    type: "ADD_TASK" as const,
    id: v1(),
    title,
    todolistId,
  }),
  changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => ({
    type: "CHANGE_TASK_STATUS" as const,
    id,
    isDone,
    todolistId,
  }),
  changeTaskTitle: (id: string, title: string, todolistId: string) => ({
    type: "CHANGE_TASK_TITLE" as const,
    id,
    title,
    todolistId,
  }),
};
