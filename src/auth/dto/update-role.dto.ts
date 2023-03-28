import { IsEnum, IsString } from 'class-validator';
import { ACCOUNT_ROLE } from '../constants/auth.constants';

export class UpdateRoleDto {
  @IsString()
  @IsEnum(ACCOUNT_ROLE)
  readonly role: string;
}
