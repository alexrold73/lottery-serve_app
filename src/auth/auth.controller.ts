import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';

import { ACCOUNT_ROLE } from './constants';
import { Auth, GetUser } from './decorators';
import { AuthService } from './auth.service';
import { ParseMongoIdPipe } from '../common/pipes';
import { User } from './schemas';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateRoleDto,
  UpdateStatusDto,
  UpdateUserDto,
} from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('auth/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('/users')
  @Auth(ACCOUNT_ROLE.ADMIN, ACCOUNT_ROLE.ATC)
  findAll(@GetUser() user: User) {
    return this.authService.findAll(user);
  }

  @Get('/users/:id')
  @Auth()
  findOne(@GetUser() user: User, @Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.findOne(id, user);
  }

  @Patch('/users/update-role/:id')
  @Auth(ACCOUNT_ROLE.ADMIN)
  updateRole(
    @GetUser() user: User,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.authService.updateRole(id, updateRoleDto, user);
  }

  @Patch('/users/update-status/:id')
  @Auth(ACCOUNT_ROLE.ADMIN)
  updateStatus(
    @GetUser() user: User,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.authService.updateStatus(id, updateStatusDto, user);
  }

  @Patch('/users/update/:id')
  @Auth()
  updateUser(
    @GetUser() user: User,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, updateUserDto, user);
  }
}
