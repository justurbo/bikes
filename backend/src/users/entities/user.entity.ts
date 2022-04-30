import { Role } from 'src/users/entities/role.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rating } from 'src/bikes/entities/rating.entity';
import { Reservation } from 'src/bikes/entities/reservation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @ManyToMany(() => Role, (role) => role.user)
  roles: Role[];

  @Column({ default: false })
  isDeleted: boolean;
}
