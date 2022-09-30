import { useCallback, useEffect } from "react";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  todolistsActions,
  todolistsThunks,
} from "../../store/todolists-reducer";
import Grid from "@mui/material/Unstable_Grid2";
import { Navigate } from "react-router-dom";

export const TodolistsList = () => {
  const isAuth = useAppSelector((state) => state.auth.id !== null);
  const todolists = useAppSelector((state) => state.todolists);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuth) {
      return;
    }

    dispatch(todolistsThunks.setTodolists());

    return () => {
      dispatch(todolistsActions.clearTodolists());
    };
  }, [dispatch, isAuth]);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.addTodolists(title));
    },
    [dispatch]
  );

  if (!isAuth) {
    return <Navigate replace to="/login" />;
  }

  return (
    <Grid container spacing={4}>
      <Grid xs={12}>
        <AddItemForm onAddItem={addTodolist} label="New todolist title" />
      </Grid>

      {todolists.map((todolist) => {
        return <Todolist key={todolist.id} {...todolist} />;
      })}
    </Grid>
  );
};
