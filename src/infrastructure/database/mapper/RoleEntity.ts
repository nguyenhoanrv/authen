import { EntitySchema } from 'typeorm';

import { Role } from 'domain/models/Role';

import { BaseEntity } from './BaseEntity';
import { User } from 'domain/models/User';
import { UserEntity } from './UserEntity';

export const RoleEntity = new EntitySchema<Role>({
  name: 'Role',
  tableName: 'roles',
  target: Role,
  columns: {
    ...BaseEntity,
    name: {
      type: String,
    },
    role: {
      type: Number,
    },
  },

  relations: {
    users: {
      type: 'one-to-many',
      target: () => User,
      inverseSide: 'user',
    },
  },
});
