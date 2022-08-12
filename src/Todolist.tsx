type TodolistType = {
  title: string;
  tasks: TaskType[];
};

export type TaskType = {
  title: string;
  isDone: boolean;
};

export function Todolist(props: TodolistType) {
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input type="text" />
        <button>+</button>
      </div>
      <ul>
        <li>
          <input type="checkbox" checked={props.tasks[0].isDone} />
          <span>{props.tasks[0].title}</span>
        </li>
        <li>
          <input type="checkbox" checked={props.tasks[1].isDone} />
          <span>{props.tasks[1].title}</span>
        </li>
        <li>
          <input type="checkbox" checked={props.tasks[2].isDone} />
          <span>{props.tasks[2].title}</span>
        </li>
        <li>
          <input type="checkbox" checked={props.tasks[3].isDone} />
          <span>{props.tasks[3].title}</span>
        </li>
      </ul>
      <div>
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
      </div>
    </div>
  );
}
