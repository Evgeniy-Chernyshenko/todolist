import { v1 } from "uuid";
import { TasksStateType } from "../App";
import { actions as todolistsActions } from "./todolists-reducer";

type ActionKeys = keyof typeof actions;
type ActionType =
  | ReturnType<typeof actions[ActionKeys]>
  | ReturnType<typeof todolistsActions.removeTodolist>
  | ReturnType<typeof todolistsActions.addTodolist>;

export const tasksReducer = (
  state: TasksStateType,
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

export const actions = {
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
