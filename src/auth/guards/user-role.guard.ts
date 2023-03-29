import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators';
import { ACCOUNT_ROLE } from '../../auth/constants';
import { User } from '../schemas';
/**
 * Guardia de roles de usuario en NestJS.
 *
 * Verifica si el usuario tiene los permisos necesarios para acceder al recurso solicitado.
 * @param context El contexto de ejecución.
 * @returns Verdadero si el usuario tiene los permisos necesarios, de lo contrario, falso.
 * @throws BadRequestException si el usuario no se encuentra.
 * @throws ForbiddenException si el usuario no tiene los permisos necesarios.
 */
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRols: ACCOUNT_ROLE[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    // Si validRol es undefine se asume que la ruta es publica
    if (!validRols) return true;
    if (validRols.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user)
      throw new BadRequestException(
        'Usuario no encontrado, por favor inicie sesión e inténtelo nuevamente',
      );
    if (!validRols.includes(user.role))
      throw new ForbiddenException(
        `Usuario, ${user.name} no tiene permiso para acceder al recurso solicitado.`,
      );
    return true;
  }
}
