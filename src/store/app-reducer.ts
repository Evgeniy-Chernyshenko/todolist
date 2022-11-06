import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authThunks } from "./auth-reducer";
import { AppDispatch } from "./store";

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
  },
  extraReducers(builder) {
    builder.addCase(appThunks.initialize.fulfilled, (state, action) => {
      state.isInitialize = true;
    });
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;

export const appThunks = {
  initialize: createAsyncThunk<void, void, { dispatch: AppDispatch }>(
    "auth/initialize",
    async (_, { dispatch }) => {
      await dispatch(authThunks.setAuth());
    }
  ),
};
