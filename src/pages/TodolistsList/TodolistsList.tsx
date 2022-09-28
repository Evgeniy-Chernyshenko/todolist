import { useCallback, useEffect } from "react";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { todolistsThunks } from "../../store/todolists-reducer";
import Grid from "@mui/material/Unstable_Grid2";

export const TodolistsList = () => {
  const todolists = useAppSelector((state) => state.todolists);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(todolistsThunks.setTodolists());
  }, [dispatch]);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.addTodolists(title));
    },
    [dispatch]
  );

  return (
    <>
      <Grid xs={12}>
        <AddItemForm onAddItem={addTodolist} label="New todolist title" />
      </Grid>

      {todolists.map((todolist) => {
        return <Todolist key={todolist.id} {...todolist} />;
      })}
    </>
  );
};
