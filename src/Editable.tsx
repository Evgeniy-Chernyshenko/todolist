import { TextField, Typography } from "@mui/material";
import { ChangeEvent, KeyboardEvent, memo, useCallback, useState } from "react";

type PropsType = {
  title: string;
  onChange: (value: string) => void;
};

export const Editable = memo((props: PropsType) => {
  console.log("Editable");

  const [value, setValue] = useState(props.title);
  const [isEditMode, setIsEditMode] = useState(false);

  const onChangeTitleHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value);
    },
    []
  );

  const activateEditMode = useCallback(() => {
    setValue(props.title);
    setIsEditMode(true);
  }, [props.title]);

  const activateViewMode = useCallback(() => {
    const clearValue = value.trim();

    if (!clearValue) {
      setValue(props.title);
    } else {
      setValue(clearValue);
      props.onChange(clearValue);
    }

    setIsEditMode(false);
  }, [props, value]);

  const onKeyPressHandler = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.code === "Enter" && activateViewMode();
    },
    [activateViewMode]
  );

  return isEditMode ? (
    <TextField
      value={value}
      onChange={onChangeTitleHandler}
      autoFocus
      onBlur={activateViewMode}
      onKeyPress={onKeyPressHandler}
      variant="standard"
      fullWidth
    />
  ) : (
    <Typography
      onDoubleClick={activateEditMode}
      sx={{ wordBreak: "break-word" }}
    >
      {props.title}
    </Typography>
  );
});
