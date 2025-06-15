import { ApiProperty } from "@nestjs/swagger";

export class SendOtpDto {
    @ApiProperty({type: 'string', example: 'name@gmail.com'})
    email:string
}