import { ChangeEvent, KeyboardEvent, useState } from "react";

type TodolistType = {
  title: string;
  tasks: TaskType[];
  removeTask: (id: string) => void;
  changeFilter: (filterValue: FilterValuesType) => void;
  addTask: (newTaskTitle: string) => void;
};

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

export type FilterValuesType = "all" | "active" | "completed";

export function Todolist(props: TodolistType) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    const clearNewTaskTitle = newTaskTitle.trim();

    if (clearNewTaskTitle) {
      props.addTask(newTaskTitle);
      setNewTaskTitle("");
    }
  };

  const onChangeNewTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setNewTaskTitle(e.currentTarget.value);

  const onKeyPressNewTaskTitleHandler = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    e.code === "Enter" && addTask();
  };

  const onClickAddButtonHandler = () => {
    addTask();
  };

  const onClickRemoveTaskButtonHandler = (taskId: string) => {
    props.removeTask(taskId);
  };

  const onChangeTasksFilterHandler = (filterValue: FilterValuesType) => {
    props.changeFilter(filterValue);
  };

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          type="text"
          value={newTaskTitle}
          onChange={onChangeNewTaskTitleHandler}
          onKeyPress={onKeyPressNewTaskTitleHandler}
        />
        <button onClick={onClickAddButtonHandler}>+</button>
      </div>
      <ul>
        {props.tasks.map((task) => (
          <li key={task.id}>
            <input type="checkbox" checked={task.isDone} />
            <span>{task.title}</span>
            <button onClick={() => onClickRemoveTaskButtonHandler(task.id)}>
              x
            </button>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => onChangeTasksFilterHandler("all")}>All</button>
        <button onClick={() => onChangeTasksFilterHandler("active")}>
          Active
        </button>
        <button onClick={() => onChangeTasksFilterHandler("completed")}>
          Completed
        </button>
      </div>
    </div>
  );
}
