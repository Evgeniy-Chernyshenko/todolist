import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
import { AppDispatch, RootStateType } from "./store";
import { todolistsActions, todolistsThunks } from "./todolists-reducer";

const initialState: TasksStateType = {};

const slice = createSlice({
  initialState,
  name: "tasks",
  reducers: {
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
    builder
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload];
      })
      .addCase(todolistsActions.setTodolists, (_, action) => {
        return action.payload.reduce((a, c) => ({ ...a, [c.id]: [] }), {});
      })
      .addCase(todolistsActions.clearTodolists, () => {
        return {};
      })
      .addCase(tasksThunks.setTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((v) => ({
          ...v,
          isLoading: false,
        }));
      })
      .addCase(tasksThunks.removeTask.fulfilled, (state, action) => {
        state[action.payload.todolistId] = state[
          action.payload.todolistId
        ].filter((v) => v.id !== action.payload.id);
      })
      .addCase(tasksThunks.addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift({
          ...action.payload,
          isLoading: false,
        });
      })
      .addCase(tasksThunks.updateTask.fulfilled, (state, action) => {
        state[action.payload.todolistId] = state[action.payload.todolistId].map(
          (v) =>
            v.id === action.payload.taskId
              ? { ...v, ...action.payload.apiModel }
              : v
        );
      });
  },
});

export const tasksThunks = {
  setTasks: createAsyncThunk<
    { tasks: TaskType[]; todolistId: string },
    string,
    { dispatch: AppDispatch; rejectValue: void }
  >("tasks/setTasks", async (todolistId, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setIsLoading(true));

    try {
      const responseData = await todolistsAPI.getTasks(todolistId);

      return { tasks: responseData.items, todolistId };
    } catch (e) {
      handleServerNetworkError(e, dispatch);

      return rejectWithValue();
    } finally {
      dispatch(appActions.setIsLoading(false));
    }
  }),
  removeTask: createAsyncThunk<
    { id: string; todolistId: string },
    { id: string; todolistId: string },
    { dispatch: AppDispatch; rejectValue: void }
  >(
    "tasks/removeTask",
    async ({ id, todolistId }, { dispatch, rejectWithValue }) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(
        todolistsActions.setIsLoading({ id: todolistId, isLoading: true })
      );
      dispatch(
        tasksActions.setIsLoading({ todolistId, taskId: id, isLoading: true })
      );

      try {
        const responseData = await todolistsAPI.deleteTask(todolistId, id);

        if (responseData.resultCode !== 0) {
          handleServerAppError(responseData, dispatch);

          return rejectWithValue();
        } else {
          return { id, todolistId };
        }
      } catch (error) {
        handleServerNetworkError(error, dispatch);

        return rejectWithValue();
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(
          todolistsActions.setIsLoading({ id: todolistId, isLoading: false })
        );
      }
    }
  ),
  addTask: createAsyncThunk<
    TaskType,
    { title: string; todolistId: string },
    { dispatch: AppDispatch; rejectValue: void }
  >(
    "tasks/addTask",
    async ({ title, todolistId }, { dispatch, rejectWithValue }) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(
        todolistsActions.setIsLoading({ id: todolistId, isLoading: true })
      );

      try {
        const responseData = await todolistsAPI.createTask(todolistId, title);

        if (responseData.resultCode !== 0) {
          handleServerAppError(responseData, dispatch);

          return rejectWithValue();
        } else {
          return responseData.data.item;
        }
      } catch (error) {
        handleServerNetworkError(error, dispatch);

        return rejectWithValue();
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(
          todolistsActions.setIsLoading({ id: todolistId, isLoading: false })
        );
      }
    }
  ),
  updateTask: createAsyncThunk<
    { apiModel: TaskType; todolistId: string; taskId: string },
    {
      todolistId: string;
      taskId: string;
      domainModel: UpdateTaskDomainModelType;
    },
    { dispatch: AppDispatch; rejectValue: void; state: RootStateType }
  >(
    "tasks/updateTask",
    async (
      { todolistId, taskId, domainModel },
      { dispatch, getState, rejectWithValue }
    ) => {
      dispatch(appActions.setIsLoading(true));
      dispatch(
        todolistsActions.setIsLoading({ id: todolistId, isLoading: true })
      );
      // TODO: переписыть это на .pending
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

        if (responseData.resultCode !== 0) {
          handleServerAppError(responseData, dispatch);

          return rejectWithValue();
        } else {
          return {
            apiModel: responseData.data.item,
            todolistId,
            taskId,
          };
        }
      } catch (error) {
        handleServerNetworkError(error, dispatch);

        return rejectWithValue();
      } finally {
        dispatch(appActions.setIsLoading(false));
        dispatch(
          todolistsActions.setIsLoading({ id: todolistId, isLoading: false })
        );
        dispatch(
          tasksActions.setIsLoading({ todolistId, taskId, isLoading: false })
        );
      }
    }
  ),
};

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;

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
