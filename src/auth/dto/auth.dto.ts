import { IsEmail, IsString, MinLength } from 'class-validator';

export default class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}
