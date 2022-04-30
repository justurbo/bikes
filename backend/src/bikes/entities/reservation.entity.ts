import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Bike } from './bike.entity';

export const bigint: ValueTransformer = {
  to: (entityValue: number) => entityValue,
  from: (databaseValue: string): number => parseInt(databaseValue, 10),
};

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', transformer: [bigint] })
  from: number;

  @Column({ type: 'bigint', transformer: [bigint] })
  to: number;

  @JoinTable()
  @ManyToOne(() => Bike, (bike) => bike.reservations)
  bike: Bike;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.reservations)
  user: User;
}
