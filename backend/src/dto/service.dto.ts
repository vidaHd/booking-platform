import { IsDefined, IsString, IsNumber, IsOptional, IsArray } from "class-validator";

export class CreateServiceDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  jobId: string;
}

export class UpdateServiceDto {
  @IsDefined()
  @IsString()
  serviceId: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  concurrentCapability?: number;
}

export class BulkUpdateServiceDto {
  @IsDefined()
  @IsArray()
  serviceIds: string[];
}
