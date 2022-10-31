import { tasksReducer, TasksStateType } from "./tasks-reducer";

import { v1 } from "uuid";
import {
  todolistsActions,
  todolistsReducer,
  TodolistDomainType,
} from "./todolists-reducer";
import {
  TaskPriorities,
  TaskStatuses,
  TodolistType,
} from "../api/todolists-api";

const todolist1Id = v1();
const todolist2Id = v1();
let startTodolistState: TodolistDomainType[];
beforeEach(() => {
  startTodolistState = [
    {
      id: todolist1Id,
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      isLoading: false,
    },
    {
      id: todolist2Id,
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 0,
      isLoading: false,
    },
  ];
});

let startTasksState: TasksStateType;
beforeEach(() => {
  startTasksState = {
    [todolist1Id]: [
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
    [todolist2Id]: [
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
        todoListId: "todolistId1",
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
        todoListId: "todolistId1",
        isLoading: false,
      },
    ],
  };
});

test("ids should be equals", () => {
  const action = todolistsActions.addTodolist({
    addedDate: "",
    id: "new id",
    order: 0,
    title: "New todolist",
  });

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[2];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodolists).toBe(action.payload.id);
});

test("property with todolistId should be deleted", () => {
  const action = todolistsActions.removeTodolist(todolist2Id);

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistState, action);

  expect(Object.keys(endTasksState).length).toBe(1);
  expect(endTasksState[todolist2Id]).not.toBeDefined();
  expect(endTodolistsState.length).toBe(1);
});

test("property with todolistId should be deleted", () => {
  const action = todolistsActions.removeTodolist(todolist2Id);

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistState, action);

  expect(Object.keys(endTasksState).length).toBe(1);
  expect(endTasksState[todolist2Id]).not.toBeDefined();
  expect(endTodolistsState.length).toBe(1);
});

test("todolists set should be correct", () => {
  const todolistsResponseFromAPI: TodolistType[] = [
    {
      id: todolist1Id,
      title: "What to learn",
      addedDate: "",
      order: 0,
    },
    {
      id: todolist2Id,
      title: "What to buy",
      addedDate: "",
      order: 0,
    },
  ];

  const action = todolistsActions.setTodolists(todolistsResponseFromAPI);

  const endTodolistsState = todolistsReducer([], action);
  const endTasksState = tasksReducer({}, action);

  expect(endTodolistsState).toHaveLength(2);
  expect(endTasksState[todolist1Id]).toStrictEqual([]);
  expect(endTasksState[todolist2Id]).toStrictEqual([]);
});
