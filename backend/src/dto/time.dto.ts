import { IsDefined, IsObject, IsString } from "class-validator";

export class AddOrUpdateAvailableTimesDto {
  @IsDefined()
  @IsString()
  companyId: string;

  @IsDefined()
  @IsObject()
  timesByDay: Record<string, string[]>;
}
