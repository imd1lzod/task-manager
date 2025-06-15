import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('otp')
export class OtpController {
    constructor(private otpService: OtpService) { }

    @Post('send')
    @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
    async send(@Body('email') email: string) {
        await this.otpService.generateAndSend(email);
        return { message: 'OTP jo`natildi' };
    }

    @Post('verify')
    @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, otp: { type: 'string' } } } })
    check(@Body() body: { email: string; otp: string }) {
        const valid = this.otpService.verify(body.email, body.otp);
        return { verified: valid };
    }
}
