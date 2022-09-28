import Snackbar from "@mui/material/Snackbar";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { appActions } from "../../store/app-reducer";
import MuiAlert from "@mui/material/Alert";

export const ErrorSnackbar = () => {
  const errorMessage = useAppSelector((state) => state.app.errorMessage);
  const dispatch = useAppDispatch();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(appActions.setErrorMessage(null));
  };

  return (
    <Snackbar
      open={!!errorMessage}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <MuiAlert
        onClose={handleClose}
        severity="error"
        sx={{ width: "100%" }}
        elevation={6}
        variant="filled"
      >
        {errorMessage}
      </MuiAlert>
    </Snackbar>
  );
};
