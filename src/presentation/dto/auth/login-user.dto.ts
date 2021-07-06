import { IsEmail, IsNumberString, IsString } from 'class-validator'

export class LoginUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}