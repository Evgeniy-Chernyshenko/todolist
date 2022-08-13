import { useState } from "react";
import "./App.css";
import { TaskType, Todolist } from "./Todolist";

export type FilterValuesType = "all" | "active" | "completed";

function App() {
  console.log("app rendered");

  const [tasks, setTasks] = useState<TaskType[]>([
    { id: 1, title: "HTML", isDone: true },
    { id: 2, title: "CSS", isDone: true },
    { id: 3, title: "JS", isDone: true },
    { id: 4, title: "React", isDone: false },
  ]);
  const [filter, setFilter] = useState<FilterValuesType>("all");

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const changeFilter = (filterValue: FilterValuesType) => {
    setFilter(filterValue);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.isDone;
    }

    if (filter === "active") {
      return !task.isDone;
    }

    return true;
  });

  return (
    <div className="App">
      <Todolist
        title="What to learn"
        tasks={filteredTasks}
        removeTask={removeTask}
        changeFilter={changeFilter}
      />
    </div>
  );
}

export default App;
