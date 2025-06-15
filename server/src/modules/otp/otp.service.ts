import { Injectable } from '@nestjs/common';
import { MailService } from '../../helpers/mailing/mail.service';

@Injectable()
export class OtpService {
    private store = new Map<string, string>();

    constructor(private mailService: MailService) { }

    async generateAndSend(email: string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.store.set(email, otp);
        setTimeout(() => this.store.delete(email), 5 * 60 * 1000);
        await this.mailService.sendOtp(email, otp);
    }

    verify(email: string, otp: string) {
        const valid = this.store.get(email) === otp;
        if (valid) this.store.delete(email);
        return valid;
    }
}
