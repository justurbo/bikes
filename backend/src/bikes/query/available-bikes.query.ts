import { IsNotEmpty } from 'class-validator';

export class AvailableBikesQuery {
  @IsNotEmpty()
  readonly from: string;

  @IsNotEmpty()
  readonly to: string;
}
