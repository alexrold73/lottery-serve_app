import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ACCOUNT_ROLE, ACCOUNT_STATUS } from '../constants';

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({ type: Boolean, default: false })
  is_email_verified?: boolean;

  @Prop({
    type: String,
    enum: Object.keys(ACCOUNT_STATUS),
    default: ACCOUNT_STATUS.ACTIVE,
  })
  status?: ACCOUNT_STATUS;

  @Prop({
    type: String,
    enum: Object.keys(ACCOUNT_ROLE),
    default: ACCOUNT_ROLE.USER,
  })
  role?: ACCOUNT_ROLE;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => 'User' })
  updated_by?: User;
}
export const UserSchema = SchemaFactory.createForClass(User);
