import { Button, Checkbox, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { CreateUpdateBikeDto } from 'features/bikes/dto';
import { Bike } from 'features/bikes/models';
import { ReactElement } from 'react';
import { UseMutateFunction } from 'react-query';
import { Edit, Plus } from 'tabler-icons-react';

interface AddBikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: UseMutateFunction<any, unknown, CreateUpdateBikeDto>;
  isLoading: boolean;
}

interface EditBikeModalProps extends AddBikeModalProps {
  bike: Bike;
}

interface BaseBikeModalProps extends AddBikeModalProps {
  title: string;
  bike: CreateUpdateBikeDto;
  buttonText: string;
  buttonIcon: ReactElement;
}

const BaseBikeModal = ({
  isOpen,
  onClose,
  title,
  bike,
  onSubmit,
  buttonIcon,
  buttonText,
  isLoading,
}: BaseBikeModalProps) => {
  const initialValues = {
    model: bike.model,
    color: bike.color,
    location: bike.location,
    isAvailable: bike.isAvailable,
  };
  const form = useForm({
    initialValues,
  });

  return (
    <Modal centered opened={isOpen} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit((values) =>
          onSubmit({
            id: bike.id,
            ...values,
          })
        )}
      >
        <Group direction="column" spacing={8} grow>
          <TextInput
            placeholder="Enter model"
            label="Model"
            required
            {...form.getInputProps('model')}
          />
          <TextInput
            placeholder="Enter color"
            label="Color"
            required
            {...form.getInputProps('color')}
          />
          <TextInput
            placeholder="Enter location"
            label="Location"
            required
            {...form.getInputProps('location')}
          />
          <Checkbox
            mt={12}
            label="Available for Rental"
            {...form.getInputProps('isAvailable', { type: 'checkbox' })}
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

export const AddBikeModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddBikeModalProps) => {
  return (
    <BaseBikeModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Bike"
      bike={{
        model: '',
        color: '',
        location: '',
        isAvailable: true,
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      buttonText="Create"
      buttonIcon={<Plus size={14} />}
    />
  );
};

export const EditBikeModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  bike,
}: EditBikeModalProps) => {
  return (
    <BaseBikeModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Bike"
      bike={bike}
      onSubmit={onSubmit}
      isLoading={isLoading}
      buttonText="Edit"
      buttonIcon={<Edit size={14} />}
    />
  );
};
