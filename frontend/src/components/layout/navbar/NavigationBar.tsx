import { Avatar, Code, createStyles, Group, Navbar, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Role } from 'features/users/models/User';
import useAuth from 'providers/AuthProvider';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bike, Calendar, Icon, Logout, User } from 'tabler-icons-react';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colorScheme === 'dark'
            ? theme.white
            : theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === 'dark' ? 5 : 7
            ],
        },
      },
    },
  };
});

const NavigationBar = () => {
  const { classes, cx } = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const { logout, user } = useAuth();

  const availablePages = useMemo(() => {
    let pages: { link: string; label: string; icon: Icon }[] = [];

    if (user?.roles.includes(Role.User)) {
      pages = pages.concat([
        { link: 'available-bikes', label: 'Available Bikes', icon: Bike },
        { link: 'my-reservations', label: 'My Reservations', icon: Calendar },
      ]);
    }

    if (user?.roles.includes(Role.Manager)) {
      pages = pages.concat([
        { link: 'manage-users', label: 'Manage Users', icon: User },
        { link: 'manage-bikes', label: 'Manage Bikes', icon: Bike },
      ]);
    }

    return pages;
  }, [user]);

  const links = availablePages.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.link === active.split('/')[1],
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        navigate(`/${item.link}`);
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </a>
  ));

  const modals = useModals();

  const openLogoutModal = () =>
    modals.openConfirmModal({
      title: 'Confirm Logout',
      centered: true,
      children: <Text>Are you sure you want to logout?</Text>,
      labels: { confirm: 'Logout', cancel: 'Nevermind' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        logout();
        navigate('/');
      },
    });

  return (
    <Navbar width={{ sm: 300 }} p="md">
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <h1>Reserv.io</h1>
          <Code sx={{ fontWeight: 700 }}>v0.0.7</Code>
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section>
        <Group>
          <Avatar radius="xl" />
          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {user?.name}
            </Text>
            <Text color="dimmed" size="xs">
              {user?.email}
            </Text>
          </div>
        </Group>
      </Navbar.Section>
      <Navbar.Section className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            openLogoutModal();
          }}
        >
          <Logout className={classes.linkIcon} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
};

export default NavigationBar;
