import { showNotification } from '@mantine/notifications';
import {
  fetchCancelReservation,
  fetchMyReservations,
  fetchRateBike,
} from 'api/bikes';
import { LayoutWrapper } from 'components';
import {
  BikeRating,
  BikeLocation,
  BikeColor,
  BikeModel,
  BikeReservationForUser,
  BikeFilters,
} from 'features/bikes/components';
import RateBikeModal from 'features/bikes/components/rate-bike/RateBikeModal';
import { CancelBikeReservationButton } from 'features/bikes/components/reserve-bike/BikeReservationButton';
import { useBikeFilters } from 'features/bikes/hooks';
import { Bike } from 'features/bikes/models';
import React, { useEffect, useState } from 'react';
import { Avatar, Table, Group, Text, Menu, Paper } from '@mantine/core';
import { useMutation } from 'react-query';
import { Bike as BikeIcon, Check, Star } from 'tabler-icons-react';
import { showErrorNotification } from 'utils/error';
import {
  NOTIFICATION_COLORS,
  NOTIFICATION_ICON_SIZE,
} from 'utils/notifications';

const MyReservationsPage = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [rateBikeId, setRateBikeId] = useState<number | null>(null);

  const loadReservations = () => {
    fetchMyReservations()
      .then((dto) => {
        setBikes(dto.bikes);
      })
      .catch((e) => {
        showErrorNotification(e);
        setBikes([]);
      });
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const { mutate: cancelReservation } = useMutation(fetchCancelReservation, {
    onSuccess: () => {
      loadReservations();
      showNotification({
        color: NOTIFICATION_COLORS.success,
        icon: <Check size={NOTIFICATION_ICON_SIZE} />,
        title: 'Reservation Cancelled',
        message: 'Your reservation was successfully cancelled!',
      });
    },
    onError: showErrorNotification,
  });
  const { mutate: rateBike } = useMutation(fetchRateBike, {
    onSuccess: () => {
      loadReservations();
      showNotification({
        color: NOTIFICATION_COLORS.success,
        icon: <Check size={NOTIFICATION_ICON_SIZE} />,
        title: 'Rating Added',
        message: 'Your rating was successfully added!',
      });
    },
    onError: showErrorNotification,
  });

  const bikeFilters = useBikeFilters(bikes);
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
        <BikeReservationForUser
          // @ts-ignore
          reservationFor={[parseInt(bike.from, 10), parseInt(bike.to, 10)]}
        />
      </td>
      <td>
        <Group spacing={8} position="right">
          <CancelBikeReservationButton
            bike={{
              ...bike,
              // @ts-ignore
              reservationFor: [parseInt(bike.from, 10), parseInt(bike.to, 10)],
            }}
            onConfirm={() => {
              // @ts-ignore
              cancelReservation(bike.reservationId);
            }}
          />
          <Menu transition="pop" withArrow placement="end">
            <Menu.Item
              icon={<Star size={14} />}
              onClick={() => setRateBikeId(bike.id)}
            >
              Rate Bike
            </Menu.Item>
          </Menu>
        </Group>
      </td>
    </tr>
  ));

  return (
    <LayoutWrapper>
      <BikeFilters bikeFilters={bikeFilters} alwaysShowFilters />
      <Text size="sm" weight={500} mb={16}>
        Found {filteredBikes.length} reservation
        {filteredBikes.length !== 1 ? 's' : ''}
      </Text>
      <Paper>
        <Table verticalSpacing="md">
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
      <RateBikeModal
        rateBikeId={rateBikeId}
        onClose={() => setRateBikeId(null)}
        onSubmit={(payload) => {
          setRateBikeId(null);
          rateBike(payload);
        }}
      />
    </LayoutWrapper>
  );
};

export default MyReservationsPage;
