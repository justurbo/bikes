import { IsInt, Min } from 'class-validator';

export class ReserveBikeDto {
  @IsInt()
  @Min(0)
  readonly from: number;

  @IsInt()
  @Min(0)
  readonly to: number;
}
