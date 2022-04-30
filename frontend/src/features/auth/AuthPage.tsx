import { useForm } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import useAuth from 'providers/AuthProvider';
import React, { PropsWithChildren, ReactElement } from 'react';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Button,
  Anchor,
  Container,
  Title,
  AppShell,
  Group,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'tabler-icons-react';
import { showErrorNotification } from 'utils/error';
import {
  NOTIFICATION_COLORS,
  NOTIFICATION_ICON_SIZE,
} from 'utils/notifications';

interface AuthPageProps {
  description: ReactElement;
}

const AuthPage = ({
  description,
  children,
}: PropsWithChildren<AuthPageProps>) => {
  return (
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
      fixed
    >
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          Welcome to Reserv.io
        </Title>
        {description}
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Group direction="column" spacing={16} grow>
            {children}
          </Group>
        </Paper>
      </Container>
    </AppShell>
  );
};

export const LoginPage = () => {
  const navigate = useNavigate();

  const auth = useAuth();

  const initialValues = { username: '', password: '' };
  const form = useForm({
    initialValues,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        auth
          .login({
            username: values.username!,
            password: values.password!,
          })
          .catch(() =>
            showNotification({
              color: NOTIFICATION_COLORS.error,
              icon: <X size={NOTIFICATION_ICON_SIZE} />,
              title: 'Login Failed',
              message: 'Your email or password is incorrect',
            })
          )
      )}
    >
      <AuthPage
        description={
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Do not have an account yet?{' '}
            <Anchor<'a'>
              href="#"
              size="sm"
              onClick={(event) => {
                event.preventDefault();
                navigate('/register');
              }}
            >
              Create account
            </Anchor>
          </Text>
        }
      >
        <TextInput
          label="Email"
          placeholder="Your email"
          required
          {...form.getInputProps('username')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          {...form.getInputProps('password')}
        />
        <Button fullWidth mt="md" type="submit" disabled={auth.isLoading}>
          Sign in
        </Button>
      </AuthPage>
    </form>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const initialValues = { name: '', email: '', password: '' };
  const form = useForm({
    initialValues,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        auth
          .signUp({
            name: values.name!,
            email: values.email!,
            password: values.password!,
          })
          .then(() => {
            navigate('/');
            showNotification({
              color: NOTIFICATION_COLORS.success,
              icon: <Check size={NOTIFICATION_ICON_SIZE} />,
              title: 'Account Created',
              message: 'Account was successfully created!',
            });
          })
          .catch(showErrorNotification);
      })}
    >
      <AuthPage
        description={
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Already have an account?{' '}
            <Anchor<'a'>
              href="#"
              size="sm"
              onClick={(event) => {
                event.preventDefault();
                navigate('/');
              }}
            >
              Sign in
            </Anchor>
          </Text>
        }
      >
        <TextInput
          label="Name"
          placeholder="Your name"
          required
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          placeholder="Your email"
          required
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          {...form.getInputProps('password')}
        />
        <Button fullWidth mt="md" type="submit">
          Create account
        </Button>
      </AuthPage>
    </form>
  );
};
