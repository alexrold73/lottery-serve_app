import { IsEnum, IsString } from 'class-validator';
import { ACCOUNT_STATUS } from '../constants/auth.constants';

export class UpdateStatusDto {
  @IsString()
  @IsEnum(ACCOUNT_STATUS)
  readonly status: string;
}
