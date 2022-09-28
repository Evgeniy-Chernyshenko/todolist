import { InferActionTypes } from "./store";

export type AppActionType = InferActionTypes<typeof appActions>;

export type AppStateType = { isLoading: boolean; errorMessage: null | string };

const initialState: AppStateType = { isLoading: false, errorMessage: null };

export const appReducer = (
  state = initialState,
  action: AppActionType
): AppStateType => {
  switch (action.type) {
    case "APP/SET-IS-LOADING": {
      return { ...state, ...action.payload };
    }

    case "APP/SET-ERROR-MESSAGE": {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};

export const appActions = {
  setIsLoading: (isLoading: boolean) => ({
    type: "APP/SET-IS-LOADING" as const,
    payload: { isLoading },
  }),
  setErrorMessage: (errorMessage: null | string) => ({
    type: "APP/SET-ERROR-MESSAGE" as const,
    payload: { errorMessage },
  }),
};
