import { AppShell } from '@mantine/core';
import NavigationBar from 'components/layout/navbar/NavigationBar';
import { PropsWithChildren } from 'react';

const LayoutWrapper = ({ children }: PropsWithChildren<{}>) => {
  return (
    <AppShell
      navbar={<NavigationBar />}
      fixed
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};

export default LayoutWrapper;
