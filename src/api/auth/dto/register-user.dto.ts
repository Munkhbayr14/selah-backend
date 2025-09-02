import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    IsOptional,
    IsBoolean,
    IsObject,
    IsEnum,
} from 'class-validator';
import { UserRole } from 'src/common/model/roles.model';

export class RegisterUserDto {
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastname: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    confirmationPassword: string;

    @IsEnum(UserRole)
    role?: UserRole;
}
