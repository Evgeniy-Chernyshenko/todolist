import { tasksReducer, TasksStateType } from "./tasks-reducer";

import { v1 } from "uuid";
import {
  todolistsActions,
  todolistsReducer,
  TodolistType,
} from "./todolists-reducer";

const todolist1Id = v1();
const todolist2Id = v1();
let startTodolistState: TodolistType[];
beforeEach(() => {
  startTodolistState = [
    { id: todolist1Id, title: "What to learn", filter: "all" },
    { id: todolist2Id, title: "What to buy", filter: "all" },
  ];
});

let startTasksState: TasksStateType;
beforeEach(() => {
  startTasksState = {
    [todolist1Id]: [
      { id: "taskId1", title: "Task 1", isDone: false },
      { id: "taskId2", title: "Task 2", isDone: true },
      { id: "taskId3", title: "Task 3", isDone: false },
    ],
    [todolist2Id]: [
      { id: "taskId1", title: "Task 4", isDone: false },
      { id: "taskId2", title: "Task 5", isDone: false },
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
