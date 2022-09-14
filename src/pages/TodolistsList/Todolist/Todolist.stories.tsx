import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useSelector } from "react-redux";
import { ReduxStoreProviderDecorator } from "../../../store/ReduxStoreProviderDecorator";
import { AppStateType } from "../../../store/store";
import { Todolist } from "./Todolist";

export default {
  title: "Todolist/Todolist",
  component: Todolist,
  decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof Todolist>;

const TodolistWithRedux = () => {
  const todolist = useSelector<AppStateType, AppStateType["todolists"][0]>(
    (state) =>
      state.todolists.find(
        ({ id }) => id === "todolist1Id"
      ) as AppStateType["todolists"][0]
  );

  return <Todolist {...todolist} />;
};

const Template: ComponentStory<typeof Todolist> = () => {
  return <TodolistWithRedux />;
};

export const TodolistExample = Template.bind({});
