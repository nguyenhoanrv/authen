import { Injectable } from '@nestjs/common';

import { Role } from 'domain/models/Role';

import { IRepository } from './IRepository';

@Injectable()
export abstract class IRolesRepository extends IRepository<Role> {}
