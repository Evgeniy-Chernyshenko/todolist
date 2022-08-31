import { Delete, DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { ChangeEvent } from "react";
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

export function Todolist(props: TodolistType) {
  const tasks = useSelector<AppStateType, TaskType[]>(
    (state) => state.tasks[props.id]
  );
  const dispatch = useDispatch();

  const onRemoveTaskClickHandler = (taskId: string) =>
    dispatch(tasksActions.removeTask(taskId, props.id));

  const onTaskStatusChangeClickHandler = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) =>
    dispatch(
      tasksActions.changeTaskStatus(id, e.currentTarget.checked, props.id)
    );

  const addTask = (title: string) =>
    dispatch(tasksActions.addTask(title, props.id));

  const changeTaskTitleHandler = (title: string, id: string) =>
    dispatch(tasksActions.changeTaskTitle(id, title, props.id));

  const onTasksFilterChangeHandler = (filterValue: FilterValuesType) =>
    dispatch(todolistsActions.changeTodolistFilter(props.id, filterValue));

  const removeTodolistHandler = () =>
    dispatch(todolistsActions.removeTodolist(props.id));

  const changeTodolistTitle = (title: string) =>
    dispatch(todolistsActions.changeTodolistTitle(props.id, title));

  const filteredTasks = tasks.filter((task) => {
    if (props.filter === "completed") {
      return task.isDone;
    }

    if (props.filter === "active") {
      return !task.isDone;
    }

    return true;
  });

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
              {filteredTasks.map((task, i, tasks) => {
                return (
                  <div key={task.id}>
                    <ListItem
                      disablePadding
                      className={task.isDone ? "done" : ""}
                      sx={{ gap: 1, p: 0.5 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexGrow: 1,
                        }}
                      >
                        <Checkbox
                          checked={task.isDone}
                          onChange={(e) =>
                            onTaskStatusChangeClickHandler(e, task.id)
                          }
                        />
                        <Editable
                          title={task.title}
                          onChange={(title) =>
                            changeTaskTitleHandler(title, task.id)
                          }
                        />
                      </Box>
                      <IconButton
                        aria-label="delete task"
                        onClick={() => onRemoveTaskClickHandler(task.id)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </ListItem>
                    {i < tasks.length - 1 && <Divider />}
                  </div>
                );
              })}
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
}
