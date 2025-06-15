import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailService } from '../../helpers/mailing/mail.service';
import { OtpController } from './otp.controller';

@Module({
    controllers: [OtpController],
    providers: [OtpService, MailService],
})
export class OtpModule { }
