import { IsOptional, IsString, IsNumber, IsIn } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsIn(["male", "female", "other"])
  gender?: string;
}
