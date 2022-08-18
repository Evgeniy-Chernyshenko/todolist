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
    <div>
      <h3>
        <Editable title={props.title} onChange={changeTodolistTitle} />
        <button onClick={removeTodolistHandler}>x</button>
      </h3>
      <AddItemForm onAddItem={addTask} />
      <ul>
        {props.tasks.map((task) => {
          const changeTaskTitleHandler = (title: string) =>
            props.changeTaskTitle(title, task.id, props.id);

          return (
            <li key={task.id} className={task.isDone ? "done" : ""}>
              <input
                type="checkbox"
                checked={task.isDone}
                onChange={(e) => onTaskStatusChangeClickHandler(e, task.id)}
              />
              <Editable title={task.title} onChange={changeTaskTitleHandler} />
              <button onClick={() => onRemoveTaskClickHandler(task.id)}>
                x
              </button>
            </li>
          );
        })}
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
