import { showNotification } from '@mantine/notifications';
import { fetchAvailableBikes, fetchReserveBike } from 'api/bikes';
import { LayoutWrapper } from 'components';
import {
  BikeSearch,
  BikeRating,
  BikeReservationFor,
  ReserveBikeButton,
  BikeLocation,
  BikeColor,
  BikeModel,
  BikeFilters,
} from 'features/bikes/components';
import { useBikeFilters } from 'features/bikes/hooks';
import { Bike } from 'features/bikes/models';
import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Paper } from '@mantine/core';
import { useMutation } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { Bike as BikeIcon, Check } from 'tabler-icons-react';
import { showErrorNotification } from 'utils/error';
import {
  NOTIFICATION_COLORS,
  NOTIFICATION_ICON_SIZE,
} from 'utils/notifications';

const BikesPage = () => {
  const [queryParams] = useSearchParams();

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const from = queryParams.get('from');
  const to = queryParams.get('to');

  const loadAvailableBikes = () => {
    if (!from || !to) {
      return;
    }
    setIsLoading(true);
    fetchAvailableBikes(parseInt(from, 10), parseInt(to, 10))
      .then((b) => setBikes(b))
      .catch((e) => {
        showErrorNotification(e);
        setBikes([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAvailableBikes();
  }, [from, to]);

  const { mutate: reserveBike } = useMutation(fetchReserveBike, {
    onSuccess: () => {
      loadAvailableBikes();
      showNotification({
        color: NOTIFICATION_COLORS.success,
        icon: <Check size={NOTIFICATION_ICON_SIZE} />,
        title: 'Bike Reserved',
        message: 'Bike was successfully reserved!',
      });
    },
    onError: showErrorNotification,
  });

  const bikeFilters = useBikeFilters(bikes ?? []);
  const { filteredBikes } = bikeFilters;

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
        <BikeReservationFor />
      </td>
      <td>
        <Group spacing={8} position="right">
          <ReserveBikeButton
            bike={bike}
            onConfirm={() => {
              reserveBike({
                id: bike.id,
                from: parseInt(from!, 10),
                to: parseInt(to!, 10),
              });
            }}
          />
        </Group>
      </td>
    </tr>
  ));

  return (
    <LayoutWrapper>
      <BikeSearch isLoading={isLoading} />
      <BikeFilters bikeFilters={bikeFilters} />
      {!!bikes && queryParams.has('from') && queryParams.has('to') && (
        <Text size="sm" weight={500} mb={16}>
          Found {filteredBikes.length} bike
          {filteredBikes.length !== 1 ? 's' : ''}
        </Text>
      )}
      <Paper>
        <Table verticalSpacing="md">
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </LayoutWrapper>
  );
};

export default BikesPage;
