import { Button, Group, Modal, MultiSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { CreateUpdateUserDto } from 'features/users/dto';
import { User } from 'features/users/models';
import { ReactElement, useState } from 'react';
import { UseMutateFunction } from 'react-query';
import { Edit, Plus } from 'tabler-icons-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: UseMutateFunction<any, unknown, CreateUpdateUserDto>;
  isLoading: boolean;
}

interface EditUserModalProps extends AddUserModalProps {
  user: User;
}

interface BaseUserModalProps extends AddUserModalProps {
  title: string;
  user: CreateUpdateUserDto;
  isPasswordRequired?: boolean;
  buttonText: string;
  buttonIcon: ReactElement;
}

interface FormError {
  roles?: string;
}

const roles = [
  { value: 'User', label: 'User' },
  { value: 'Manager', label: 'Manager' },
];

const BaseUserModal = ({
  isOpen,
  onClose,
  title,
  isPasswordRequired,
  user,
  onSubmit,
  buttonIcon,
  buttonText,
  isLoading,
}: BaseUserModalProps) => {
  const initialValues = {
    name: user.name,
    email: user.email,
    roles: user.roles,
    password: user.password,
  };
  const form = useForm({
    initialValues,
  });

  const [errors, setErrors] = useState<FormError>({});

  return (
    <Modal centered opened={isOpen} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit((values) => {
          setErrors({ ...errors, roles: undefined });
          if (!values.roles.length) {
            setErrors({ ...errors, roles: 'At least 1 role is required' });
            return;
          }
          onSubmit({
            id: user.id,
            ...values,
          });
        })}
      >
        <Group direction="column" spacing={8} grow>
          <TextInput
            placeholder="Enter name"
            label="Name"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            placeholder="Enter email"
            label="Email"
            required
            {...form.getInputProps('email')}
          />
          <MultiSelect
            data={roles}
            label="Roles"
            placeholder="Select user roles"
            required
            {...form.getInputProps('roles')}
            error={errors.roles}
          />
          <TextInput
            placeholder={`Enter ${!isPasswordRequired ? 'new ' : ''}password`}
            label="Password"
            required={isPasswordRequired}
            {...form.getInputProps('password')}
          />
          <Button
            mt={16}
            leftIcon={buttonIcon}
            disabled={isLoading}
            type="submit"
          >
            {buttonText}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export const AddUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddUserModalProps) => {
  return (
    <BaseUserModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add User"
      user={{
        name: '',
        email: '',
        password: '',
        roles: [],
      }}
      isPasswordRequired
      onSubmit={onSubmit}
      isLoading={isLoading}
      buttonText="Create"
      buttonIcon={<Plus size={14} />}
    />
  );
};

export const EditUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
}: EditUserModalProps) => {
  return (
    <BaseUserModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      user={user}
      onSubmit={onSubmit}
      isLoading={isLoading}
      buttonText="Edit"
      buttonIcon={<Edit size={14} />}
    />
  );
};
