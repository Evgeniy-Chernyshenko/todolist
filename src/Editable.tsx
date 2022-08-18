import { ChangeEvent, KeyboardEvent, useState } from "react";

type PropsType = {
  title: string;
  onChange: (value: string) => void;
};

export function Editable(props: PropsType) {
  const [value, setValue] = useState(props.title);
  const [isEditMode, setIsEditMode] = useState(false);

  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const activateEditMode = () => {
    setIsEditMode(true);
  };

  const activateViewMode = () => {
    const clearValue = value.trim();

    if (!clearValue) {
      setValue(props.title);
    } else {
      setValue(clearValue);
      props.onChange(clearValue);
    }

    setIsEditMode(false);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    e.code === "Enter" && activateViewMode();
  };

  return isEditMode ? (
    <input
      value={value}
      onChange={onChangeTitleHandler}
      autoFocus
      onBlur={activateViewMode}
      onKeyPress={onKeyPressHandler}
    />
  ) : (
    <span onDoubleClick={activateEditMode}>{value}</span>
  );
}
