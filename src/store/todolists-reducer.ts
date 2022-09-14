import { todolistsAPI, TodolistType } from "../api/todolists-api";
import { AppThunk } from "./store";

type ActionKeys = keyof typeof todolistsActions;
export type TodolistActionType = ReturnType<
  typeof todolistsActions[ActionKeys]
>;

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
};

const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (
  state = initialState,
  action: TodolistActionType
): TodolistDomainType[] => {
  switch (action.type) {
    case "REMOVE_TODOLIST": {
      return state.filter((v) => v.id !== action.id);
    }

    case "ADD_TODOLIST": {
      return [
        {
          ...action.todolist,
          filter: "all",
        },
        ...state,
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

    case "SET_TODOLISTS": {
      return action.todolists.map((v) => ({ ...v, filter: "all" }));
    }

    default: {
      return state;
    }
  }
};

export const todolistsActions = {
  removeTodolist: (id: string) => ({ type: "REMOVE_TODOLIST" as const, id }),
  addTodolist: (todolist: TodolistType) => ({
    type: "ADD_TODOLIST" as const,
    todolist,
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
  setTodolists: (todolists: TodolistType[]) => ({
    type: "SET_TODOLISTS" as const,
    todolists,
  }),
};

export const todolistsThunks = {
  setTodolists: (): AppThunk => (dispatch) => {
    todolistsAPI
      .getTodolists()
      .then((responseData) =>
        dispatch(todolistsActions.setTodolists(responseData))
      );
  },
  removeTodolists:
    (id: string): AppThunk =>
    async (dispatch) => {
      await todolistsAPI.deleteTodolist(id);
      dispatch(todolistsActions.removeTodolist(id));
    },
  addTodolists:
    (title: string): AppThunk =>
    async (dispatch) => {
      const responseData = await todolistsAPI.createTodolist(title);
      dispatch(todolistsActions.addTodolist(responseData.data.item));
    },
  changeTodolistTitle:
    (id: string, title: string): AppThunk =>
    async (dispatch) => {
      await todolistsAPI.updateTodolist(id, title);
      dispatch(todolistsActions.changeTodolistTitle(id, title));
    },
};
