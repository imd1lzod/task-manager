import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"
import { Gender } from "../enums/gender.enum"
import { Role } from "../enums/role.enum"

export class UpdateUserDto {
    @ApiProperty({ type: 'string', example: 'Ali' })
    @IsString()
    name: string

    @ApiProperty({ type: 'string', example: '1111' })
    @IsString()
    password: string

    @ApiProperty({ type: 'string', enum: Gender })
    gender: Gender
}