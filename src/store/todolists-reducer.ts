import { v1 } from "uuid";
import { FilterValuesType, TodolistType } from "../Todolist";

type ActionsKeys = keyof typeof actions;
type ActionsType = ReturnType<typeof actions[ActionsKeys]>;

export const todolistReducer = (
  state: TodolistType[],
  action: ActionsType
): TodolistType[] => {
  switch (action.type) {
    case "REMOVE_TODOLIST": {
      return state.filter((v) => v.id !== action.id);
    }

    case "ADD_TODOLIST": {
      return [...state, { id: v1(), title: action.title, filter: "all" }];
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

const actions = {
  removeTodolist: (id: string) => ({ type: "REMOVE_TODOLIST" as const, id }),
  addTodolist: (title: string) => ({ type: "ADD_TODOLIST" as const, title }),
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
