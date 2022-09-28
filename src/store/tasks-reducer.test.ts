import { TaskPriorities, TaskStatuses } from "../api/todolists-api";
import { tasksActions, tasksReducer, TasksStateType } from "./tasks-reducer";

let startState: TasksStateType;
beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "taskId1",
        title: "Task 1",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
      {
        id: "taskId2",
        title: "Task 2",
        status: TaskStatuses.Completed,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
      {
        id: "taskId3",
        title: "Task 3",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
    ],
    todolistId2: [
      {
        id: "taskId1",
        title: "Task 4",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        isLoading: false,
      },
      {
        id: "taskId2",
        title: "Task 5",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        isLoading: false,
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const endState = tasksReducer(
    startState,
    tasksActions.removeTask("taskId2", "todolistId1")
  );

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "taskId1",
        title: "Task 1",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
      {
        id: "taskId3",
        title: "Task 3",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
    ],
    todolistId2: [
      {
        id: "taskId1",
        title: "Task 4",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        isLoading: false,
      },
      {
        id: "taskId2",
        title: "Task 5",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        isLoading: false,
      },
    ],
  });
});

test("correct task should be added to correct array", () => {
  const action = tasksActions.addTask({
    addedDate: "",
    deadline: "",
    description: "",
    id: "",
    order: 0,
    priority: TaskPriorities.Low,
    startDate: "",
    status: TaskStatuses.New,
    title: "juce",
    todoListId: "todolistId2",
  });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(3);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    tasksActions.updateTask("todolistId2", "taskId1", {
      status: TaskStatuses.Completed,
      deadline: "",
      description: "",
      priority: TaskPriorities.Low,
      startDate: "",
      title: "Task 4",
    })
  );

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "taskId1",
        title: "Task 1",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
      {
        id: "taskId2",
        title: "Task 2",
        status: TaskStatuses.Completed,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
      {
        id: "taskId3",
        title: "Task 3",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
    ],
    todolistId2: [
      {
        id: "taskId1",
        title: "Task 4",
        status: TaskStatuses.Completed,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        isLoading: false,
      },
      {
        id: "taskId2",
        title: "Task 5",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        isLoading: false,
      },
    ],
  });
});

test("title of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    tasksActions.updateTask("todolistId2", "taskId1", {
      title: "New task 4",
      deadline: "",
      description: "",
      priority: TaskPriorities.Low,
      startDate: "",
      status: TaskStatuses.InProgress,
    })
  );

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "taskId1",
        title: "Task 1",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
      {
        id: "taskId2",
        title: "Task 2",
        status: TaskStatuses.Completed,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
      {
        id: "taskId3",
        title: "Task 3",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId1",
        isLoading: false,
      },
    ],
    todolistId2: [
      {
        id: "taskId1",
        title: "New task 4",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        isLoading: false,
      },
      {
        id: "taskId2",
        title: "Task 5",
        status: TaskStatuses.InProgress,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        todoListId: "todolistId2",
        isLoading: false,
      },
    ],
  });
});

test("tasks set should be correct", () => {
  const endState = tasksReducer(
    { todolistId1: [], todolistId2: [] },
    tasksActions.setTasks(startState.todolistId1, "todolistId1")
  );

  expect(endState.todolistId1).toHaveLength(3);
  expect(endState.todolistId2).toHaveLength(0);
});

test("task isLoading set should be correct", () => {
  const endState = tasksReducer(
    startState,
    tasksActions.setIsLoading("todolistId2", "taskId2", true)
  );

  expect(endState.todolistId1[0].isLoading).toBe(false);
  expect(endState.todolistId1[1].isLoading).toBe(false);
  expect(endState.todolistId1[2].isLoading).toBe(false);
  expect(endState.todolistId2[0].isLoading).toBe(false);
  expect(endState.todolistId2[1].isLoading).toBe(true);
});
