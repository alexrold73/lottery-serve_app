import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'El formato de correo electrónico no  es válido' })
  readonly email?: string;

  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe contener un minimo de 8 caracteres',
  })
  @MaxLength(20, {
    message: 'La contraseña debe contener un maximo de 20 caracteres',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener, caracteres en mayúsculas, minúsculas y números',
  })
  @Matches(/^[a-zA-Z0-9*+\-.@#$%&]+$/, {
    message:
      'La contraseña solo puede contener letras, números y los caracteres * + - . @ # $ % &',
  })
  @IsOptional()
  readonly password?: string;

  @IsString()
  @MinLength(4, { message: 'El nombre debe tener un minimo de 4 caracteres' })
  @MaxLength(50, { message: 'El nombre debe tener un maximo de 50 caracteres' })
  @IsOptional()
  readonly name?: string;
}
