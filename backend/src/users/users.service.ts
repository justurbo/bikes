import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { getHashSalt } from 'src/auth/constants';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import {
  UserResponseDto,
  UserWithPasswordDto,
} from 'src/users/dto/user-response.dto';
import { Role } from 'src/users/entities/role.entity';
import { RoleEnum } from 'src/users/enums/role.enum';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  // insert roles and initial manager if non-existing
  async onModuleInit() {
    const [user, manager] = await Promise.all([
      this.roleRepository.findOne({ where: { name: RoleEnum.User } }),
      this.roleRepository.findOne({ where: { name: RoleEnum.Manager } }),
    ]);

    if (!user) {
      await this.roleRepository.insert({
        name: RoleEnum.User,
      });
    }

    if (!manager) {
      await this.roleRepository.insert({
        name: RoleEnum.Manager,
      });
    }

    const initialManager = await this.userRepository.findOne({
      where: { email: process.env.MANAGER_EMAIL },
    });

    if (!initialManager) {
      await this.create({
        name: process.env.MANAGER_NAME,
        email: process.env.MANAGER_EMAIL,
        password: process.env.MANAGER_PASSWORD,
        roles: [RoleEnum.Manager, RoleEnum.User],
      });
    }
  }

  async create(createUserDto: CreateUserDto) {
    const roles = await this.roleRepository.find({
      where: { name: In(createUserDto.roles) },
    });

    if (!roles.filter((x) => !!x).length) {
      throw new BadRequestException('Such user roles do not exist');
    }
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: await hash(createUserDto.password, getHashSalt()),
      roles,
    });
    // eslint-disable-next-line
    const { password, ...noPasswordUser } = await this.userRepository.save(
      user,
    );
    return noPasswordUser;
  }

  findAll() {
    return this.usersQuery()
      .where('u.isDeleted = false')
      .getRawMany<UserResponseDto>();
  }

  findByUsername(username: string) {
    return this.usersQuery(['u.password as password'])
      .where({ email: username })
      .getRawOne<UserWithPasswordDto>();
  }

  findById(id: number) {
    return this.usersQuery().where({ id }).getRawOne<UserResponseDto>();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['ratings', 'reservations'],
    });
    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const roles = await this.roleRepository.find({
      where: { name: In(updateUserDto.roles) },
    });
    const user = await this.userRepository.preload({
      id,
      name: updateUserDto.name,
      email: updateUserDto.email,
      password: updateUserDto.password
        ? await hash(updateUserDto.password, getHashSalt())
        : undefined,
      roles,
    });
    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
    // eslint-disable-next-line
    const { password, ...noPasswordUser } = await this.userRepository.save(
      user,
    );
    return noPasswordUser;
  }

  async remove(id: number) {
    return this.userRepository.update(id, {
      name: 'Deleted User',
      email: 'Unknown',
      isDeleted: true,
    });
  }

  private usersQuery(select?: string[]) {
    const additionalSelect = select ?? [];

    return this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id as id',
        'u.name as name',
        'u.email as email',
        'array_agg(r.name) as roles',
        ...additionalSelect,
      ])
      .leftJoin('u.roles', 'r')
      .groupBy('u.id');
  }
}
