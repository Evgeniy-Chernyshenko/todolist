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
import { useState } from "react";
import { v1 } from "uuid";
import { AddItemForm } from "./AddItemForm";
import "./App.css";
import { FilterValuesType, TaskType, Todolist, TodolistType } from "./Todolist";

type TasksStateType = { [key: string]: TaskType[] };

const todolist1Id = v1();
const todolist2Id = v1();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [todolists, setTodolists] = useState<TodolistType[]>([
    { id: todolist1Id, title: "What to learn", filter: "all" },
    { id: todolist2Id, title: "What to buy", filter: "all" },
  ]);
  const [tasks, setTasks] = useState<TasksStateType>({
    [todolist1Id]: [
      { id: v1(), title: "HTML", isDone: true },
      { id: v1(), title: "CSS", isDone: true },
      { id: v1(), title: "JS", isDone: true },
      { id: v1(), title: "React", isDone: false },
    ],
    [todolist2Id]: [
      { id: v1(), title: "Bread", isDone: true },
      { id: v1(), title: "Laptop", isDone: true },
      { id: v1(), title: "Milk", isDone: false },
    ],
  });

  const removeTask = (id: string, todolistId: string) => {
    setTasks({
      ...tasks,
      [todolistId]: tasks[todolistId].filter((task) => task.id !== id),
    });
  };

  const changeFilter = (filterValue: FilterValuesType, todolistId: string) => {
    const todolist = todolists.find((todolist) => todolist.id === todolistId);

    if (todolist) {
      todolist.filter = filterValue;

      setTodolists([...todolists]);
    }
  };

  const addTask = (newTaskTitle: string, todolistId: string) => {
    setTasks({
      ...tasks,
      [todolistId]: [
        ...tasks[todolistId],
        { id: v1(), isDone: false, title: newTaskTitle },
      ],
    });
  };

  const changeTaskStatus = (
    id: string,
    isDone: boolean,
    todolistId: string
  ) => {
    const changedTask = tasks[todolistId].find((task) => task.id === id);

    if (changedTask) {
      changedTask.isDone = isDone;
      setTasks({ ...tasks });
    }
  };

  const removeTodolist = (todolistId: string) => {
    setTodolists(todolists.filter((todolist) => todolist.id !== todolistId));
    delete tasks[todolistId];
    setTasks({ ...tasks });
  };

  const addTodolist = (title: string) => {
    const newTodolistId = v1();

    setTodolists([...todolists, { id: newTodolistId, title, filter: "all" }]);
    setTasks({ ...tasks, [newTodolistId]: [] });
  };

  const changeTaskTitle = (
    title: string,
    taskId: string,
    todolistId: string
  ) => {
    setTasks({
      ...tasks,
      [todolistId]: tasks[todolistId].map((task) =>
        task.id === taskId ? { ...task, title } : task
      ),
    });
  };

  const changeTodolistTitle = (title: string, todolistId: string) => {
    setTodolists(
      todolists.map((todolist) =>
        todolist.id === todolistId ? { ...todolist, title } : todolist
      )
    );
  };

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
            const filteredTasks = tasks[todolist.id].filter((task) => {
              if (todolist.filter === "completed") {
                return task.isDone;
              }

              if (todolist.filter === "active") {
                return !task.isDone;
              }

              return true;
            });

            return (
              <Todolist
                key={todolist.id}
                id={todolist.id}
                title={todolist.title}
                tasks={filteredTasks}
                filter={todolist.filter}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
                removeTodolist={removeTodolist}
                changeTaskTitle={changeTaskTitle}
                changeTodolistTitle={changeTodolistTitle}
              />
            );
          })}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
