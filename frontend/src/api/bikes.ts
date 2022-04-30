import { getAuthorizedAxios } from 'api/auth';
import {
  BikeHistoryDto,
  CreateUpdateBikeDto,
  ReserveBikeDto,
} from 'features/bikes/dto';
import { Bike } from 'features/bikes/models';
import { UserHistoryDto } from 'features/users/dto';
import { useQuery } from 'react-query';
import env from 'utils/env';

const fetchBikes = async () => {
  return getAuthorizedAxios()
    .get<Bike[]>(`${env.API_URL}/bikes`)
    .then((data) => data.data);
};

export const useBikes = () => {
  return useQuery('bikes', fetchBikes);
};

export const fetchAvailableBikes = async (from: number, to: number) => {
  return getAuthorizedAxios()
    .get<Bike[]>(`${env.API_URL}/bikes/available`, { params: { from, to } })
    .then((data) => data.data);
};

export const fetchReserveBike = async (reserveBikeDto: ReserveBikeDto) => {
  return getAuthorizedAxios()
    .post<Bike>(`${env.API_URL}/bikes/${reserveBikeDto.id}/reservations`, {
      from: reserveBikeDto.from,
      to: reserveBikeDto.to,
    })
    .then((data) => data.data);
};

export const fetchUserReservations = async (userId: number) => {
  return getAuthorizedAxios()
    .get<UserHistoryDto>(`${env.API_URL}/bikes/reservations`, {
      params: { userId },
    })
    .then((data) => data.data);
};

export const fetchMyReservations = async () => {
  return getAuthorizedAxios()
    .get<UserHistoryDto>(`${env.API_URL}/bikes/my-reservations`)
    .then((data) => data.data);
};

export const fetchBikeReservations = async (bikeId: number) => {
  return getAuthorizedAxios()
    .get<BikeHistoryDto>(`${env.API_URL}/bikes/reservations`, {
      params: { bikeId },
    })
    .then((data) => data.data);
};

export const fetchCancelReservation = async (reservationId: number) => {
  return getAuthorizedAxios()
    .delete(`${env.API_URL}/bikes/reservations/${reservationId}`)
    .then((data) => data.data);
};

export const fetchRateBike = async ({
  id,
  rating,
}: {
  id: number;
  rating: number;
}) => {
  return getAuthorizedAxios()
    .post(`${env.API_URL}/bikes/${id}/rate`, { rating })
    .then((data) => data.data);
};

export const fetchRemoveBike = async (id: number) => {
  return getAuthorizedAxios()
    .delete(`${env.API_URL}/bikes/${id}`)
    .then((data) => data.data);
};

export const fetchAddBike = async (createBikeDto: CreateUpdateBikeDto) => {
  return getAuthorizedAxios()
    .post(`${env.API_URL}/bikes`, createBikeDto)
    .then((data) => data.data);
};

export const fetchUpdateBike = async (updateBikeDto: CreateUpdateBikeDto) => {
  return getAuthorizedAxios()
    .patch(`${env.API_URL}/bikes/${updateBikeDto.id}`, updateBikeDto)
    .then((data) => data.data);
};
