import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BikeResponseDto } from 'src/bikes/dto/bike-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateBikeDto } from './dto/create-bike.dto';
import { RateBikeDto } from './dto/rate-bike.dto';
import { ReserveBikeDto } from './dto/reserve-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { Bike } from './entities/bike.entity';
import { Rating } from './entities/rating.entity';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class BikesService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Bike) private readonly bikeRepository: Repository<Bike>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async available(from: number, to: number) {
    if (from > to) {
      throw new BadRequestException('From date has to be earlier than to date');
    }
    if (from < Date.now() / 1000) {
      throw new BadRequestException('Past availability is not accessible');
    }
    return this.availableBikesQuery(from, to).getRawMany<BikeResponseDto>();
  }

  async reserve(
    user: UserResponseDto,
    id: number,
    reserveBikeDto: ReserveBikeDto,
  ) {
    if (reserveBikeDto.from > reserveBikeDto.to) {
      throw new BadRequestException('From date has to be earlier than to date');
    }
    if (reserveBikeDto.from < Date.now() / 1000) {
      throw new BadRequestException('You can only reserve for the future');
    }
    const bike = await this.availableBikesQuery(
      reserveBikeDto.from,
      reserveBikeDto.to,
    )
      .andWhere(`b.id = ${id}`)
      .getRawOne<Bike>();
    if (!bike) {
      throw new NotFoundException(`Bike with id '${id}' is unavailable`);
    }
    const existingUser = await this.userService.findOne(user.id);
    const reservation = this.reservationRepository.create({
      bike,
      user: existingUser,
      ...reserveBikeDto,
    });
    return this.reservationRepository.save(reservation);
  }

  async userReservations(userId: number) {
    const user = await this.userService.findById(userId);
    return {
      user,
      bikes: await this.bikeRepository
        .createQueryBuilder('b')
        .select([
          'b.id as id',
          'b.model as model',
          'b.color as color',
          'b.location as location',
          'AVG(ra.rating) as rating',
          're.id as "reservationId"',
          're.from as from',
          're.to as to',
        ])
        .leftJoin('b.reservations', 're')
        .leftJoin('b.ratings', 'ra')
        .leftJoin('re.user', 'u')
        .where(`u.id = ${user.id}`)
        .groupBy('b.id, re.id')
        .orderBy('re.from', 'DESC')
        .getRawMany<BikeResponseDto>(),
    };
  }

  async bikeReservations(bikeId: number) {
    const bike = await this.findById(bikeId);
    const users = await this.reservationRepository
      .createQueryBuilder('re')
      .select([
        'u.id as id',
        'u.name as name',
        'u.email as email',
        'array_agg(DISTINCT r.name) as roles',
        're.from as from',
        're.to as to',
      ])
      .leftJoin('re.user', 'u')
      .leftJoin('u.roles', 'r')
      .leftJoin('re.bike', 'b')
      .where(`b.id = ${bike.id}`)
      .groupBy('b.id, re.id, u.id')
      .orderBy('re.from', 'DESC')
      .getRawMany<User>();
    return {
      bike,
      users,
    };
  }

  async cancelReservation(user: UserResponseDto, id: number) {
    const existingUser = await this.userService.findOne(user.id);
    const reservation = await this.reservationRepository.findOne({
      where: { id, user: existingUser },
      relations: ['bike'],
    });
    if (!reservation) {
      throw new NotFoundException(
        `Reservation with id '${id}' does not exist.`,
      );
    }
    if (reservation.bike.isDeleted) {
      throw new BadRequestException(
        'Cannot cancel a reservation of a bike which is deleted',
      );
    }
    if (reservation.from < Date.now() / 1000) {
      throw new BadRequestException(
        'You cannot cancel an on-going reservation',
      );
    }
    return this.reservationRepository.delete(reservation);
  }

  async rate(user: UserResponseDto, id: number, rateBikeDto: RateBikeDto) {
    const bike = await this.findOne(id);
    if (bike.isDeleted) {
      throw new BadRequestException('Cannot rate a bike which is deleted');
    }
    const reservation = await this.reservationRepository.findOne({
      where: { bike, user: await this.userService.findOne(user.id) },
    });
    if (!reservation) {
      throw new BadRequestException(
        'Cannot rate a bike which you have not reserved',
      );
    }
    if (reservation.from > Date.now() / 1000) {
      throw new BadRequestException(
        'You can only rate a bike once the reservation begins',
      );
    }
    const rating = this.ratingRepository.create({
      bike,
      ...rateBikeDto,
    });
    return this.ratingRepository.save(rating);
  }

  create(createBikeDto: CreateBikeDto) {
    const bike = this.bikeRepository.create(createBikeDto);
    return this.bikeRepository.save(bike);
  }

  async findAll() {
    return this.bikesQuery()
      .where('b.isDeleted = false')
      .getRawMany<BikeResponseDto>();
  }

  findById(id: number) {
    return this.bikesQuery().where({ id }).getRawOne<BikeResponseDto>();
  }

  async findOne(id: number) {
    const bike = await this.bikeRepository.findOne({
      where: { id },
      relations: ['ratings', 'reservations'],
    });
    if (!bike) {
      throw new NotFoundException(`Bike with id '${id}' not found`);
    }
    return bike;
  }

  async update(
    id: number,
    updateBikeDto: UpdateBikeDto | { isDeleted: boolean },
  ) {
    const bike = await this.bikeRepository.preload({
      id,
      ...updateBikeDto,
    });
    if (!bike) {
      throw new NotFoundException(`Bike with id '${id}' not found`);
    }
    return this.bikeRepository.save(bike);
  }

  async remove(id: number) {
    return this.bikeRepository.update(id, {
      model: 'Deleted Bike',
      color: 'Unknown',
      location: 'Unknown',
      isDeleted: true,
    });
  }

  private availableBikesQuery(from: number, to: number) {
    return this.bikesQuery()
      .where(
        `b.id NOT IN (SELECT b.id FROM reservations re LEFT JOIN bikes b on "re"."bikeId" = b.id LEFT JOIN users u on "re"."userId" = u.id WHERE re.from <= ${to} AND re.to >= ${from} AND u."isDeleted" = false) AND "isDeleted"=false`,
      )
      .andWhere('b.isDeleted = false')
      .andWhere('b.isAvailable = true');
  }

  private bikesQuery(select?: string[]) {
    const additionalSelect = select ?? [];
    return this.bikeRepository
      .createQueryBuilder('b')
      .select([
        'b.id as id',
        'b.model as model',
        'b.color as color',
        'b.location as location',
        'b.isAvailable as "isAvailable"',
        'b.isDeleted as "isDeleted"',
        'AVG(ra.rating) as rating',
        ...additionalSelect,
      ])
      .leftJoin('b.reservations', 're')
      .leftJoin('b.ratings', 'ra')
      .groupBy('b.id');
  }
}
