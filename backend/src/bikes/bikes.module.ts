import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { BikesService } from './bikes.service';
import { BikesController } from './bikes.controller';
import { Bike } from './entities/bike.entity';
import { Rating } from './entities/rating.entity';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Bike, Rating, Reservation])],
  controllers: [BikesController],
  providers: [BikesService],
})
export class BikesModule {}
