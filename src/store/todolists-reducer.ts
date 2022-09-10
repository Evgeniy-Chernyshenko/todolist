import { v1 } from "uuid";
import { TodolistType } from "../api/todolists-api";

type ActionKeys = keyof typeof todolistsActions;
type ActionType = ReturnType<typeof todolistsActions[ActionKeys]>;

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
};

type TodolistsStateType = TodolistDomainType[];

const initialState: TodolistsStateType = [];

export const todolistsReducer = (
  state = initialState,
  action: ActionType
): TodolistDomainType[] => {
  switch (action.type) {
    case "REMOVE_TODOLIST": {
      return state.filter((v) => v.id !== action.id);
    }

    case "ADD_TODOLIST": {
      return [
        ...state,
        {
          id: action.id,
          title: action.title,
          filter: "all",
          addedDate: "",
          order: 0,
        },
      ];
    }

    case "CHANGE_TODOLIST_TITLE": {
      return state.map((v) =>
        v.id === action.id ? { ...v, title: action.title } : v
      );
    }

    case "CHANGE_TODOLIST_FILTER": {
      return state.map((v) =>
        v.id === action.id ? { ...v, filter: action.filter } : v
      );
    }

    default: {
      return state;
    }
  }
};

export const todolistsActions = {
  removeTodolist: (id: string) => ({ type: "REMOVE_TODOLIST" as const, id }),
  addTodolist: (title: string) => ({
    type: "ADD_TODOLIST" as const,
    id: v1(),
    title,
  }),
  changeTodolistTitle: (id: string, title: string) => ({
    type: "CHANGE_TODOLIST_TITLE" as const,
    id,
    title,
  }),
  changeTodolistFilter: (id: string, filter: FilterValuesType) => ({
    type: "CHANGE_TODOLIST_FILTER" as const,
    id,
    filter,
  }),
};
