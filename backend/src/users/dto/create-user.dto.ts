import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole, UserStatus } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'Nadia El-Masry', description: 'Full legal or display name' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  fullName: string;

  @ApiProperty({ example: 'nadia.elmasry@aegisauth.io', description: 'Unique work email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @ApiProperty({ example: '+20 100 482 9104', description: 'International phone number' })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[+0-9()\-\s]{7,25}$/, {
    message: 'Phone number must be 7 to 25 characters and contain valid phone digits',
  })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'https://api.dicebear.com/9.x/Notionists/svg?seed=Nadia', description: 'Avatar image URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.VIEWER, description: 'Access control role' })
  @IsEnum(UserRole, { message: 'Role must be one of: admin, manager, editor, viewer' })
  role: UserRole;

  @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVE, description: 'Account status' })
  @IsEnum(UserStatus, { message: 'Status must be one of: active, inactive, suspended' })
  status: UserStatus;

  @ApiPropertyOptional({ example: 'Platform Engineering', description: 'Organization department' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  department?: string;

  @ApiPropertyOptional({ example: 'Staff Systems Architect', description: 'Role title' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  jobTitle?: string;
}
