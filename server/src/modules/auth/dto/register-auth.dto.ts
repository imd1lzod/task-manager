import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class RegisterAuthDto {
    @ApiProperty({type: 'string', example: 'Elbek'})
    @IsString()
    name: string

    @ApiProperty({ type: 'string', example: 'elbek@gmail.com' })
    @IsEmail()
    @IsString()
    email: string

    @ApiProperty({ type: 'string', example: '1111' })
    @IsString()
    password: string
}
