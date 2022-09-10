import { useEffect, useState } from "react";
import { todolistsAPI } from "../api/todolists-api";

export default {
  title: "Todolist/API",
};

// TODO: доделать для тасок кроме сортировки и сделать инпуты и кнопки чтобы удобно фигачить в сторибуке

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    todolistsAPI.getTodolists().then((data) => {
      setState(data);
    });
  }, []);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [title, setTitle] = useState("");

  return (
    <>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        placeholder="title"
      />
      <button
        onClick={() => {
          todolistsAPI.createTodolist(title).then((data) => {
            setState(data);
          });
        }}
      >
        create todolist
      </button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
};

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, setTodolistId] = useState("");

  return (
    <>
      <input
        type="text"
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
        placeholder="todolistId"
      />
      <button
        onClick={() => {
          todolistsAPI.deleteTodolist(todolistId).then((data) => {
            setState(data);
          });
        }}
      >
        delete todolist
      </button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
};

export const UpdateTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, setTodolistId] = useState("");
  const [title, setTitle] = useState("");

  return (
    <>
      <input
        type="text"
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
        placeholder="todolistId"
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        placeholder="title"
      />
      <button
        onClick={() => {
          todolistsAPI.updateTodolist(todolistId, title).then((data) => {
            setState(data);
          });
        }}
      >
        update todolist
      </button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
};

export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, setTodolistId] = useState("");

  return (
    <>
      <input
        type="text"
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
        placeholder="todolistId"
      />
      <button
        onClick={() => {
          todolistsAPI.getTasks(todolistId).then((data) => {
            setState(data);
          });
        }}
      >
        get tasks
      </button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
};

export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, setTodolistId] = useState("");
  const [title, setTitle] = useState("");

  return (
    <>
      <input
        type="text"
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
        placeholder="todolistId"
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        placeholder="title"
      />
      <button
        onClick={() => {
          todolistsAPI.createTask(todolistId, title).then((data) => {
            setState(data);
          });
        }}
      >
        create task
      </button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
};

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, setTodolistId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  return (
    <>
      <input
        type="text"
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
        placeholder="todolistId"
      />
      <input
        type="text"
        value={taskId}
        onChange={(e) => setTaskId(e.currentTarget.value)}
        placeholder="taskId"
      />

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        placeholder="title"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        placeholder="description"
      />
      <input
        type="text"
        value={status}
        onChange={(e) => setStatus(e.currentTarget.value)}
        placeholder="status"
      />
      <input
        type="text"
        value={priority}
        onChange={(e) => setPriority(e.currentTarget.value)}
        placeholder="priority"
      />
      <button
        onClick={() => {
          todolistsAPI
            .updateTask(todolistId, taskId, {
              deadline: null,
              startDate: null,
              description,
              priority: +priority,
              status: +status,
              title,
            })
            .then((data) => {
              setState(data);
            });
        }}
      >
        update task
      </button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, setTodolistId] = useState("");
  const [taskId, setTaskId] = useState("");

  return (
    <>
      <input
        type="text"
        value={todolistId}
        onChange={(e) => setTodolistId(e.currentTarget.value)}
        placeholder="todolistId"
      />
      <input
        type="text"
        value={taskId}
        onChange={(e) => setTaskId(e.currentTarget.value)}
        placeholder="taskId"
      />
      <button
        onClick={() => {
          todolistsAPI.deleteTask(todolistId, taskId).then((data) => {
            setState(data);
          });
        }}
      >
        delete task
      </button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
};
