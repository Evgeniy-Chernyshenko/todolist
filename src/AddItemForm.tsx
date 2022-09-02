import { Add } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useState, memo } from "react";

type PropsType = {
  onAddItem: (value: string) => void;
  label: string;
};

export const AddItemForm = memo((props: PropsType) => {
  console.log("AddItemForm");

  const [value, setValue] = useState("");
  const [error, setError] = useState<null | string>(null);

  const addItem = () => {
    const clearValue = value.trim();

    if (!clearValue) {
      setError("Field is required");
      return;
    }

    props.onAddItem(clearValue);
    setValue("");
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);

    setValue(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    e.code === "Enter" && addItem();
  };

  const onBlurHandler = () => {
    setError(null);
  };

  const onButtonClickHandler = () => {
    addItem();
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <TextField
        value={value}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        onBlur={onBlurHandler}
        label={props.label}
        variant="outlined"
        size="small"
        error={!!error}
        helperText={error ? error : ""}
        fullWidth
      />
      <IconButton
        aria-label="add task"
        onClick={onButtonClickHandler}
        onBlur={onBlurHandler}
      >
        <Add />
      </IconButton>
    </Box>
  );
});
