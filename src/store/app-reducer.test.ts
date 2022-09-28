import { appActions, appReducer, AppStateType } from "./app-reducer";

let startState: AppStateType;
beforeEach(() => {
  startState = {
    errorMessage: null,
    isLoading: false,
  };
});

test("error message set should be correct", () => {
  const errorMessage = "new error message";
  const endState = appReducer(
    startState,
    appActions.setErrorMessage(errorMessage)
  );

  expect(endState.errorMessage).toBe(errorMessage);
});

test("isLoading set should be correct", () => {
  const isLoading = true;
  const endState = appReducer(startState, appActions.setIsLoading(isLoading));

  expect(endState.isLoading).toBe(isLoading);
});
