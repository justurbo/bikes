import { getAuthorizedAxios } from 'api/auth';
import { CreateUpdateUserDto } from 'features/users/dto';
import { User } from 'features/users/models';
import { useQuery } from 'react-query';
import env from 'utils/env';

const fetchUsers = () => {
  return getAuthorizedAxios()
    .get<User[]>(`${env.API_URL}/users`)
    .then((data) => data.data);
};

export const useUsers = () => {
  return useQuery('users', fetchUsers);
};

export const fetchRemoveUser = async (id: number) => {
  return getAuthorizedAxios()
    .delete(`${env.API_URL}/users/${id}`)
    .then((data) => data.data);
};

export const fetchAddUser = async (createUserDto: CreateUpdateUserDto) => {
  return getAuthorizedAxios()
    .post(`${env.API_URL}/users`, createUserDto)
    .then((data) => data.data);
};

export const fetchUpdateUser = async (updateUserDto: CreateUpdateUserDto) => {
  return getAuthorizedAxios()
    .patch(`${env.API_URL}/users/${updateUserDto.id}`, updateUserDto)
    .then((data) => data.data);
};
