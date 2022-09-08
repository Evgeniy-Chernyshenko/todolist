import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AddItemForm } from "./AddItemForm";
import { action } from "@storybook/addon-actions";

export default {
  title: "Todolist/AddItemForm",
  component: AddItemForm,
  argTypes: {
    onAddItem: { description: 'call when button clicked or press "Enter"' },
  },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => (
  <AddItemForm {...args} />
);

export const BaseExample = Template.bind({});
BaseExample.args = {
  label: "labelText",
  onAddItem: action("call onAddItem callback"),
};

// import { AddItemForm } from "./AddItemForm";

// export default {
//   title: "AddItemForm Component",
//   component: AddItemForm,
// };

// export const AddItemFormExample = () => {
//   return <AddItemForm label="labelText" onAddItem={(title) => alert(title)} />;
// };
