import { v1 } from "uuid";
import { FilterValuesType, TodolistType } from "../Todolist";
import { actions, todolistReducer } from "./todolists-reducer";

let todolist1Id = v1();
let todolist2Id = v1();

let startState: TodolistType[];

beforeEach(() => {
  startState = [
    { id: todolist1Id, title: "What to learn", filter: "all" },
    { id: todolist2Id, title: "What to buy", filter: "all" },
  ];
});

test("todolist should be removed", () => {
  const endState = todolistReducer(
    startState,
    actions.removeTodolist(todolist1Id)
  );

  expect(endState).toHaveLength(1);
  expect(endState[0].id).toBe(todolist2Id);
});

test("todolist should be added", () => {
  const endState = todolistReducer(
    startState,
    actions.addTodolist("New todolist")
  );

  expect(endState).toHaveLength(3);
  expect(endState[2].title).toBe("New todolist");
  expect(endState[2].filter).toBe("all");
});

test("todolist title should be changed", () => {
  const endState = todolistReducer(
    startState,
    actions.changeTodolistTitle(todolist2Id, "New todolist")
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe("New todolist");
});

test("todolist filter should be changed", () => {
  const filter = "completed";
  const endState = todolistReducer(
    startState,
    actions.changeTodolistFilter(todolist2Id, filter)
  );

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(filter);
});
