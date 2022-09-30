import { TextField, Typography } from "@mui/material";
import { ChangeEvent, KeyboardEvent, memo, useCallback, useState } from "react";

type PropsType = {
  title: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const Editable = memo((props: PropsType) => {
  const [value, setValue] = useState(props.title);
  const [isEditMode, setIsEditMode] = useState(false);

  const onChangeTitleHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value);
    },
    []
  );

  const activateEditMode = useCallback(() => {
    if (props.disabled) {
      return;
    }

    setValue(props.title);
    setIsEditMode(true);
  }, [props.title, props.disabled]);

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
