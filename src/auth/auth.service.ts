import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto, UpdateStatusDto } from './dto';
import { User } from './schemas';
import { JwtPayload } from './interfaces';
import { ACCOUNT_ROLE } from './constants';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    // User Model Injetc
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    //**********JWT Service**********
    private readonly jwtService: JwtService,
  ) {}

  //**********Get-JWT**********
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  //**********handleException**********
  private handleException(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Error de clave duplicada ${JSON.stringify(error.keyValue)} `,
      );
    }
    this.logger.log(error, AuthService.name);
    throw new InternalServerErrorException();
  }

  //**********GET USER BY ID**********
  private async getUserById(id: string) {
    const targetUser = await this.userModel.findById(id);
    if (!targetUser) throw new NotFoundException(`El Usuario, no existe `);
    return targetUser;
  }

  //**********register new user**********
  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, id, role, status, is_email_verified } =
        await this.userModel.create({
          email: createUserDto.email.toLowerCase(),
          name: createUserDto.name.trim().toLowerCase().replace(/\s\s+/g, ' '),
          password: bcrypt.hashSync(createUserDto.password, 10),
        });
      return {
        name,
        email,
        role,
        status,
        verified: is_email_verified,
        _id: id,
        access_token: this.getJwtToken({ UUID: id }),
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  //**********Login**********
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email }).select('+password');
    // USER NOT FOUNT
    if (!user)
      throw new UnauthorizedException(
        'La dirección de correo electrónico o la contraseña que ingresó no son válidas.',
      );
    // PASSWORD INCORRECT
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(
        'La dirección de correo electrónico o la contraseña que ingresó no son válidas.',
      );
    // USER NOT ACTIVE
    if (user.status !== 'ACTIVE') {
      const code = user.status.toLowerCase();
      throw new UnauthorizedException(
        `Acceso no autorizado, por favor comunícate con un administrador para verificar el estado de tu cuenta, Unauthorized user ${code}`,
      );
    }
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      verified: user.is_email_verified,
      _id: user._id,
      access_token: this.getJwtToken({ UUID: user.id }),
    };
  }

  //**********All Users**********
  async findAll(user: User) {
    if (user.role === ACCOUNT_ROLE.ADMIN) return await this.userModel.find({});
    return await this.userModel.find({
      role: { $nin: [ACCOUNT_ROLE.ADMIN, ACCOUNT_ROLE.ATC] },
    });
  }

  //**********USER BY ID**********
  async findOne(id: string, user: User) {
    const errorMessage = `Usuario, ${user.name} no tiene permiso para acceder al recurso solicitado.`;
    const targetUser = await this.getUserById(id);
    if (
      targetUser.role === ACCOUNT_ROLE.ADMIN &&
      user.role !== ACCOUNT_ROLE.ADMIN
    )
      throw new ForbiddenException(errorMessage);
    if (
      targetUser.role !== ACCOUNT_ROLE.ADMIN &&
      targetUser.role !== ACCOUNT_ROLE.ATC &&
      user.role !== ACCOUNT_ROLE.ADMIN &&
      user.role !== ACCOUNT_ROLE.ATC &&
      targetUser._id.toString() !== user._id.toString()
    )
      throw new ForbiddenException(errorMessage);
    if (
      targetUser.role === ACCOUNT_ROLE.ATC &&
      user.role === ACCOUNT_ROLE.ATC &&
      targetUser._id.toString() !== user._id.toString()
    )
      throw new ForbiddenException(errorMessage);
    if (
      targetUser.role === ACCOUNT_ROLE.ATC &&
      user.role !== ACCOUNT_ROLE.ATC &&
      user.role !== ACCOUNT_ROLE.ADMIN
    )
      throw new ForbiddenException(errorMessage);
    return targetUser;
  }

  //**********UPDATE USER BY ID**********
  async updateUser(id: string, updateUserDto: UpdateUserDto, user: User) {
    if (id !== user._id.toString())
      throw new ForbiddenException(
        `Usuario, ${user.name} no tiene permiso para acceder al recurso solicitado.`,
      );
    const { email, name, password } = updateUserDto;
    await this.getUserById(id);
    try {
      return await this.userModel.findByIdAndUpdate(
        { _id: id },
        {
          email: email ? email.toLowerCase() : undefined,
          name: name
            ? name.trim().toLowerCase().replace(/\s\s+/g, ' ')
            : undefined,
          password: password ? bcrypt.hashSync(password, 10) : undefined,
          is_email_verified: email ? false : undefined,
          updated_by: user,
        },
        { new: true },
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  //**********UPDATE ROLE BY ID**********
  async updateRole(id: string, updateRoleDto: UpdateRoleDto, user: User) {
    await this.getUserById(id);
    try {
      return await this.userModel.findByIdAndUpdate(
        { _id: id },
        {
          ...updateRoleDto,
          updated_by: user,
        },
        { new: true },
      );
    } catch (error) {
      this.handleException(error);
    }
  }

  //**********UPDATE STATUS BY ID**********
  async updateStatus(id: string, updateStatusDto: UpdateStatusDto, user: User) {
    await this.findOne(id, user);
    try {
      return await this.userModel.findByIdAndUpdate(
        { _id: id },
        {
          ...updateStatusDto,
          updated_by: user,
        },
        { new: true },
      );
    } catch (error) {
      this.handleException(error);
    }
  }
}

// TODO: Implementar
/*
requiere modulo de envio de email {
  verifiar rmail
  generar new password user de la misma cuenta olvido contraceña
}
*/
