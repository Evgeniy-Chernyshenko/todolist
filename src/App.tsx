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
import { useCallback, useState } from "react";
import { AddItemForm } from "./AddItemForm";
import "./App.css";
import { Todolist } from "./Todolist";
import { todolistsActions } from "./store/todolists-reducer";
import { useSelector } from "react-redux";
import { AppStateType } from "./store/store";
import { useDispatch } from "react-redux";

function App() {
  console.log("App");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const todolists = useSelector<AppStateType, AppStateType["todolists"]>(
    (state) => state.todolists
  );
  const dispatch = useDispatch();

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistsActions.addTodolist(title));
    },
    [dispatch]
  );

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
          <Grid xs={12}>
            <AddItemForm onAddItem={addTodolist} label="New todolist title" />
          </Grid>

          {todolists.map((todolist) => {
            return (
              <Todolist
                key={todolist.id}
                id={todolist.id}
                title={todolist.title}
                filter={todolist.filter}
              />
            );
          })}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
