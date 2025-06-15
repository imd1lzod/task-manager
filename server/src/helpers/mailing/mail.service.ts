import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });

    async sendOtp(email: string, otp: string): Promise<void> {
        // const verifyUrl = `https://localhost:4000/otp/verify`;

        await this.transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Kodni quyidagi link orqali tasdiqlang',
            html: `
            <p>Sizning tasdiqlash kodingiz: <b>${otp}</b></p>
        `,
            // text: `Kod: ${otp}. Tasdiqlash havolasi: ${verifyUrl}`,
        });
    }

}
