import { todolistsAPI, TodolistType } from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { appActions } from "./app-reducer";
import { AppThunk, InferActionTypes } from "./store";

export type TodolistActionType = InferActionTypes<typeof todolistsActions>;

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  isLoading: boolean;
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
          isLoading: false,
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
      return action.todolists.map((v) => ({
        ...v,
        filter: "all",
        isLoading: false,
      }));
    }

    case "TODOLISTS/SET_IS_LOADING": {
      return state.map((v) =>
        v.id === action.id ? { ...v, isLoading: action.isLoading } : v
      );
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
  setIsLoading: (id: string, isLoading: boolean) => ({
    type: "TODOLISTS/SET_IS_LOADING" as const,
    id,
    isLoading,
  }),
};

export const todolistsThunks = {
  setTodolists: (): AppThunk => async (dispatch) => {
    dispatch(appActions.setIsLoading(true));

    try {
      const responseData = await todolistsAPI.getTodolists();
      dispatch(todolistsActions.setTodolists(responseData));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    } finally {
      dispatch(appActions.setIsLoading(false));
    }
  },
  removeTodolist:
    (id: string): AppThunk =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(todolistsActions.setIsLoading(id, true));

      try {
        const responseData = await todolistsAPI.deleteTodolist(id);

        responseData.resultCode !== 0
          ? handleServerAppError(responseData, dispatch)
          : dispatch(todolistsActions.removeTodolist(id));
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(todolistsActions.setIsLoading(id, false));
      }
    },
  addTodolists:
    (title: string): AppThunk =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const responseData = await todolistsAPI.createTodolist(title);

        responseData.resultCode !== 0
          ? handleServerAppError(responseData, dispatch)
          : dispatch(todolistsActions.addTodolist(responseData.data.item));
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    },
  changeTodolistTitle:
    (id: string, title: string): AppThunk =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(todolistsActions.setIsLoading(id, true));

      try {
        const responseData = await todolistsAPI.updateTodolist(id, title);

        responseData.resultCode !== 0
          ? handleServerAppError(responseData, dispatch)
          : dispatch(todolistsActions.changeTodolistTitle(id, title));
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(todolistsActions.setIsLoading(id, false));
      }
    },
};
