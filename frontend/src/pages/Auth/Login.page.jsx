import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBoundStore from "../../store/Store";
import {
  TextInput,
  Title,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Container,
  Group,
  Button,
} from "@mantine/core";
import classes from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginService, authLoading, user } = useBoundStore((state) => state);

  useEffect(() => {
    if (!!user) {
      navigate("/posts");
    }
  }, [user]);

  const onLogin = async (e) => {
    e.preventDefault();
    let email = e.target.email?.value;
    let password = e.target.password?.value;
    if (!email || !password) return;
    loginService(email, password);
  };
  return (
    <Container size={460} my={30}>
      <Title className={classes.title} ta="center">
        Login Page
      </Title>
      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={onLogin}>
          <TextInput
            label="Email"
            placeholder="email"
            name="email"
            type="email"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="password"
            name="password"
            type="password"
            required
            mt="md"
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            login
          </Button>
          {authLoading ? <h2>Loading...</h2> : null}
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
