import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  photo?: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiration?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);