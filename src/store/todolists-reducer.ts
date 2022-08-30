import { v1 } from "uuid";
import { FilterValuesType, TodolistType } from "../Todolist";

type ActionKeys = keyof typeof actions;
type ActionType = ReturnType<typeof actions[ActionKeys]>;

export const todolistReducer = (
  state: TodolistType[],
  action: ActionType
): TodolistType[] => {
  switch (action.type) {
    case "REMOVE_TODOLIST": {
      return state.filter((v) => v.id !== action.id);
    }

    case "ADD_TODOLIST": {
      return [...state, { id: action.id, title: action.title, filter: "all" }];
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

export const actions = {
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
