import { v1 } from "uuid";
import {
  TodolistDomainType,
  todolistsActions,
  todolistsReducer,
  todolistsThunks,
} from "./todolists-reducer";

let todolist1Id = v1();
let todolist2Id = v1();

let startState: TodolistDomainType[];

beforeEach(() => {
  startState = [
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

test("todolist should be removed", () => {
  const endState = todolistsReducer(
    startState,
    todolistsThunks.removeTodolist.fulfilled(
      todolist1Id,
      "requestId",
      todolist1Id
    )
  );

  expect(endState).toHaveLength(1);
  expect(endState[0].id).toBe(todolist2Id);
});

test("todolist should be added", () => {
  const endState = todolistsReducer(
    startState,
    todolistsThunks.addTodolist.fulfilled(
      {
        addedDate: "",
        id: "new id",
        order: 0,
        title: "New todolist",
      },
      "requestId",
      "New todolist"
    )
  );

  expect(endState).toHaveLength(3);
  expect(endState[0].title).toBe("New todolist");
  expect(endState[0].filter).toBe("all");
});

test("todolist title should be changed", () => {
  const endState = todolistsReducer(
    startState,
    todolistsThunks.changeTodolistTitle.fulfilled(
      {
        id: todolist2Id,
        title: "New todolist",
      },
      "requestId",
      {
        id: todolist2Id,
        title: "New todolist",
      }
    )
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe("New todolist");
});

test("todolist filter should be changed", () => {
  const filter = "completed";
  const endState = todolistsReducer(
    startState,
    todolistsActions.changeTodolistFilter({ filter, id: todolist2Id })
  );

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(filter);
});

test("todolist isLoading should be changed", () => {
  const endState = todolistsReducer(
    startState,
    todolistsActions.setIsLoading({ id: todolist2Id, isLoading: true })
  );

  expect(endState[0].isLoading).toBe(false);
  expect(endState[1].isLoading).toBe(true);
});
