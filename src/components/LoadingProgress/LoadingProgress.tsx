import { LinearProgress } from "@mui/material";
import { useAppSelector } from "../../hooks";

export const LoadingProgress = () => {
  const isLoading = useAppSelector((state) => state.app.isLoading);

  return (
    <>
      {isLoading && (
        <LinearProgress sx={{ position: "absolute", width: "100%" }} />
      )}
    </>
  );
};
