import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { UserRole } from 'src/users/interface/user.interface';
import { IsValidPassword } from '../validator/password.validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  country: string;
}

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
