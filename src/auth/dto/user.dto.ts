import { IsEmail, IsString, MinLength } from 'class-validator';

export default class UserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}
