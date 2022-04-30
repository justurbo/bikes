import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  fetchAddBike,
  fetchRemoveBike,
  fetchUpdateBike,
  useBikes,
} from 'api/bikes';
import { LayoutWrapper } from 'components';
import {
  BikeRating,
  BikeLocation,
  BikeColor,
  BikeModel,
  BikeAvailability,
  BikeFilters,
} from 'features/bikes/components';
import { AddBikeModal } from 'features/bikes/components/add-edit-bike';
import { EditBikeModal } from 'features/bikes/components/add-edit-bike/AddEditBikeModal';
import { useBikeFilters } from 'features/bikes/hooks';
import { Bike } from 'features/bikes/models';
import React, { useState } from 'react';
import { Avatar, Table, Group, Text, Menu, Paper, Button } from '@mantine/core';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Trash,
  Bike as BikeIcon,
  CalendarStats,
  Edit,
  Plus,
  Check,
} from 'tabler-icons-react';
import { showErrorNotification } from 'utils/error';
import {
  NOTIFICATION_COLORS,
  NOTIFICATION_ICON_SIZE,
} from 'utils/notifications';

const ManageBikesPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editBike, setEditBike] = useState<Bike | null>(null);

  const queryClient = useQueryClient();
  const { data: bikes, isLoading } = useBikes();
  const { mutate: removeBike } = useMutation(fetchRemoveBike, {
    onSuccess: () => {
      queryClient.invalidateQueries('bikes');
      showNotification({
        color: NOTIFICATION_COLORS.success,
        icon: <Check size={NOTIFICATION_ICON_SIZE} />,
        title: 'Bike Removed',
        message: 'Bike was successfully removed!',
      });
    },
  });
  const { mutate: addBike, isLoading: isAddBikeLoading } = useMutation(
    fetchAddBike,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bikes');
        showNotification({
          color: NOTIFICATION_COLORS.success,
          icon: <Check size={NOTIFICATION_ICON_SIZE} />,
          title: 'Bike Added',
          message: 'Bike was successfully added!',
        });
      },
      onError: showErrorNotification,
    }
  );
  const { mutate: updateBike, isLoading: isUpdateBikeLoading } = useMutation(
    fetchUpdateBike,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bikes');
        showNotification({
          color: NOTIFICATION_COLORS.success,
          icon: <Check size={NOTIFICATION_ICON_SIZE} />,
          title: 'Bike Updated',
          message: 'Bike was successfully updated!',
        });
      },
    }
  );

  const bikeFilters = useBikeFilters(!bikes || isLoading ? [] : bikes);

  const { filteredBikes } = bikeFilters;

  const modals = useModals();

  const openRemoveBikeModel = (bike: Bike) =>
    modals.openConfirmModal({
      title: 'Remove Bike',
      centered: true,
      children: (
        <Group>
          <div>
            <BikeModel bike={bike} />
          </div>
          <div>
            <BikeColor bike={bike} />
          </div>
          <div>
            <BikeLocation bike={bike} />
          </div>
          <div>
            <BikeRating bike={bike} />
          </div>
          <div>
            <BikeAvailability bike={bike} />
          </div>
        </Group>
      ),
      labels: { confirm: 'Remove', cancel: 'Nevermind' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        removeBike(bike.id);
      },
    });

  const navigate = useNavigate();

  const rows = filteredBikes.map((bike, index) => (
    <tr key={index}>
      <td>
        <Group spacing="sm">
          <Avatar color="blue" radius="sm">
            <BikeIcon size={24} />
          </Avatar>
          <div>
            <BikeModel bike={bike} />
          </div>
        </Group>
      </td>
      <td>
        <BikeColor bike={bike} />
      </td>
      <td>
        <BikeLocation bike={bike} />
      </td>
      <td>
        <BikeRating bike={bike} />
      </td>
      <td>
        <BikeAvailability bike={bike} />
      </td>
      <td>
        <Group spacing={8} position="right">
          <Menu transition="pop" withArrow placement="end">
            <Menu.Item
              icon={<CalendarStats size={16} />}
              onClick={() => navigate(`/manage-bikes/${bike.id}`)}
            >
              History
            </Menu.Item>
            <Menu.Item
              icon={<Edit size={16} />}
              onClick={() => setEditBike(bike)}
            >
              Edit Bike
            </Menu.Item>
            <Menu.Item
              icon={<Trash size={16} />}
              onClick={() => openRemoveBikeModel(bike)}
              color="red"
            >
              Remove Bike
            </Menu.Item>
          </Menu>
        </Group>
      </td>
    </tr>
  ));

  return (
    <LayoutWrapper>
      <BikeFilters
        bikeFilters={bikeFilters}
        alwaysShowFilters
        rightComponent={
          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Bike
          </Button>
        }
      />
      <Text size="sm" weight={500} mb={16}>
        Found {filteredBikes.length} bike
        {filteredBikes.length !== 1 ? 's' : ''}
      </Text>
      <Paper>
        <Table verticalSpacing="md">
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
      <AddBikeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addBike}
        isLoading={isAddBikeLoading}
      />
      {editBike && (
        <EditBikeModal
          isOpen
          onClose={() => setEditBike(null)}
          onSubmit={updateBike}
          isLoading={isUpdateBikeLoading}
          bike={editBike}
        />
      )}
    </LayoutWrapper>
  );
};

export default ManageBikesPage;
