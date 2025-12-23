import { IsDefined, IsString, IsNumber, IsOptional, IsArray } from "class-validator";

export class CreateCompanyServiceDto {
  @IsDefined()
  @IsString()
  companyId: string;

  @IsDefined()
  @IsString()
  serviceId: string;

  @IsDefined()
  price: number;

  @IsDefined()
  duration: number;
}

export class UpdateCompanyServiceDto {
  @IsDefined()
  @IsString()
  companyId: string;

  @IsDefined()
  @IsString()
  serviceId: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  duration?: number;

  @IsOptional()
  concurrentCapability?: number;
}

export class BulkUpdateCompanyServiceDto {
  @IsDefined()
  @IsArray()
  serviceIds: string[];
}
