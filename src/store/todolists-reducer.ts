import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsAPI, TodolistType } from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { appActions } from "./app-reducer";
import { AppDispatch } from "./store";
import { tasksThunks } from "./tasks-reducer";

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
    changeTodolistFilter: (
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) => {
      return state.map((v) =>
        v.id === action.payload.id ? { ...v, filter: action.payload.filter } : v
      );
    },
    setTodolists: (_, action: PayloadAction<TodolistType[]>) => {
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
  extraReducers(builder) {
    builder.addCase(
      todolistsThunks.removeTodolist.fulfilled,
      (state, action) => {
        return state.filter((v) => v.id !== action.payload);
      }
    );
    builder.addCase(
      todolistsThunks.changeTodolistTitle.fulfilled,
      (state, action) => {
        return state.map((v) =>
          v.id === action.payload.id ? { ...v, title: action.payload.title } : v
        );
      }
    );
    builder.addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload,
        filter: "all",
        isLoading: false,
      });
    });
  },
});

export const todolistsThunks = {
  setTodolists: createAsyncThunk<void, void, { dispatch: AppDispatch }>(
    "todolists/setTodolists",
    async (_, { dispatch }) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const responseData = await todolistsAPI.getTodolists();

        dispatch(todolistsActions.setTodolists(responseData));

        await Promise.all(
          responseData.map((v) => dispatch(tasksThunks.setTasks(v.id)))
        );
      } catch (e) {
        handleServerNetworkError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    }
  ),
  removeTodolist: createAsyncThunk<
    string,
    string,
    { dispatch: AppDispatch; rejectValue: void }
  >("todolists/removeTodolist", async (id, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setIsLoading(true));
    dispatch(todolistsActions.setIsLoading({ id, isLoading: true }));

    try {
      const responseData = await todolistsAPI.deleteTodolist(id);

      if (responseData.resultCode !== 0) {
        handleServerAppError(responseData, dispatch);

        return rejectWithValue();
      }

      return id;
    } catch (error) {
      handleServerNetworkError(error, dispatch);

      return rejectWithValue();
    } finally {
      dispatch(appActions.setIsLoading(false));
      dispatch(todolistsActions.setIsLoading({ id, isLoading: false }));
    }
  }),
  addTodolist: createAsyncThunk<
    TodolistType,
    string,
    { dispatch: AppDispatch; rejectValue: void }
  >("todolists/addTodolists", async (title, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setIsLoading(true));

    try {
      const responseData = await todolistsAPI.createTodolist(title);

      if (responseData.resultCode !== 0) {
        handleServerAppError(responseData, dispatch);

        return rejectWithValue();
      }

      return responseData.data.item;
    } catch (error) {
      handleServerNetworkError(error, dispatch);

      return rejectWithValue();
    } finally {
      dispatch(appActions.setIsLoading(false));
    }
  }),
  changeTodolistTitle: createAsyncThunk<
    { id: string; title: string },
    { id: string; title: string },
    { dispatch: AppDispatch; rejectValue: void }
  >(
    "todolists/changeTodolistTitle",
    async ({ id, title }, { dispatch, rejectWithValue }) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(todolistsActions.setIsLoading({ id, isLoading: true }));

      try {
        const responseData = await todolistsAPI.updateTodolist(id, title);

        if (responseData.resultCode !== 0) {
          handleServerAppError(responseData, dispatch);

          return rejectWithValue();
        }

        return { id, title };
      } catch (error) {
        handleServerNetworkError(error, dispatch);

        return rejectWithValue();
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(todolistsActions.setIsLoading({ id, isLoading: false }));
      }
    }
  ),
};

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
