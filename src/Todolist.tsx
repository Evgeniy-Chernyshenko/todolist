import { Delete } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { memo, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AddItemForm } from "./AddItemForm";
import { Editable } from "./Editable";
import { AppStateType } from "./store/store";
import { tasksActions, TaskType } from "./store/tasks-reducer";
import {
  FilterValuesType,
  todolistsActions,
  TodolistType,
} from "./store/todolists-reducer";
import { Task } from "./Task";

export const Todolist = memo((props: TodolistType) => {
  console.log("Todolist");

  const tasks = useSelector<AppStateType, TaskType[]>(
    (state) => state.tasks[props.id]
  );
  const dispatch = useDispatch();

  const removeTask = useCallback(
    (taskId: string) => dispatch(tasksActions.removeTask(taskId, props.id)),
    [dispatch, props.id]
  );

  const changeTaskStatus = useCallback(
    (isDone: boolean, id: string) =>
      dispatch(tasksActions.changeTaskStatus(id, isDone, props.id)),
    [dispatch, props.id]
  );

  const addTask = useCallback(
    (title: string) => dispatch(tasksActions.addTask(title, props.id)),
    [dispatch, props.id]
  );

  const changeTaskTitle = useCallback(
    (title: string, id: string) =>
      dispatch(tasksActions.changeTaskTitle(id, title, props.id)),
    [dispatch, props.id]
  );

  const onTasksFilterChangeHandler = useCallback(
    (filterValue: FilterValuesType) =>
      dispatch(todolistsActions.changeTodolistFilter(props.id, filterValue)),
    [dispatch, props.id]
  );

  const removeTodolistHandler = useCallback(
    () => dispatch(todolistsActions.removeTodolist(props.id)),
    [dispatch, props.id]
  );

  const changeTodolistTitle = useCallback(
    (title: string) =>
      dispatch(todolistsActions.changeTodolistTitle(props.id, title)),
    [dispatch, props.id]
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (props.filter === "completed") {
          return task.isDone;
        }

        if (props.filter === "active") {
          return !task.isDone;
        }

        return true;
      }),
    [props.filter, tasks]
  );

  return (
    <Grid xs={12} md={6} lg={4}>
      <Card sx={{ height: "100%" }}>
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography
              component="div"
              variant="h5"
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Editable title={props.title} onChange={changeTodolistTitle} />
              <IconButton
                aria-label="delete todolist"
                onClick={removeTodolistHandler}
              >
                <Delete />
              </IconButton>
            </Typography>
            <AddItemForm onAddItem={addTask} label="New task title" />
            <List sx={{ mt: 2, mb: 2 }}>
              {filteredTasks.map((task, i, tasks) => (
                <div key={task.id}>
                  <Task
                    id={task.id}
                    isDone={task.isDone}
                    title={task.title}
                    changeTaskStatus={changeTaskStatus}
                    changeTaskTitle={changeTaskTitle}
                    removeTask={removeTask}
                  />
                  {i < tasks.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </div>
          <ButtonGroup variant="outlined" fullWidth color="info">
            <Button
              variant={props.filter === "all" ? "contained" : "outlined"}
              onClick={() => onTasksFilterChangeHandler("all")}
            >
              All
            </Button>
            <Button
              variant={props.filter === "active" ? "contained" : "outlined"}
              onClick={() => onTasksFilterChangeHandler("active")}
            >
              Active
            </Button>
            <Button
              variant={props.filter === "completed" ? "contained" : "outlined"}
              onClick={() => onTasksFilterChangeHandler("completed")}
            >
              Completed
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>
    </Grid>
  );
});
