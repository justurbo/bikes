import { RoleEnum } from 'src/users/enums/role.enum';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  roles: RoleEnum[];
}

export class UserWithPasswordDto extends UserResponseDto {
  password: string;
}
