import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
import { AppThunk, InferActionTypes } from "./store";
import { todolistsActions } from "./todolists-reducer";

export type TasksActionType =
  | InferActionTypes<typeof tasksActions>
  | ReturnType<typeof todolistsActions.removeTodolist>
  | ReturnType<typeof todolistsActions.addTodolist>
  | ReturnType<typeof todolistsActions.setTodolists>
  | ReturnType<typeof todolistsActions.clearTodolists>;

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

const slice = createSlice({
  initialState,
  name: "tasks",
  reducers: {
    removeTask(
      state,
      action: PayloadAction<{ id: string; todolistId: string }>
    ) {
      state[action.payload.todolistId] = state[
        action.payload.todolistId
      ].filter((v) => v.id !== action.payload.id);
    },
    addTask(state, action: PayloadAction<TaskType>) {
      state[action.payload.todoListId].push({
        ...action.payload,
        isLoading: false,
      });
    },
    setTasks(
      state,
      action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>
    ) {
      state[action.payload.todolistId] = action.payload.tasks.map((v) => ({
        ...v,
        isLoading: false,
      }));
    },
    updateTask(
      state,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        apiModel: UpdateTaskApiModelType;
      }>
    ) {
      state[action.payload.todolistId] = state[action.payload.todolistId].map(
        (v) =>
          v.id === action.payload.taskId
            ? { ...v, ...action.payload.apiModel }
            : v
      );
    },
    setIsLoading(
      state,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        isLoading: boolean;
      }>
    ) {
      const taskIndex = state[action.payload.todolistId].findIndex(
        (v) => v.id === action.payload.taskId
      );

      state[action.payload.todolistId][taskIndex].isLoading =
        action.payload.isLoading;
    },
  },
  extraReducers(builder) {
    builder.addCase(todolistsActions.addTodolist, (state, action) => {
      state[action.payload.id] = [];
    });
    builder.addCase(todolistsActions.removeTodolist, (state, action) => {
      delete state[action.payload];
    });
    builder.addCase(todolistsActions.setTodolists, (state, action) => {
      return action.payload.reduce((a, c) => ({ ...a, [c.id]: [] }), {});
    });
    builder.addCase(todolistsActions.clearTodolists, () => {
      return {};
    });
  },
});

export const tasksReducer = slice.reducer;
const tasksActions = slice.actions;

export const tasksThunks = {
  setTasks:
    (todolistId: string): AppThunk<Promise<void>> =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const responseData = await todolistsAPI.getTasks(todolistId);

        dispatch(
          tasksActions.setTasks({ tasks: responseData.items, todolistId })
        );
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }

      dispatch(appActions.setIsLoading(false));
    },
  removeTask:
    (id: string, todolistId: string): AppThunk =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(
        todolistsActions.setIsLoading({ id: todolistId, isLoading: true })
      );
      dispatch(
        tasksActions.setIsLoading({ todolistId, taskId: id, isLoading: true })
      );

      try {
        const responseData = await todolistsAPI.deleteTask(todolistId, id);

        responseData.resultCode !== 0
          ? handleServerAppError(responseData, dispatch)
          : dispatch(tasksActions.removeTask({ id, todolistId }));
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(
          todolistsActions.setIsLoading({ id: todolistId, isLoading: false })
        );
      }
    },
  addTask:
    (title: string, todolistId: string): AppThunk =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(
        todolistsActions.setIsLoading({ id: todolistId, isLoading: true })
      );

      try {
        const responseData = await todolistsAPI.createTask(todolistId, title);

        responseData.resultCode !== 0
          ? handleServerAppError(responseData, dispatch)
          : dispatch(tasksActions.addTask(responseData.data.item));
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(
          todolistsActions.setIsLoading({ id: todolistId, isLoading: false })
        );
      }
    },
  updateTask:
    (
      todolistId: string,
      taskId: string,
      domainModel: UpdateTaskDomainModelType
    ): AppThunk =>
    async (dispatch, getState) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(
        todolistsActions.setIsLoading({ id: todolistId, isLoading: true })
      );
      dispatch(
        tasksActions.setIsLoading({ todolistId, taskId, isLoading: true })
      );

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
              tasksActions.updateTask({
                apiModel: responseData.data.item,
                todolistId,
                taskId,
              })
            );
      } catch (error) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(
          todolistsActions.setIsLoading({ id: todolistId, isLoading: false })
        );
        dispatch(
          tasksActions.setIsLoading({ todolistId, taskId, isLoading: false })
        );
      }
    },
};
