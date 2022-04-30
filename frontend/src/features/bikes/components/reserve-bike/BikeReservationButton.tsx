import { Button, Group } from '@mantine/core';
import { useModals } from '@mantine/modals';
import {
  BikeParamsProps,
  BikeParams,
  BikeModel,
  BikeColor,
  BikeLocation,
  BikeRating,
  BikeReservationForUser,
} from 'features/bikes/components/bike-params/BikeParams';
import React, { PropsWithChildren } from 'react';
import { Calendar } from 'tabler-icons-react';

interface BaseReservationButtonProps {
  color: 'blue' | 'red';
  onClick: () => void;
}

interface ReservationButtonProps extends BikeParamsProps {
  onConfirm: () => void;
}

const BaseReservationButton = ({
  color,
  onClick,
  children,
}: PropsWithChildren<BaseReservationButtonProps>) => (
  <Button
    variant="light"
    color={color}
    leftIcon={<Calendar size={14} />}
    onClick={onClick}
  >
    {children}
  </Button>
);

export const CancelBikeReservationButton = ({
  bike,
  onConfirm,
}: ReservationButtonProps) => {
  const modals = useModals();

  const openModal = () =>
    modals.openConfirmModal({
      title: 'Cancel Bike Reservation',
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
            <BikeReservationForUser reservationFor={bike.reservationFor!} />
          </div>
        </Group>
      ),
      labels: { confirm: 'Cancel Reservation', cancel: 'Nevermind' },
      confirmProps: { color: 'red' },
      onConfirm,
    });

  return (
    <BaseReservationButton color="red" onClick={openModal}>
      Cancel Reservation
    </BaseReservationButton>
  );
};

export const ReserveBikeButton = ({
  bike,
  onConfirm,
}: ReservationButtonProps) => {
  const modals = useModals();

  const openModal = () =>
    modals.openConfirmModal({
      title: 'Confirm Bike Reservation',
      centered: true,
      children: <BikeParams bike={bike} />,
      labels: { confirm: 'Confirm Reservation', cancel: 'Nevermind' },
      confirmProps: { color: 'teal' },
      onConfirm,
    });

  return (
    <BaseReservationButton color="blue" onClick={openModal}>
      Reserve
    </BaseReservationButton>
  );
};
