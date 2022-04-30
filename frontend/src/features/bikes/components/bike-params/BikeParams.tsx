import { Group, Text } from '@mantine/core';
import { Bike } from 'features/bikes/models/Bike';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'tabler-icons-react';
import { formatUnixTimestamp } from 'utils/date-format';

export interface BikeParamsProps {
  bike: Bike;
}

interface BikeReservationForProps {
  reservationFor: number[];
}

export const BikeModel = ({ bike }: BikeParamsProps) => (
  <>
    <Text size="sm">{bike.model}</Text>
    <Text color="dimmed" size="xs">
      Model
    </Text>
  </>
);

export const BikeColor = ({ bike }: BikeParamsProps) => (
  <>
    <Text size="sm">{bike.color}</Text>
    <Text size="xs" color="dimmed">
      Color
    </Text>
  </>
);

export const BikeLocation = ({ bike }: BikeParamsProps) => (
  <>
    <Text size="sm">{bike.location}</Text>
    <Text size="xs" color="dimmed">
      Location
    </Text>
  </>
);

export const BikeRating = ({ bike }: BikeParamsProps) => (
  <>
    <Text size="sm">
      {bike.rating ? Math.round(bike.rating * 100) / 100 : '-'} / 5
    </Text>
    <Text size="xs" color="dimmed">
      Rating
    </Text>
  </>
);

export const BikeReservationForUser = ({
  reservationFor,
}: BikeReservationForProps) => {
  return (
    <>
      <Text size="sm">
        {formatUnixTimestamp(reservationFor[0].toString())}{' '}
        <ArrowRight color="#777" size={10} />{' '}
        {formatUnixTimestamp(reservationFor[1].toString())}
      </Text>
      <Text size="xs" color="dimmed">
        Reservation for
      </Text>
    </>
  );
};

export const BikeReservationFor = () => {
  const [queryParams] = useSearchParams();

  return (
    <BikeReservationForUser
      reservationFor={[
        parseInt(queryParams.get('from')!, 10),
        parseInt(queryParams.get('to')!, 10),
      ]}
    />
  );
};

export const BikeAvailability = ({ bike }: BikeParamsProps) => (
  <>
    <Text size="sm" color={bike.isAvailable ? 'teal' : 'red'} weight={600}>
      {bike.isAvailable ? 'Available' : 'Unavailable'}
    </Text>
    <Text size="xs" color="dimmed">
      Availability for rental
    </Text>
  </>
);

export const BikeParams = ({ bike }: BikeParamsProps) => (
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
      <BikeReservationFor />
    </div>
  </Group>
);
