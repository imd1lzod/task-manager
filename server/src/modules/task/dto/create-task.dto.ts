import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { StatusEnum } from '../enum/status.enum';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
    @ApiProperty({ type: 'string', example: 'Dars qilish', description: 'Topshiriq sarlavhasi' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ type: 'string', example: 'Dasturlashdan kod yozish, Ingliz tilidan 100 ta so`z yodlash', description: 'Topshiriq mazmuni' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: 'string', enum: StatusEnum, default: StatusEnum.IN_PROGRES })
    @IsEnum(StatusEnum)
    @IsNotEmpty()
    status: StatusEnum;

    @ApiProperty({ type: 'string', format: 'date-time', description: 'Qachongacha topshiriqni bajarmoqchisiz?' })
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    deadline: Date;

    @ApiProperty({ type: 'integer', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
    userId: number;
}