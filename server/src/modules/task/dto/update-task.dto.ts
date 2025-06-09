import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString } from "class-validator"
import { StatusEnum } from "../enum/status.enum"
import { Transform } from "class-transformer"

export class UpdateTaskDto {

    @ApiProperty({ type: 'string', example: 'Dars qilish', description: 'Topshiriq sarlavhasi' })
    @IsString()
    title: string

    @ApiProperty({ type: 'string', example: 'Dasturlashdan kod yozish, Ingliz tilidan 100 ta so`z yodlash', description: 'Topshiriq mazmuni'})
    @IsString()
    description: string

    @ApiProperty({ type: 'string', enum: StatusEnum, default: StatusEnum.IN_PROGRES })
    @IsEnum(StatusEnum)
    status: StatusEnum

    @ApiProperty({ type: 'string', format: 'date-time', description: 'Qachongacha topshiriqni bajarmoqchisiz?' })
    deadline: Date
}