import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  fetchAddUser,
  fetchRemoveUser,
  fetchUpdateUser,
  useUsers,
} from 'api/users';
import { LayoutWrapper } from 'components';
import {
  UserEmail,
  UserName,
  UserRoles,
} from 'components/user-params/UserParams';
import { AddUserModal } from 'features/users/components';
import { EditUserModal } from 'features/users/components/AddEditUserModal';
import { User } from 'features/users/models';
import useAuth from 'providers/AuthProvider';
import React, { useState } from 'react';
import { Avatar, Table, Group, Text, Menu, Paper, Button } from '@mantine/core';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Trash, Edit, CalendarStats, Plus, Check } from 'tabler-icons-react';
import { showErrorNotification } from 'utils/error';
import {
  NOTIFICATION_COLORS,
  NOTIFICATION_ICON_SIZE,
} from 'utils/notifications';

const UsersPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { data: users } = useUsers();
  const { mutate: removeUser } = useMutation(fetchRemoveUser, {
    onSuccess: (res) => {
      if (res.id === auth.user!.id) {
        auth.logout();
        navigate('/');
        return;
      }
      queryClient.invalidateQueries('users');
      showNotification({
        color: NOTIFICATION_COLORS.success,
        icon: <Check size={NOTIFICATION_ICON_SIZE} />,
        title: 'User Removed',
        message: 'User was successfully removed!',
      });
    },
    onError: showErrorNotification,
  });
  const { mutate: addUser, isLoading: isAddUserLoading } = useMutation(
    fetchAddUser,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        showNotification({
          color: NOTIFICATION_COLORS.success,
          icon: <Check size={NOTIFICATION_ICON_SIZE} />,
          title: 'User Added',
          message: 'User was successfully added!',
        });
      },
      onError: showErrorNotification,
    }
  );
  const { mutate: updateUser, isLoading: isUpdateUserLoading } = useMutation(
    fetchUpdateUser,
    {
      onSuccess: (user) => {
        if (user.id === auth.user!.id) {
          auth.logout();
          navigate('/');
          return;
        }
        queryClient.invalidateQueries('users');
        showNotification({
          color: NOTIFICATION_COLORS.success,
          icon: <Check size={NOTIFICATION_ICON_SIZE} />,
          title: 'User Updated',
          message: 'User was successfully updated!',
        });
      },
      onError: showErrorNotification,
    }
  );

  const modals = useModals();

  const openRemoveBikeModal = (user: User) =>
    modals.openConfirmModal({
      title: 'Remove User',
      centered: true,
      children: (
        <Group>
          <div>
            <UserName user={user} />
          </div>
          <div>
            <UserEmail user={user} />
          </div>
          <div>
            <UserRoles user={user} />
          </div>
        </Group>
      ),
      labels: { confirm: 'Remove', cancel: 'Nevermind' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        removeUser(user.id);
      },
    });

  const rows = users?.map((user, index) => (
    <tr key={index}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} radius={40} />
          <div>
            <UserName user={user} />
          </div>
        </Group>
      </td>
      <td>
        <UserEmail user={user} />
      </td>
      <td>
        <UserRoles user={user} />
      </td>
      <td>
        <Group spacing={0} position="right">
          <Menu transition="pop" withArrow placement="end">
            <Menu.Item
              icon={<CalendarStats size={16} />}
              onClick={() => navigate(`/manage-users/${user.id}`)}
            >
              History
            </Menu.Item>
            <Menu.Item
              icon={<Edit size={16} />}
              onClick={() => setEditUser(user)}
            >
              Edit User
            </Menu.Item>
            <Menu.Item
              icon={<Trash size={16} />}
              onClick={() => openRemoveBikeModal(user)}
              color="red"
            >
              Remove User
            </Menu.Item>
          </Menu>
        </Group>
      </td>
    </tr>
  ));

  return (
    <LayoutWrapper>
      <Group align="flex-end" position="apart" mb={16}>
        <Text size="sm" weight={500}>
          Found {users?.length} user
          {!users || users.length !== 1 ? 's' : ''}
        </Text>
        <Button
          leftIcon={<Plus size={16} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add User
        </Button>
      </Group>
      <Paper>
        <Table verticalSpacing="md">
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addUser}
        isLoading={isAddUserLoading}
      />
      {editUser && (
        <EditUserModal
          isOpen
          onClose={() => setEditUser(null)}
          onSubmit={updateUser}
          isLoading={isUpdateUserLoading}
          user={editUser}
        />
      )}
    </LayoutWrapper>
  );
};

export default UsersPage;
