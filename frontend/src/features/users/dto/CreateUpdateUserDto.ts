import { Role } from '../models/User';

export interface CreateUpdateUserDto {
  id?: number;
  name: string;
  email: string;
  password?: string;
  roles: Role[];
}
