import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Request,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RoleEnum } from 'src/users/enums/role.enum';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { RateBikeDto } from './dto/rate-bike.dto';
import { ReserveBikeDto } from './dto/reserve-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { AvailableBikesQuery } from './query/available-bikes.query';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Roles(RoleEnum.User)
  @Get('available')
  available(@Query() availableBikesQuery: AvailableBikesQuery) {
    return this.bikesService.available(
      +availableBikesQuery.from,
      +availableBikesQuery.to,
    );
  }

  @Roles(RoleEnum.User)
  @Post(':id/reservations')
  reserve(
    @Request() req,
    @Param('id') id: string,
    @Body() reserveBikeDto: ReserveBikeDto,
  ) {
    return this.bikesService.reserve(req.user, +id, reserveBikeDto);
  }

  @Roles(RoleEnum.Manager)
  @Get('reservations')
  async reservations(@Query() query) {
    if (query.userId) {
      return await this.bikesService.userReservations(+query.userId);
    } else if (query.bikeId) {
      return await this.bikesService.bikeReservations(+query.bikeId);
    } else {
      throw new BadRequestException(
        'User or bike id query parameter is required',
      );
    }
  }

  @Roles(RoleEnum.User)
  @Get('my-reservations')
  async myReservations(@Request() req) {
    return this.bikesService.userReservations(req.user.id);
  }

  @Roles(RoleEnum.User)
  @Delete('reservations/:id')
  cancelReservation(@Request() req, @Param('id') id: string) {
    return this.bikesService.cancelReservation(req.user, +id);
  }

  @Roles(RoleEnum.User)
  @Post(':id/rate')
  rate(
    @Request() req,
    @Param('id') id: string,
    @Body() rateBikeDto: RateBikeDto,
  ) {
    return this.bikesService.rate(req.user, +id, rateBikeDto);
  }

  @Roles(RoleEnum.Manager)
  @Post()
  create(@Body() createBikeDto: CreateBikeDto) {
    return this.bikesService.create(createBikeDto);
  }

  @Roles(RoleEnum.Manager)
  @Get()
  findAll() {
    return this.bikesService.findAll();
  }

  @Roles(RoleEnum.Manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBikeDto: UpdateBikeDto) {
    return this.bikesService.update(+id, updateBikeDto);
  }

  @Roles(RoleEnum.Manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bikesService.remove(+id);
  }
}
