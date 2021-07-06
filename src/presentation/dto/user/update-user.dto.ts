import { IsEmail, IsNumberString, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsNumberString()
  roleId: number
}