import {
  AppBar,
  Button,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DarkMode, LightMode, Menu } from "@mui/icons-material";
import { useState, useEffect } from "react";
import "./App.css";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { TodolistsList } from "../pages/TodolistsList/TodolistsList";
import { todolistsThunks } from "../store/todolists-reducer";

function App() {
  console.log("App");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(todolistsThunks.setTodolists());
  }, [dispatch]);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todolist app
          </Typography>
          <Button color="inherit">Login</Button>
          <IconButton
            color="inherit"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ pt: 4 }}>
        <Grid container spacing={4}>
          <TodolistsList />
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
