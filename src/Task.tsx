import { DeleteOutline } from "@mui/icons-material";
import { Checkbox, IconButton, ListItem } from "@mui/material";
import { Box } from "@mui/system";
import { memo } from "react";
import { Editable } from "./Editable";
import { TaskType } from "./store/tasks-reducer";

type PropsType = TaskType & {
  removeTask: (taskId: string) => void;
  changeTaskStatus: (isDone: boolean, id: string) => void;
  changeTaskTitle: (title: string, id: string) => void;
};

export const Task = memo((props: PropsType) => {
  console.log("Task");

  return (
    <ListItem
      key={props.id}
      disablePadding
      className={props.isDone ? "done" : ""}
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
          checked={props.isDone}
          onChange={(e) =>
            props.changeTaskStatus(e.currentTarget.checked, props.id)
          }
        />
        <Editable
          title={props.title}
          onChange={(title) => props.changeTaskTitle(title, props.id)}
        />
      </Box>
      <IconButton
        aria-label="delete task"
        onClick={() => props.removeTask(props.id)}
      >
        <DeleteOutline />
      </IconButton>
    </ListItem>
  );
});
