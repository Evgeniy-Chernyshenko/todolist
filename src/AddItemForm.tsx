import { ChangeEvent, KeyboardEvent, useState } from "react";

type PropsType = {
  onAddItem: (value: string) => void;
};

export function AddItemForm(props: PropsType) {
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
    <div>
      <input
        type="text"
        className={error ? "error" : ""}
        value={value}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        onBlur={onBlurHandler}
      />
      <button onClick={onButtonClickHandler} onBlur={onBlurHandler}>
        +
      </button>
      {error && <div className="errorMessage">{error}</div>}
    </div>
  );
}
