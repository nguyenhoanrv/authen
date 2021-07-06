import { Controller, Param, Get, Post, Body, Headers } from '@nestjs/common';
import { AuthUseCases } from 'application/use-cases/AuthUseCases';
import { UsersUseCases } from 'application/use-cases/UsersUseCases';
import { LoginUserDto } from 'presentation/dto/auth/login-user.dto';
const { TokenExpiredError } = require('jsonwebtoken');
import {
  generateToken,
  verifyToken,
  generateRefreshToken,
} from '../../application/security/jwt-helper';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUseCases: AuthUseCases,
    private readonly userUseCases: UsersUseCases,
  ) {}

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authUseCases.login(loginUserDto.email, loginUserDto.password);
  }
  @Get('verifyToken')
  async verifyToken(@Headers() header) {
    try {
      const token = header.authorization.split(' ')[1];
      const secretKey =
        process.env.ACCESS_TOKEN_SECRET ||
        'ACCESSTOKENabc12345678910JErIuyiBDUIwmWMnlAY9QbLzoa';
      const decode = await verifyToken(token, secretKey);
      const user = await this.userUseCases.getUserById(decode.data.id);
      return {
        user,
        success: true,
        token,
      };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return {
          success: false,
        };
      } else {
        console.log(err);
      }
    }
  }
  @Get('/refreshToken')
  async refreshToken(@Headers() header, @Body() body) {
    try {
      const refreshToken = header.authorization.split(' ')[1];
      const refreshSecretKey =
        process.env.REFRESH_TOKEN_SECRET ||
        'REFRESHTOKENyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC';
      const decode = await verifyToken(refreshToken, refreshSecretKey);
      if (decode.data.id === body.id) {
        return {
          success: false,
        };
      }
      const user = await this.userUseCases.getUserById(body.id);
      if (user.refreshToken && refreshToken === user.refreshToken) {
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '1h';
        const accessTokenSecret =
          process.env.ACCESS_TOKEN_SECRET ||
          'ACCESSTOKENabc12345678910JErIuyiBDUIwmWMnlAY9QbLzoa';
        const accessToken = await generateToken(
          user,
          accessTokenSecret,
          accessTokenLife,
        );
        return {
          accessToken,
          success: true,
        };
      } else {
        return {
          success: false,
        };
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        try {
          this.authUseCases.deleteRefreshToken(body.id);
          return {
            success: false,
          };
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(err);
      }
    }
  }
  @Post('logout')
  async logout(@Body() body) {
    return this.authUseCases.deleteRefreshToken(body.id);
  }
}
