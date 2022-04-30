import { ArrayNotEmpty, IsString } from 'class-validator';
import { RoleEnum } from 'src/users/enums/role.enum';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly roles: RoleEnum[];
}
