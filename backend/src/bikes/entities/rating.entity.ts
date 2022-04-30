import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Bike } from './bike.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @JoinTable()
  @ManyToOne(() => Bike, (bike) => bike.ratings)
  bike: Bike;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.ratings)
  user: User;
}
