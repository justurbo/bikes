import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { getHashSalt } from 'src/auth/constants';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { RoleEnum } from 'src/users/enums/role.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === (await hash(password, getHashSalt()))) {
      // eslint-disable-next-line
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      }),
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.findByUsername(registerUserDto.email);

    if (user) {
      throw new BadRequestException('Email is already in use');
    }

    const newUser = {
      name: registerUserDto.name,
      email: registerUserDto.email,
      roles: [RoleEnum.User],
      password: registerUserDto.password,
    };
    const createdUser = await this.usersService.create(newUser);

    return this.login({ ...newUser, id: createdUser.id });
  }
}
