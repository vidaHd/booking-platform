import { IsDefined, IsString, MinLength } from "class-validator";

export class LoginUserDto {
  @IsDefined()
  @IsString()
  mobileNumber: string;

  @IsDefined()
  @IsString()
  password: string;
}

export class RegisterUserDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  familyName: string;

  @IsDefined()
  mobileNumber: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  email?: string;
}

export class VerfifacationCodeDto {
  @IsDefined()
  @IsString()
  code: string;
}
