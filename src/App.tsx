import "./App.css";
import { TaskType, Todolist } from "./Todolist";

const tasks1: TaskType[] = [
  { title: "HTML", isDone: true },
  { title: "CSS", isDone: true },
  { title: "JS", isDone: true },
  { title: "React", isDone: false },
];

const tasks2: TaskType[] = [
  { title: "bread", isDone: true },
  { title: "salt", isDone: false },
  { title: "butter", isDone: true },
  { title: "elephant", isDone: false },
];

function App() {
  return (
    <div className="App">
      <Todolist title="What to learn" tasks={tasks1} />
      <Todolist title="What to buy" tasks={tasks2} />
    </div>
  );
}

export default App;
