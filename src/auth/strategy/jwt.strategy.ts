import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';

import { User } from '../schemas';
import { JwtPayload } from '../interfaces';

/**
 * Estrategia de autenticación JWT.
 *
 * Esta estrategia se utiliza para validar el token JWT
 * y devolver el usuario correspondiente.
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  /**
   * Valida el token JWT y devuelve el usuario correspondiente.
   * @param payload El objeto de carga útil del token JWT.
   * @throws UnauthorizedException si el usuario no existe o si no esta ACTIVE.
   * @returns El usuario correspondiente.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { UUID } = payload;
    const user = await this.userModel.findById({ _id: UUID });
    if (!user) throw new UnauthorizedException('Unauthorized');
    if (user.status !== 'ACTIVE') {
      const code = user.status.toLowerCase();
      throw new UnauthorizedException(`Unauthorized, user ${code}`);
    }
    return user;
  }
}
