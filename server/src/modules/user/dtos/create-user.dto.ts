import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsString } from "class-validator"
import { Gender } from "../enums/gender.enum"
import { Role } from "../enums/role.enum"

export class CreateUserDto {
    @ApiProperty({ type: 'string', example: 'Ali' })
    @IsString()
    name: string

    @ApiProperty({ type: 'string', example: 'ali@gmail.com' })
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty({ type: 'string', example: '1111' })
    @IsString()
    password: string

    @ApiProperty({ type: 'string', enum: Gender })
    @IsEnum(Gender)
    gender: string

    @ApiProperty({ type: 'string', enum: Role, default: Role.USER })
    @IsEnum(Role)
    role?: string

    @ApiProperty({ default: true })
    isActive?: boolean
}