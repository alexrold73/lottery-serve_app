import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ACCOUNT_ROLE } from '../constants';
import { UserRoleGuard } from '../guards';
import { RoleProtected } from './role-protected.decorator';
/**
 * Protege una ruta con autenticación y roles de usuario.
 * @param roles Los roles de usuario permitidos.
 * @returns Los roles de usuario permitidos.
 */
export function Auth(...roles: ACCOUNT_ROLE[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
