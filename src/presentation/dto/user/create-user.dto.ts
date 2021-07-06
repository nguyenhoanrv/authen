import { IsEmail, IsNumberString, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsNumber()
  roleId?: number;
}
