import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RegisterAuthDto } from './register-auth.dto';
import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto { 
    @ApiProperty({ type: 'string', example: 'elbek@gmail.com' })
    @IsEmail()
    @IsString()
    email: string

    @ApiProperty({ type: 'string', example: '1111' })
    @IsString()
    password: string
}
