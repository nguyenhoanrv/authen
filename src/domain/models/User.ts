import { DomainException } from 'domain/exceptions/DomainException';
import { IEntity } from 'domain/shared/IEntity';
import { Role } from './Role';
export class User implements IEntity {
  id?: number;

  name: string;

  email: string;

  password: string;

  role: Role;

  refreshToken?: string;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(
    name: string,
    email: string,
    password: string,
    role: Role,
    id?: number,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.id = id;
  }

  equals(entity: IEntity) {
    if (!(entity instanceof User)) return false;

    return this.id === entity.id;
  }
}
