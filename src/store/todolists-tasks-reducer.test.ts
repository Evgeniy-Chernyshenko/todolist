import { tasksReducer, TasksStateType } from "./tasks-reducer";

import { v1 } from "uuid";
import {
  todolistsActions,
  todolistsReducer,
  TodolistDomainType,
} from "./todolists-reducer";
import { TaskPriorities, TaskStatuses } from "../api/todolists-api";

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
    },
    {
      id: todolist2Id,
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 0,
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
      },
    ],
  };
});

test("ids should be equals", () => {
  const action = todolistsActions.addTodolist("New todolist");

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[2];
  const idFromTodolists = endTodolistsState[2].id;

  expect(idFromTasks).toBe(action.id);
  expect(idFromTodolists).toBe(action.id);
});

test("property with todolistId should be deleted", () => {
  const action = todolistsActions.removeTodolist(todolist2Id);

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistState, action);

  expect(Object.keys(endTasksState).length).toBe(1);
  expect(endTasksState[todolist2Id]).not.toBeDefined();
  expect(endTodolistsState.length).toBe(1);
});
