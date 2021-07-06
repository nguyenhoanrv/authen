import { Module } from '@nestjs/common';
import { IRolesRepository } from 'application/ports/IRolesRepository';

import { IUsersRepository } from 'application/ports/IUsersRepository';
import { AuthUseCases } from 'application/use-cases/AuthUseCases';
import { UsersUseCases } from 'application/use-cases/UsersUseCases';
import { RolesRepository } from 'infrastructure/database/repositories/RolesRepository';
import { UsersRepository } from 'infrastructure/database/repositories/UsersRepository';
import { AuthController } from 'presentation/controllers/AuthController';
import { UsersController } from 'presentation/controllers/UsersController';

@Module({
  imports: [],
  controllers: [UsersController, AuthController],
  providers: [
    UsersUseCases,
    AuthUseCases,
    { provide: IUsersRepository, useClass: UsersRepository },
    { provide: IRolesRepository, useClass: RolesRepository },
  ],
})
export class UsersModule {}
