import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsAPI, TodolistType } from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { appActions } from "./app-reducer";
import { AppThunk, InferActionTypes } from "./store";
import { tasksThunks } from "./tasks-reducer";

export type TodolistActionType = InferActionTypes<typeof todolistsActions>;

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  isLoading: boolean;
};

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  initialState,
  name: "todolists",
  reducers: {
    removeTodolist: (state, action: PayloadAction<string>) => {
      return state.filter((v) => v.id !== action.payload);
    },
    addTodolist: (state, action: PayloadAction<TodolistType>) => {
      state.unshift({
        ...action.payload,
        filter: "all",
        isLoading: false,
      });
    },
    changeTodolistTitle: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      return state.map((v) =>
        v.id === action.payload.id ? { ...v, title: action.payload.title } : v
      );
    },
    changeTodolistFilter: (
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) => {
      return state.map((v) =>
        v.id === action.payload.id ? { ...v, filter: action.payload.filter } : v
      );
    },
    setTodolists: (state, action: PayloadAction<TodolistType[]>) => {
      return action.payload.map((v) => ({
        ...v,
        filter: "all",
        isLoading: false,
      }));
    },
    clearTodolists: () => {
      return [];
    },
    setIsLoading: (
      state,
      action: PayloadAction<{ id: string; isLoading: boolean }>
    ) => {
      return state.map((v) =>
        v.id === action.payload.id
          ? { ...v, isLoading: action.payload.isLoading }
          : v
      );
    },
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

export const todolistsThunks = {
  setTodolists: (): AppThunk => async (dispatch) => {
    dispatch(appActions.setIsLoading(true));

    try {
      const responseData = await todolistsAPI.getTodolists();
      dispatch(todolistsActions.setTodolists(responseData));
      await Promise.all(
        responseData.map((v) => dispatch(tasksThunks.setTasks(v.id)))
      );
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
      dispatch(todolistsActions.setIsLoading({ id, isLoading: true }));

      try {
        const responseData = await todolistsAPI.deleteTodolist(id);

        responseData.resultCode !== 0
          ? handleServerAppError(responseData, dispatch)
          : dispatch(todolistsActions.removeTodolist(id));
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(todolistsActions.setIsLoading({ id, isLoading: false }));
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
      dispatch(todolistsActions.setIsLoading({ id, isLoading: true }));

      try {
        const responseData = await todolistsAPI.updateTodolist(id, title);

        responseData.resultCode !== 0
          ? handleServerAppError(responseData, dispatch)
          : dispatch(todolistsActions.changeTodolistTitle({ id, title }));
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(todolistsActions.setIsLoading({ id, isLoading: false }));
      }
    },
};
