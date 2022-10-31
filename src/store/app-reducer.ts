import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authThunks } from "./auth-reducer";
import { AppThunks, InferActionTypes } from "./store";

export type AppActionType = InferActionTypes<typeof appActions>;

export type AppStateType = {
  isInitialize: boolean;
  isLoading: boolean;
  errorMessage: null | string;
};

const initialState: AppStateType = {
  isInitialize: false,
  isLoading: false,
  errorMessage: null,
};

const slice = createSlice({
  initialState,
  name: "app",
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<null | string>) => {
      state.errorMessage = action.payload;
    },
    setInitialize: (state) => {
      state.isInitialize = true;
    },
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;

export const appThunks: AppThunks = {
  initialize: () => async (dispatch) => {
    await dispatch(authThunks.setAuth());
    dispatch(appActions.setInitialize());
  },
};
