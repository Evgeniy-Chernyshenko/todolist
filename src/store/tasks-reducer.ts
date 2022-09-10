import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses, TaskType } from "../api/todolists-api";
import { todolistsActions } from "./todolists-reducer";

type ActionKeys = keyof typeof tasksActions;
type ActionType =
  | ReturnType<typeof tasksActions[ActionKeys]>
  | ReturnType<typeof todolistsActions.removeTodolist>
  | ReturnType<typeof todolistsActions.addTodolist>;

export type TasksStateType = { [key: string]: TaskType[] };

const initialState: TasksStateType = {};

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
          {
            id: action.id,
            status: TaskStatuses.New,
            title: action.title,
            addedDate: "",
            deadline: "",
            description: "",
            order: 0,
            priority: TaskPriorities.Low,
            startDate: "",
            todoListId: action.todolistId,
          },
        ],
      };
    }

    case "CHANGE_TASK_STATUS":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((v) =>
          v.id === action.id ? { ...v, status: action.status } : v
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
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => ({
    type: "CHANGE_TASK_STATUS" as const,
    id,
    status,
    todolistId,
  }),
  changeTaskTitle: (id: string, title: string, todolistId: string) => ({
    type: "CHANGE_TASK_TITLE" as const,
    id,
    title,
    todolistId,
  }),
};
