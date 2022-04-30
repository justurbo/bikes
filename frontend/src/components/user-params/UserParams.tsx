import { Text } from '@mantine/core';
import { User } from 'features/users/models';
import React from 'react';

export interface UserParamsProps {
  user: User;
}

export const UserName = ({ user }: UserParamsProps) => (
  <>
    <Text size="sm" weight={500}>
      {user.name}
    </Text>
    <Text color="dimmed" size="xs">
      Name
    </Text>
  </>
);

export const UserEmail = ({ user }: UserParamsProps) => (
  <>
    <Text size="sm">{user.email}</Text>
    <Text size="xs" color="dimmed">
      Email
    </Text>
  </>
);

export const UserRoles = ({ user }: UserParamsProps) => (
  <>
    <Text size="sm">{user.roles.join(', ')}</Text>
    <Text size="xs" color="dimmed">
      Roles
    </Text>
  </>
);
