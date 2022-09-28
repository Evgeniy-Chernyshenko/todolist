import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskApiModelType,
} from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { appActions } from "./app-reducer";
import { AppThunks, InferActionTypes } from "./store";
import { todolistsActions } from "./todolists-reducer";

export type TasksActionType =
  | InferActionTypes<typeof tasksActions>
  | ReturnType<typeof todolistsActions.removeTodolist>
  | ReturnType<typeof todolistsActions.addTodolist>
  | ReturnType<typeof todolistsActions.setTodolists>;

export type TaskDomainType = TaskType & { isLoading: boolean };

export type TasksStateType = { [key: string]: TaskDomainType[] };

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
          { ...action.task, isLoading: false },
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
      return {
        ...state,
        [action.todolistId]: action.tasks.map((v) => ({
          ...v,
          isLoading: false,
        })),
      };
    }

    case "TASKS/SET_IS_LOADING": {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((v) =>
          v.id === action.taskId ? { ...v, isLoading: action.isLoading } : v
        ),
      };
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
  setIsLoading: (todolistId: string, taskId: string, isLoading: boolean) => ({
    type: "TASKS/SET_IS_LOADING" as const,
    todolistId,
    taskId,
    isLoading,
  }),
};

export const tasksThunks: AppThunks = {
  setTasks: (todolistId: string) => async (dispatch) => {
    dispatch(appActions.setIsLoading(true));

    try {
      const responseData = await todolistsAPI.getTasks(todolistId);

      dispatch(tasksActions.setTasks(responseData.items, todolistId));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    } finally {
      dispatch(appActions.setIsLoading(false));
    }

    dispatch(appActions.setIsLoading(false));
  },
  removeTask: (id: string, todolistId: string) => async (dispatch) => {
    dispatch(appActions.setIsLoading(true));
    dispatch(todolistsActions.setIsLoading(todolistId, true));
    dispatch(tasksActions.setIsLoading(todolistId, id, true));

    try {
      const responseData = await todolistsAPI.deleteTask(todolistId, id);

      responseData.resultCode !== 0
        ? handleServerAppError(responseData, dispatch)
        : dispatch(tasksActions.removeTask(id, todolistId));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    } finally {
      dispatch(appActions.setIsLoading(false));
      dispatch(todolistsActions.setIsLoading(todolistId, false));
    }
  },
  addTask: (title: string, todolistId: string) => async (dispatch) => {
    dispatch(appActions.setIsLoading(true));
    dispatch(todolistsActions.setIsLoading(todolistId, true));

    try {
      const responseData = await todolistsAPI.createTask(todolistId, title);

      responseData.resultCode !== 0
        ? handleServerAppError(responseData, dispatch)
        : dispatch(tasksActions.addTask(responseData.data.item));
    } catch (error) {
      handleServerNetworkError(error, dispatch);
    } finally {
      dispatch(appActions.setIsLoading(false));
      dispatch(todolistsActions.setIsLoading(todolistId, false));
    }
  },
  updateTask:
    (
      todolistId: string,
      taskId: string,
      domainModel: UpdateTaskDomainModelType
    ) =>
    async (dispatch, getState) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(todolistsActions.setIsLoading(todolistId, true));
      dispatch(tasksActions.setIsLoading(todolistId, taskId, true));

      try {
        const state = getState();
        const task = state.tasks[todolistId].find(({ id }) => id === taskId);

        if (!task) {
          throw new Error("Task not found");
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
        responseData.resultCode !== 0
          ? handleServerAppError(responseData, dispatch)
          : dispatch(
              tasksActions.updateTask(
                todolistId,
                taskId,
                responseData.data.item
              )
            );
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(todolistsActions.setIsLoading(todolistId, false));
        dispatch(tasksActions.setIsLoading(todolistId, taskId, false));
      }
    },
};
