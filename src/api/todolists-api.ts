import { client } from "./client";

export type ResponseType1<D = {}> = {
  data: D;
  messages: string[];
  fieldsErrors: string[];
  resultCode: number;
};

type ResponseType2<D> = {
  items: D;
  totalCount: number;
  error: null | string;
};

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TaskType = {
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
} & UpdateTaskApiModelType;

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  High = 2,
  Urgently = 3,
  Later = 4,
}

export type UpdateTaskApiModelType = {
  title: string;
  description: null | string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: null | string;
  deadline: null | string;
};

export const todolistsAPI = {
  getTodolists: async () => {
    return (await client.get<TodolistType[]>("todo-lists")).data;
  },
  createTodolist: async (title: string) => {
    return (
      await client.post<ResponseType1<{ item: TodolistType }>>("todo-lists", {
        title,
      })
    ).data;
  },
  deleteTodolist: async (id: string) => {
    return (await client.delete<ResponseType1>(`todo-lists/${id}`)).data;
  },
  updateTodolist: async (id: string, title: string) => {
    return (await client.put<ResponseType1>(`todo-lists/${id}`, { title }))
      .data;
  },
  getTasks: async (todolistId: string) => {
    return (
      await client.get<ResponseType2<TaskType[]>>(
        `todo-lists/${todolistId}/tasks`
      )
    ).data;
  },
  createTask: async (todolistId: string, title: string) => {
    return (
      await client.post<ResponseType1<{ item: TaskType }>>(
        `todo-lists/${todolistId}/tasks`,
        { title }
      )
    ).data;
  },
  updateTask: async (
    todolistId: string,
    taskId: string,
    model: UpdateTaskApiModelType
  ) => {
    return (
      await client.put<ResponseType1<{ item: TaskType }>>(
        `todo-lists/${todolistId}/tasks/${taskId}`,
        model
      )
    ).data;
  },
  deleteTask: async (todolistId: string, taskId: string) => {
    return (
      await client.delete<ResponseType1>(
        `todo-lists/${todolistId}/tasks/${taskId}`
      )
    ).data;
  },
};
