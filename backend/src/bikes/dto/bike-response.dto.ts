export class BikeResponseDto {
  id: number;
  model: string;
  color: string;
  location: string;
  rating: number | null;
  isAvailable: boolean;
  reservationFor?: number[];
}
