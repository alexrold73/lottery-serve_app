import { SetMetadata } from '@nestjs/common';
import { ACCOUNT_ROLE } from '../../auth/constants';

export const META_ROLES = 'roles';
/**
 * Protege una ruta con roles de usuario.
 * @param args Los roles de usuario permitidos.
 * @returns Los roles de usuario permitidos.
 */
export const RoleProtected = (...args: ACCOUNT_ROLE[]) => {
  return SetMetadata(META_ROLES, args);
};
