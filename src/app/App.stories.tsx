import { ComponentStory, ComponentMeta } from "@storybook/react";
import App from "./App";
import { ReduxStoreProviderDecorator } from "../store/ReduxStoreProviderDecorator";
import { withRouter } from "storybook-addon-react-router-v6";

export default {
  title: "Todolist/App",
  component: App,
  decorators: [ReduxStoreProviderDecorator, withRouter],
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = () => <App />;

export const AppExample = Template.bind({});
