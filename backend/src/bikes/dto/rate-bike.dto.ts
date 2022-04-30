import { IsInt, Max, Min } from 'class-validator';

export class RateBikeDto {
  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating: number;
}
