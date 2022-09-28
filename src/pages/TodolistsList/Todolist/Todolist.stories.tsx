import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useSelector } from "react-redux";
import { ReduxStoreProviderDecorator } from "../../../store/ReduxStoreProviderDecorator";
import { RootStateType } from "../../../store/store";
import { Todolist } from "./Todolist";

export default {
  title: "Todolist/Todolist",
  component: Todolist,
  decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof Todolist>;

const TodolistWithRedux = () => {
  const todolist = useSelector<RootStateType, RootStateType["todolists"][0]>(
    (state) =>
      state.todolists.find(
        ({ id }) => id === "todolist1Id"
      ) as RootStateType["todolists"][0]
  );

  return <Todolist {...todolist} />;
};

const Template: ComponentStory<typeof Todolist> = () => {
  return <TodolistWithRedux />;
};

export const TodolistExample = Template.bind({});
