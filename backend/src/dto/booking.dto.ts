import { IsDefined, IsString } from "class-validator";

export class CreateBookingDto {
  @IsDefined()
  @IsString()
  serviceId: string;

  @IsDefined()
  @IsString()
  selectedTimes: string;
  
  @IsDefined()
  @IsString()
  selectedDate: string;
}
