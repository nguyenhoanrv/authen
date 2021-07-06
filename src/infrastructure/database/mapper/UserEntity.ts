import { EntitySchema } from 'typeorm';

import { User } from 'domain/models/User';

import { BaseEntity } from './BaseEntity';
import { Role } from 'domain/models/Role';

export const UserEntity = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  target: User,
  columns: {
    ...BaseEntity,
    name: {
      type: String,
      length: 100,
    },
    email: {
      type: String,
      length: 100,
    },
    password: {
      type: String,
    },
    refreshToken: {
      type: String,
      nullable: true,
    },
  },
  orderBy: {
    createdAt: 'ASC',
  },
  relations: {
    role: {
      type: 'many-to-one',
      target: () => Role,
      joinColumn: true,
    },
  },
  indices: [
    {
      name: 'IDX_USERS',
      unique: true,
      columns: ['name', 'email'],
    },
  ],
  uniques: [
    {
      name: 'UNIQUE_USERS',
      columns: ['email'],
    },
  ],
});
