import { IsDefined, IsString } from "class-validator";

export class CreateCompanyDto {
  @IsDefined()
  @IsString()
  companyName: string;

  @IsDefined()
  @IsString()
  jobId: string;
}

export class UpdateCompanyDto {
  @IsDefined()
  @IsString()
  companyName: string;
  
  @IsDefined()
  @IsString()
  url: string;
}
