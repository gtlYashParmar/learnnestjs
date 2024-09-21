import { IsString, IsOptional, Length, IsEnum } from 'class-validator';

export class AuthDto {
  @IsString()
  @Length(10, 15)
  mobileNumber: string;
}

export class VerifyOtpDto {
  @IsString()
  @Length(10, 15)
  mobileNumber: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}

export class RegisterDto {
  @IsString()
  @Length(10, 15)
  mobileNumber: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsEnum(['USD', 'EUR', 'GBP', 'JPY']) // Add more currencies as needed
  currency: string;
}