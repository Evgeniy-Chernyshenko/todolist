import { useState } from "react";
import { v1 } from "uuid";
import "./App.css";
import { FilterValuesType, TaskType, Todolist, TodolistType } from "./Todolist";

type TasksStateType = { [key: string]: TaskType[] };

const todolist1Id = v1();
const todolist2Id = v1();

function App() {
  const [todolists, setTodolists] = useState<TodolistType[]>([
    { id: todolist1Id, title: "What to learn", filter: "all" },
    { id: todolist2Id, title: "What to buy", filter: "completed" },
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

  return (
    <div className="App">
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
          />
        );
      })}
    </div>
  );
}

export default App;
