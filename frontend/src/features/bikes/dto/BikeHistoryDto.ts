import { Bike } from 'features/bikes/models';
import { User } from 'features/users/models';

interface UserReservation extends User {
  reservationFor: number[];
}

export interface BikeHistoryDto {
  bike: Bike;
  users: UserReservation[];
}
