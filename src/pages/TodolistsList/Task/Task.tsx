import { DeleteOutline } from "@mui/icons-material";
import { Checkbox, IconButton, ListItem } from "@mui/material";
import { Box } from "@mui/system";
import { memo } from "react";
import { TaskStatuses } from "../../../api/todolists-api";
import { Editable } from "../../../components/Editable/Editable";
import { TaskDomainType } from "../../../store/tasks-reducer";

type PropsType = TaskDomainType & {
  removeTask: (taskId: string) => void;
  changeTaskStatus: (status: TaskStatuses, id: string) => void;
  changeTaskTitle: (title: string, id: string) => void;
};

export const Task = memo((props: PropsType) => {
  return (
    <ListItem
      key={props.id}
      disablePadding
      className={props.status === TaskStatuses.Completed ? "done" : ""}
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
          checked={props.status === TaskStatuses.Completed}
          onChange={(e) =>
            props.changeTaskStatus(
              e.currentTarget.checked
                ? TaskStatuses.Completed
                : TaskStatuses.InProgress,
              props.id
            )
          }
          disabled={props.isLoading}
        />
        <Editable
          title={props.title}
          onChange={(title) => props.changeTaskTitle(title, props.id)}
          disabled={props.isLoading}
        />
      </Box>
      <IconButton
        aria-label="delete task"
        onClick={() => props.removeTask(props.id)}
        disabled={props.isLoading}
      >
        <DeleteOutline />
      </IconButton>
    </ListItem>
  );
});
