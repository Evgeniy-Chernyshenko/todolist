import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginParamsType, todolistsAPI } from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { appActions } from "./app-reducer";
import { AppDispatch } from "./store";

export type AuthStateType = {
  id: null | number;
  email: null | string;
  login: null | string;
};

const initialState: AuthStateType = {
  id: null,
  email: null,
  login: null,
};

const slice = createSlice({
  initialState,
  name: "auth",
  reducers: {},
  extraReducers(builder) {
    builder.addCase(authThunks.setAuth.fulfilled, (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.login = action.payload.login;
    });
    builder.addCase(authThunks.logout.fulfilled, (state, action) => {
      state.id = null;
      state.email = null;
      state.login = null;
    });
  },
});

export const authThunks = {
  login: createAsyncThunk<void, LoginParamsType, { dispatch: AppDispatch }>(
    "auth/login",
    async (params, { dispatch }) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const responseData = await todolistsAPI.login(params);

        if (responseData.resultCode !== 0) {
          handleServerAppError(responseData, dispatch);
        } else {
          await dispatch(authThunks.setAuth());
        }
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    }
  ),
  setAuth: createAsyncThunk<
    {
      id: number;
      email: string;
      login: string;
    },
    void,
    { dispatch: AppDispatch; rejectValue: void }
  >("auth/setAuth", async (_, { dispatch, rejectWithValue }) => {
    try {
      const responseData = await todolistsAPI.me();

      if (responseData.resultCode === 0) {
        return responseData.data;
      }

      return rejectWithValue();
    } catch (error) {
      handleServerNetworkError(error, dispatch);

      return rejectWithValue();
    }
  }),
  logout: createAsyncThunk<
    void,
    void,
    { dispatch: AppDispatch; rejectValue: void }
  >("auth/logout", async (_, { dispatch, rejectWithValue }) => {
    try {
      const responseData = await todolistsAPI.logout();

      if (responseData.resultCode !== 0) {
        handleServerAppError(responseData, dispatch);

        return rejectWithValue();
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);

      return rejectWithValue();
    }
  }),
};

export const authReducer = slice.reducer;
