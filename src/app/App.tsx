import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { DarkMode, LightMode, Menu } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { TodolistsList } from "../pages/TodolistsList/TodolistsList";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { LoadingProgress } from "../components/LoadingProgress/LoadingProgress";
import { NavLink, Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login/Login";
import { NotFound } from "../pages/NotFound/NotFound";
import { useAppDispatch, useAppSelector } from "../hooks";
import { appThunks } from "../store/app-reducer";
import { deepOrange } from "@mui/material/colors";
import { authThunks } from "../store/auth-reducer";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isInitialize = useAppSelector((state) => state.app.isInitialize);
  const auth = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(appThunks.initialize());
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(authThunks.logout());
  }, [dispatch]);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  if (!isInitialize) {
    return (
      <>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component={NavLink}
              to="/"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              Todolist app
            </Typography>
          </Box>
          {auth.login !== null && (
            <>
              <Avatar sx={{ bgcolor: deepOrange[500], marginRight: "10px" }}>
                {auth.login[0].toLocaleUpperCase()}
              </Avatar>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ marginRight: "10px" }}
              >
                Logout
              </Button>
            </>
          )}
          <IconButton
            color="inherit"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <LoadingProgress />
      <Container sx={{ pt: 4 }}>
        <Routes>
          <Route path="/" element={<TodolistsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <ErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
