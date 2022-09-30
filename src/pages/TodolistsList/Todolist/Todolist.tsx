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
import { TaskStatuses } from "../../../api/todolists-api";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import { Editable } from "../../../components/Editable/Editable";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { tasksThunks } from "../../../store/tasks-reducer";
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "../../../store/todolists-reducer";
import { Task } from "../Task/Task";

type PropsType = TodolistDomainType;

export const Todolist = memo((props: PropsType) => {
  const tasks = useAppSelector((state) => state.tasks[props.id]);
  const dispatch = useAppDispatch();

  const removeTask = useCallback(
    (taskId: string) => {
      dispatch(tasksThunks.removeTask(taskId, props.id));
    },
    [dispatch, props.id]
  );

  const changeTaskStatus = useCallback(
    (status: TaskStatuses, id: string) =>
      dispatch(tasksThunks.updateTask(props.id, id, { status })),
    [dispatch, props.id]
  );

  const addTask = useCallback(
    (title: string) => dispatch(tasksThunks.addTask(title, props.id)),
    [dispatch, props.id]
  );

  const changeTaskTitle = useCallback(
    (title: string, id: string) =>
      dispatch(tasksThunks.updateTask(props.id, id, { title })),
    [dispatch, props.id]
  );

  const onTasksFilterChangeHandler = useCallback(
    (filterValue: FilterValuesType) =>
      dispatch(todolistsActions.changeTodolistFilter(props.id, filterValue)),
    [dispatch, props.id]
  );

  const removeTodolistHandler = useCallback(
    () => dispatch(todolistsThunks.removeTodolist(props.id)),
    [dispatch, props.id]
  );

  const changeTodolistTitle = useCallback(
    (title: string) =>
      dispatch(todolistsThunks.changeTodolistTitle(props.id, title)),
    [dispatch, props.id]
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (props.filter === "completed") {
          return task.status === TaskStatuses.Completed;
        }

        if (props.filter === "active") {
          return task.status !== TaskStatuses.Completed;
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
              <Editable
                title={props.title}
                onChange={changeTodolistTitle}
                disabled={props.isLoading}
              />
              <IconButton
                aria-label="delete todolist"
                onClick={removeTodolistHandler}
                disabled={props.isLoading}
              >
                <Delete />
              </IconButton>
            </Typography>
            <AddItemForm
              onAddItem={addTask}
              label="New task title"
              disabled={props.isLoading}
            />
            <List sx={{ mt: 2, mb: 2 }}>
              {filteredTasks.map((task, i, tasks) => (
                <div key={task.id}>
                  <Task
                    {...task}
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
