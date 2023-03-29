import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
/**
 * Obtiene el usuario de la solicitud.
 * @param data Los datos de la solicitud.
 * @param context El contexto de ejecución.
 * @returns El usuario de la solicitud.
 * @throws InternalServerErrorException si el usuario no se encuentra.
 */
export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new InternalServerErrorException();
    return !data ? user : user[data];
  },
);
