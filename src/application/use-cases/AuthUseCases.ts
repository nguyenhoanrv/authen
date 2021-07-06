import { Injectable, Logger, NotFoundException } from '@nestjs/common';
const bcrypt = require('bcrypt');
import { IUsersRepository } from 'application/ports/IUsersRepository';
import { User } from 'domain/models/User';
const SALT_ROUNDS = 10;
import {
  generateToken,
  verifyToken,
  generateRefreshToken,
} from '../security/jwt-helper';

@Injectable()
export class AuthUseCases {
  private readonly logger = new Logger(AuthUseCases.name);
  constructor(private readonly usersRepository: IUsersRepository) {}

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: ['role'],
    });

    if (user) {
      this.logger.log(`Loging in: ${user.id}`);
      if (bcrypt.compareSync(password, user.password)) {
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '1h';
        const accessTokenSecret =
          process.env.ACCESS_TOKEN_SECRET ||
          'ACCESSTOKENabc12345678910JErIuyiBDUIwmWMnlAY9QbLzoa';
        const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '1d';
        const refreshTokenSecret =
          process.env.REFRESH_TOKEN_SECRET ||
          'REFRESHTOKENyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC';
        const newUser = {
          email,
          name: user.name,
          role: user.role,
          id: user.id,
        };
        const accessToken = await generateToken(
          newUser,
          accessTokenSecret,
          accessTokenLife,
        );
        const refreshToken = await generateRefreshToken(
          newUser.id,
          refreshTokenSecret,
          refreshTokenLife,
        );
        user.refreshToken = refreshToken;
        await this.usersRepository.save(user);
        return {
          success: true,
          user: newUser,
          tokenList: {
            accessToken,
            refreshToken,
          },
        };
      }
    }
    return {
      success: false,
    };
  }
  async deleteRefreshToken(id: number): Promise<{ success: boolean }> {
    try {
      const user = await this.usersRepository.findOne({ id });
      this.logger.log(`Loging out: ${user.id}`);
      user.refreshToken = null;
      await this.usersRepository.save(user);
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  }
}
