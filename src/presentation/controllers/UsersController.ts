import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { plainToClass, Expose } from 'class-transformer';

import { UsersUseCases } from 'application/use-cases/UsersUseCases';
import { CreateUserDto } from 'presentation/dto/user/create-user.dto';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { NotFoundError } from 'presentation/errors/NotFoundError';
import { UserDto } from 'presentation/dto/user/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersUseCases: UsersUseCases) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Find one user by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The user id',
  })
  @ApiOkResponse({ description: 'User founded.', type: UserDto })
  @ApiNotFoundResponse({
    description: 'User cannot be founded.',
    type: NotFoundError,
  })
  async get(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersUseCases.getUserById(parseInt(id, 10));

    return UserDto.toViewModel(user);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  @ApiOkResponse({ description: 'All user`s fetched.', type: [UserDto] })
  async getAll(): Promise<UserDto[]> {
    const users = await this.usersUseCases.getUsers();

    return users.map(user => UserDto.toViewModel(user));
  }

  @Post()
  @ApiOperation({
    summary: 'Creates an user',
  })
  @ApiCreatedResponse({ description: 'User created.', type: UserDto })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while creating user',
    type: UnprocessableEntityError,
  })
  async createUser(@Body() createUser: CreateUserDto) {
    const { name, email, password, roleId } = createUser;
    return await this.usersUseCases.createUser(email, password, name, roleId);

    // return plainToClass(UserDto, newUser, {
    //   excludeExtraneousValues: true,
    // });
  }
}
