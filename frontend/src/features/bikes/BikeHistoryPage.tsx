import { Avatar, Button, Group, Paper, Table, Text } from '@mantine/core';
import { fetchBikeReservations } from 'api/bikes';
import { LayoutWrapper } from 'components';
import {
  UserEmail,
  UserName,
  UserRoles,
} from 'components/user-params/UserParams';
import {
  BikeAvailability,
  BikeColor,
  BikeLocation,
  BikeModel,
  BikeRating,
  BikeReservationForUser,
} from 'features/bikes/components';
import { Bike } from 'features/bikes/models';
import { User } from 'features/users/models';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bike as BikeIcon } from 'tabler-icons-react';
import { showErrorNotification } from 'utils/error';

const BikeHistoryPage = () => {
  const [bike, setBike] = useState<Bike | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetchBikeReservations(parseInt(id!, 10))
      .then((dto) => {
        setUsers(dto.users);
        setBike(dto.bike);
      })
      .catch((e) => {
        showErrorNotification(e);
        setUsers([]);
        setBike(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const rows = users.map((user, index) => (
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
        <BikeReservationForUser // @ts-ignore
          reservationFor={[parseInt(user.from, 10), parseInt(user.to, 10)]}
        />
      </td>
    </tr>
  ));

  const navigate = useNavigate();

  return (
    <LayoutWrapper>
      <Group align="flex-end" position="apart" mb={16}>
        <Text size="sm" weight={500}>
          User History of
        </Text>
        <Button
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/manage-bikes')}
        >
          Back
        </Button>
      </Group>
      {bike ? (
        <Paper mb={16}>
          <Table verticalSpacing="md">
            <tbody>
              <tr>
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
              </tr>
            </tbody>
          </Table>
        </Paper>
      ) : null}
      <Text size="sm" weight={500} mb={16}>
        Found {users.length} reservation
        {users.length !== 1 ? 's' : ''}
      </Text>
      <Paper>
        <Table verticalSpacing="md">
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </LayoutWrapper>
  );
};

export default BikeHistoryPage;
