import { useState } from "react";
import { v1 } from "uuid";
import "./App.css";
import { FilterValuesType, TaskType, Todolist } from "./Todolist";

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([
    { id: v1(), title: "HTML", isDone: true },
    { id: v1(), title: "CSS", isDone: true },
    { id: v1(), title: "JS", isDone: true },
    { id: v1(), title: "React", isDone: false },
  ]);
  const [filter, setFilter] = useState<FilterValuesType>("all");

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const changeFilter = (filterValue: FilterValuesType) => {
    setFilter(filterValue);
  };

  const addTask = (newTaskTitle: string) => {
    setTasks([...tasks, { id: v1(), isDone: false, title: newTaskTitle }]);
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
        addTask={addTask}
      />
    </div>
  );
}

export default App;
