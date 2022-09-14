import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskApiModelType,
} from "../api/todolists-api";
import { AppThunk } from "./store";
import { todolistsActions } from "./todolists-reducer";

type ActionKeys = keyof typeof tasksActions;
export type TasksActionType =
  | ReturnType<typeof tasksActions[ActionKeys]>
  | ReturnType<typeof todolistsActions.removeTodolist>
  | ReturnType<typeof todolistsActions.addTodolist>
  | ReturnType<typeof todolistsActions.setTodolists>;

export type TasksStateType = { [key: string]: TaskType[] };

type UpdateTaskDomainModelType = {
  title?: string;
  description?: null | string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: null | string;
  deadline?: null | string;
};

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: TasksActionType
): TasksStateType => {
  switch (action.type) {
    case "REMOVE_TASK": {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (v) => v.id !== action.id
        ),
      };
    }

    case "ADD_TASK": {
      return {
        ...state,
        [action.task.todoListId]: [
          action.task,
          ...state[action.task.todoListId],
        ],
      };
    }

    case "UPDATE_TASK": {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((v) =>
          v.id === action.taskId ? { ...v, ...action.apiModel } : v
        ),
      };
    }

    case "ADD_TODOLIST": {
      return { ...state, [action.todolist.id]: [] };
    }

    case "REMOVE_TODOLIST": {
      const stateCopy = { ...state };
      delete stateCopy[action.id];
      return stateCopy;
    }

    case "SET_TODOLISTS": {
      return action.todolists.reduce((a, c) => ({ ...a, [c.id]: [] }), {});
    }

    case "SET_TASKS": {
      return { ...state, [action.todolistId]: action.tasks };
    }

    default:
      return state;
  }
};

export const tasksActions = {
  removeTask: (id: string, todolistId: string) => ({
    type: "REMOVE_TASK" as const,
    id,
    todolistId,
  }),
  addTask: (task: TaskType) => ({
    type: "ADD_TASK" as const,
    task,
  }),
  setTasks: (tasks: TaskType[], todolistId: string) => ({
    type: "SET_TASKS" as const,
    tasks,
    todolistId,
  }),
  updateTask: (
    todolistId: string,
    taskId: string,
    apiModel: UpdateTaskApiModelType
  ) => ({
    type: "UPDATE_TASK" as const,
    todolistId,
    taskId,
    apiModel,
  }),
};

export const tasksThunks = {
  setTasks:
    (todolistId: string): AppThunk =>
    (dispatch) => {
      todolistsAPI
        .getTasks(todolistId)
        .then((responseData) =>
          dispatch(tasksActions.setTasks(responseData.items, todolistId))
        );
    },
  removeTask:
    (id: string, todolistId: string): AppThunk =>
    async (dispatch) => {
      await todolistsAPI.deleteTask(todolistId, id);
      dispatch(tasksActions.removeTask(id, todolistId));
    },
  addTask:
    (title: string, todolistId: string): AppThunk =>
    async (dispatch) => {
      const responseData = await todolistsAPI.createTask(todolistId, title);
      dispatch(tasksActions.addTask(responseData.data.item));
    },
  updateTask:
    (
      todolistId: string,
      taskId: string,
      domainModel: UpdateTaskDomainModelType
    ): AppThunk =>
    async (dispatch, getState) => {
      const state = getState();
      const task = state.tasks[todolistId].find(({ id }) => id === taskId);

      if (!task) {
        console.warn("task not found");
        return;
      }

      const apiModel: UpdateTaskApiModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        status: task.status,
        title: task.title,
        ...domainModel,
      };

      const responseData = await todolistsAPI.updateTask(
        todolistId,
        taskId,
        apiModel
      );
      dispatch(
        tasksActions.updateTask(todolistId, taskId, responseData.data.item)
      );
    },
};
