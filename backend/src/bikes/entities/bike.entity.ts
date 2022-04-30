import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rating } from './rating.entity';
import { Reservation } from './reservation.entity';

@Entity('bikes')
export class Bike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  location: string;

  @Column()
  isAvailable: boolean;

  @OneToMany(() => Rating, (rating) => rating.bike)
  ratings: Rating[];

  @OneToMany(() => Reservation, (rating) => rating.bike)
  reservations: Reservation[];

  @Column({ default: false })
  isDeleted: boolean;
}
