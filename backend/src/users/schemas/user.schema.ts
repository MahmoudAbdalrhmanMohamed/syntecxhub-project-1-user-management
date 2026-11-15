import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = String(ret._id);
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 100, index: true })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({ required: true, trim: true })
  phoneNumber: string;

  @Prop({
    default: '',
    trim: true,
  })
  avatar: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.VIEWER,
    index: true,
  })
  role: UserRole;

  @Prop({
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE,
    index: true,
  })
  status: UserStatus;

  @Prop({ default: 'Operations', trim: true })
  department: string;

  @Prop({ default: 'Specialist', trim: true })
  jobTitle: string;

  @Prop({ type: Date, default: () => new Date() })
  lastActiveAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ fullName: 'text', email: 'text', department: 'text' });
UserSchema.index({ role: 1, status: 1, createdAt: -1 });
