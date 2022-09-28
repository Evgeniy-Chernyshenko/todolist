import { ResponseType1 } from "../api/todolists-api";
import { appActions } from "../store/app-reducer";
import { AppDispatch } from "../store/store";

export const handleServerAppError = (
  responseData: ResponseType1,
  dispatch: AppDispatch
) => {
  responseData.messages[0] &&
    dispatch(appActions.setErrorMessage(responseData.messages[0]));
};

export const handleServerNetworkError = (
  error: unknown,
  dispatch: AppDispatch
) => {
  dispatch(
    appActions.setErrorMessage(
      error instanceof Error ? error.message : "Some error occurred"
    )
  );
};
