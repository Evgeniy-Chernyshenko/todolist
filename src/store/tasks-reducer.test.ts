import { TasksStateType } from "../App";
import { actions, tasksReducer } from "./tasks-reducer";

let startState: TasksStateType;
beforeEach(() => {
  startState = {
    todolistId1: [
      { id: "taskId1", title: "Task 1", isDone: false },
      { id: "taskId2", title: "Task 2", isDone: true },
      { id: "taskId3", title: "Task 3", isDone: false },
    ],
    todolistId2: [
      { id: "taskId1", title: "Task 4", isDone: false },
      { id: "taskId2", title: "Task 5", isDone: false },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const endState = tasksReducer(
    startState,
    actions.removeTask("taskId2", "todolistId1")
  );

  expect(endState).toEqual({
    todolistId1: [
      { id: "taskId1", title: "Task 1", isDone: false },
      { id: "taskId3", title: "Task 3", isDone: false },
    ],
    todolistId2: [
      { id: "taskId1", title: "Task 4", isDone: false },
      { id: "taskId2", title: "Task 5", isDone: false },
    ],
  });
});

test("correct task should be added to correct array", () => {
  const action = actions.addTask("juce", "todolistId2");

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(3);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][2].title).toBe("juce");
  expect(endState["todolistId2"][0].isDone).toBe(false);
});

test("status of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    actions.changeTaskStatus("taskId1", true, "todolistId2")
  );

  expect(endState).toEqual({
    todolistId1: [
      { id: "taskId1", title: "Task 1", isDone: false },
      { id: "taskId2", title: "Task 2", isDone: true },
      { id: "taskId3", title: "Task 3", isDone: false },
    ],
    todolistId2: [
      { id: "taskId1", title: "Task 4", isDone: true },
      { id: "taskId2", title: "Task 5", isDone: false },
    ],
  });
});

test("title of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    actions.changeTaskTitle("taskId1", "New task 4", "todolistId2")
  );

  expect(endState).toEqual({
    todolistId1: [
      { id: "taskId1", title: "Task 1", isDone: false },
      { id: "taskId2", title: "Task 2", isDone: true },
      { id: "taskId3", title: "Task 3", isDone: false },
    ],
    todolistId2: [
      { id: "taskId1", title: "New task 4", isDone: false },
      { id: "taskId2", title: "Task 5", isDone: false },
    ],
  });
});
