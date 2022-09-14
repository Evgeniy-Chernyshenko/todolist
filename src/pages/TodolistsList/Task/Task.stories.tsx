import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Task } from "./Task";
import { TaskStatuses } from "../../../api/todolists-api";

export default {
  title: "Todolist/Task",
  component: Task,
  args: {
    changeTaskStatus: action("changeTaskStatus"),
    changeTaskTitle: action("changeTaskTitle"),
    removeTask: action("removeTask"),
    id: "1",
    isDone: false,
    title: "HTML",
  },
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsNotDone = Template.bind({});

export const TaskIsDone = Template.bind({});
TaskIsDone.args = {
  status: TaskStatuses.Completed,
};
