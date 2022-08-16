import { ChangeEvent, KeyboardEvent, useState } from "react";

type TodolistPropsType = TodolistType & {
  tasks: TaskType[];
  removeTask: (id: string, todolistId: string) => void;
  changeFilter: (filterValue: FilterValuesType, todolistId: string) => void;
  addTask: (newTaskTitle: string, todolistId: string) => void;
  changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void;
  removeTodolist: (todolistId: string) => void;
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
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [error, setError] = useState<null | string>(null);

  const addTask = () => {
    const clearNewTaskTitle = newTaskTitle.trim();

    if (!clearNewTaskTitle) {
      setError("Field is required");

      return;
    }

    props.addTask(newTaskTitle, props.id);
    setNewTaskTitle("");
  };

  const onNewTaskTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setNewTaskTitle(e.currentTarget.value);
  };

  const onNewTaskTitleKeyPressHandler = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    e.code === "Enter" && addTask();
  };

  const onAddTaskClickHandler = () => {
    addTask();
  };

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

  const onAddTaskElementsBlurHandler = () => {
    setError(null);
  };

  const removeTodolistHandler = () => {
    props.removeTodolist(props.id);
  };

  return (
    <div>
      <h3>
        {props.title} <button onClick={removeTodolistHandler}>x</button>
      </h3>
      <div>
        <input
          type="text"
          className={error ? "error" : ""}
          value={newTaskTitle}
          onChange={onNewTaskTitleChangeHandler}
          onKeyPress={onNewTaskTitleKeyPressHandler}
          onBlur={() => onAddTaskElementsBlurHandler()}
        />
        <button
          onClick={onAddTaskClickHandler}
          onBlur={() => onAddTaskElementsBlurHandler()}
        >
          +
        </button>
        {error && <div className="errorMessage">{error}</div>}
      </div>
      <ul>
        {props.tasks.map((task) => (
          <li key={task.id} className={task.isDone ? "done" : ""}>
            <input
              type="checkbox"
              checked={task.isDone}
              onChange={(e) => onTaskStatusChangeClickHandler(e, task.id)}
            />
            <span>{task.title}</span>
            <button onClick={() => onRemoveTaskClickHandler(task.id)}>x</button>
          </li>
        ))}
      </ul>
      <div>
        <button
          className={props.filter === "all" ? "active" : ""}
          onClick={() => onTasksFilterChangeHandler("all")}
        >
          All
        </button>
        <button
          className={props.filter === "active" ? "active" : ""}
          onClick={() => onTasksFilterChangeHandler("active")}
        >
          Active
        </button>
        <button
          className={props.filter === "completed" ? "active" : ""}
          onClick={() => onTasksFilterChangeHandler("completed")}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
