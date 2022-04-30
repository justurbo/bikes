import { Avatar, Button, Group, Paper, Table, Text } from '@mantine/core';
import { fetchUserReservations } from 'api/bikes';
import { LayoutWrapper } from 'components';
import {
  UserEmail,
  UserName,
  UserRoles,
} from 'components/user-params/UserParams';
import {
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

const UserHistoryPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetchUserReservations(parseInt(id!, 10))
      .then((dto) => {
        setBikes(dto.bikes);
        setUser(dto.user);
      })
      .catch((e) => {
        showErrorNotification(e);
        setBikes([]);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const rows = bikes.map((bike, index) => (
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
    </tr>
  ));

  const navigate = useNavigate();

  return (
    <LayoutWrapper>
      <Group align="flex-end" position="apart" mb={16}>
        <Text size="sm" weight={500}>
          Bike History of
        </Text>
        <Button
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/manage-users')}
        >
          Back
        </Button>
      </Group>
      {user ? (
        <Paper mb={16}>
          <Table verticalSpacing="md">
            <tbody>
              <tr>
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
              </tr>
            </tbody>
          </Table>
        </Paper>
      ) : null}
      <Text size="sm" weight={500} mb={16}>
        Found {bikes.length} reservation
        {bikes.length !== 1 ? 's' : ''}
      </Text>
      <Paper>
        <Table verticalSpacing="md">
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </LayoutWrapper>
  );
};

export default UserHistoryPage;
