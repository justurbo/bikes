import { Bike } from 'features/bikes/models';
import { User } from 'features/users/models';

export interface UserHistoryDto {
  user: User;
  bikes: Bike[];
}
