import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { IRolesRepository } from 'application/ports/IRolesRepository';
import { Role } from 'domain/models/Role';
import { RoleEntity } from 'infrastructure/database/mapper/RoleEntity';

import { BaseRepository } from './BaseRepository';

@Injectable()
export class RolesRepository extends BaseRepository<Role>
  implements IRolesRepository {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, RoleEntity);
  }
}
