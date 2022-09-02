import { v1 } from "uuid";

type ActionKeys = keyof typeof todolistsActions;
type ActionType = ReturnType<typeof todolistsActions[ActionKeys]>;

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

// export const todolist1Id = v1();
// export const todolist2Id = v1();

const initialState: TodolistType[] = [
  // { id: todolist1Id, title: "What to learn", filter: "all" },
  // { id: todolist2Id, title: "What to buy", filter: "all" },
];

export const todolistsReducer = (
  state: TodolistType[] = initialState,
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
