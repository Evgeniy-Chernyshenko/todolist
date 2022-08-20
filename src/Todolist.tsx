import { Delete, DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { ChangeEvent } from "react";
import { AddItemForm } from "./AddItemForm";
import { Editable } from "./Editable";

type TodolistPropsType = TodolistType & {
  tasks: TaskType[];
  removeTask: (id: string, todolistId: string) => void;
  changeFilter: (filterValue: FilterValuesType, todolistId: string) => void;
  addTask: (newTaskTitle: string, todolistId: string) => void;
  changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void;
  removeTodolist: (todolistId: string) => void;
  changeTaskTitle: (title: string, taskId: string, todolistId: string) => void;
  changeTodolistTitle: (title: string, todolistId: string) => void;
};

export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

export type FilterValuesType = "all" | "active" | "completed";

export function Todolist(props: TodolistPropsType) {
  const onRemoveTaskClickHandler = (taskId: string) => {
    props.removeTask(taskId, props.id);
  };

  const onTasksFilterChangeHandler = (filterValue: FilterValuesType) => {
    props.changeFilter(filterValue, props.id);
  };

  const onTaskStatusChangeClickHandler = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    props.changeTaskStatus(id, e.currentTarget.checked, props.id);
  };

  const removeTodolistHandler = () => {
    props.removeTodolist(props.id);
  };

  const addTask = (title: string) => props.addTask(title, props.id);

  const changeTodolistTitle = (title: string) =>
    props.changeTodolistTitle(title, props.id);

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
              {props.tasks.map((task, i, tasks) => {
                const changeTaskTitleHandler = (title: string) =>
                  props.changeTaskTitle(title, task.id, props.id);

                return (
                  <>
                    <ListItem
                      disablePadding
                      key={task.id}
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
                          onChange={changeTaskTitleHandler}
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
                  </>
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
