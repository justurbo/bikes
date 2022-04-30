import { IsBoolean, IsString } from 'class-validator';

export class CreateBikeDto {
  @IsString()
  readonly model: string;

  @IsString()
  readonly color: string;

  @IsString()
  readonly location: string;

  @IsBoolean()
  readonly isAvailable: boolean;
}
