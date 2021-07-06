import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IRolesRepository } from 'application/ports/IRolesRepository';

import { IUsersRepository } from 'application/ports/IUsersRepository';
import { User } from 'domain/models/User';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
@Injectable()
export class UsersUseCases {
  private readonly logger = new Logger(UsersUseCases.name);

  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly rolesRepository: IRolesRepository,
  ) {}

  async getUsers(): Promise<User[]> {
    this.logger.log('Find all users');

    return await this.usersRepository.find({ loadEagerRelations: true });
  }

  async getUserById(id: number): Promise<User> {
    this.logger.log(`Find the user: ${id}`);

    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundException(`The user {${id}} has not found.`);

    return user;
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    roleId: number,
  ) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (user) {
      return {
        success: false,
        message: 'Email da ton tai',
      };
    } else {
      const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);
      const role = await this.rolesRepository.findOne({
        where: { id: roleId },
      });
      const user = {
        name,
        password: hashPassword,
        email,
        role,
      };
      const newUser = await this.usersRepository.save(user);
      if (!newUser) {
        return {
          success: false,
          message: 'Thu lai !',
        };
      } else {
        return {
          success: true,
          user: {
            name,
            email,
            role,
          },
        };
      }
    }
  }

  async updateUser(user: User): Promise<boolean> {
    this.logger.log(`Updating a user: ${user.id}`);
    const result = await this.usersRepository.update({ id: user.id }, user);

    return result.affected > 0;
  }

  async deleteUser(id: number): Promise<boolean> {
    this.logger.log(`Deleting a user: ${id}`);
    const result = await this.usersRepository.delete({ id });

    return result.affected > 0;
  }
}
