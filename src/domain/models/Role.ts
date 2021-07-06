import { DomainException } from 'domain/exceptions/DomainException';
import { IEntity } from 'domain/shared/IEntity';
import { User } from './User';

export class Role {
  id?: number;

  role: number;

  name: string;

  users?: User[];

  createdAt?: Date;

  updatedAt?: Date;

  constructor(name: string, role: number, id?: number) {
    this.name = name;
    this.role = role;
    this.id = id;
  }
}
