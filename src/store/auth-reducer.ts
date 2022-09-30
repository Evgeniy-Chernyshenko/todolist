import { LoginParamsType, todolistsAPI } from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { appActions } from "./app-reducer";
import { AppThunk, InferActionTypes } from "./store";

export type AuthActionType = InferActionTypes<typeof authActions>;

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

export const authReducer = (
  state = initialState,
  action: AuthActionType
): AuthStateType => {
  switch (action.type) {
    case "SET_AUTH": {
      return { ...state, ...action.payload };
    }

    case "LOGOUT": {
      return { id: null, email: null, login: null };
    }

    default:
      return state;
  }
};

export const authActions = {
  setAuth: (payload: { id: number; email: string; login: string }) => ({
    type: "SET_AUTH" as const,
    payload,
  }),
  logout: () => ({
    type: "LOGOUT" as const,
  }),
};

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
