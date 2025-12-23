import { IsDefined, IsString, MinLength } from "class-validator";

export class RequestResetPasswordDto {
  @IsDefined()
  @IsString()
  oldPassword: string;

  @IsDefined()
  @IsString()
  newPassword: string;
}

export class CheckResetPasswordDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  code: string;
}
