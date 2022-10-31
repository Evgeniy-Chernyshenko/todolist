import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginParamsType, todolistsAPI } from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { appActions } from "./app-reducer";
import { AppThunk, InferActionTypes } from "./store";

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

export type AuthActionType = InferActionTypes<typeof authActions>;

const slice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setAuth: (state, action: PayloadAction<AuthStateType>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.login = action.payload.login;
    },
    logout: (state) => {
      state.id = null;
      state.email = null;
      state.login = null;
    },
  },
});

export const authReducer = slice.reducer;
const authActions = slice.actions;

export const authThunks = {
  login:
    (params: LoginParamsType): AppThunk =>
    async (dispatch) => {
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
    },
  setAuth: (): AppThunk<Promise<void>> => async (dispatch) => {
    try {
      const responseData = await todolistsAPI.me();

      responseData.resultCode === 0 &&
        dispatch(authActions.setAuth(responseData.data));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  },
  logout: (): AppThunk => async (dispatch) => {
    try {
      const responseData = await todolistsAPI.logout();

      responseData.resultCode !== 0
        ? handleServerAppError(responseData, dispatch)
        : dispatch(authActions.logout());
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    }
  },
};
