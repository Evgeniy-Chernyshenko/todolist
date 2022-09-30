import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useFormik } from "formik";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { authThunks } from "../../store/auth-reducer";

export const Login = () => {
  const isAuth = useAppSelector((store) => store.auth.id !== null);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};

      if (!values.email) {
        errors.email = "Email is required";
      }

      if (!values.password) {
        errors.password = "Password is required";
      }

      return errors;
    },
    onSubmit: (values) => {
      dispatch(authThunks.login(values));
    },
  });

  if (isAuth) {
    return <Navigate replace to="/" />;
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a
                  href={"https://social-network.samuraijs.com/"}
                  rel="noreferrer"
                  target={"_blank"}
                >
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                {...formik.getFieldProps("email")}
                error={!!formik.errors.email}
                helperText={!!formik.errors.email && formik.errors.email}
              />
              <div>{formik.errors.email}</div>
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
                error={!!formik.errors.password}
                helperText={!!formik.errors.password && formik.errors.password}
              />
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox {...formik.getFieldProps("rememberMe")} />}
              />
              <Button variant="contained" type="submit">
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
