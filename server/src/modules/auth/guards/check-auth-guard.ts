import {
    BadRequestException,
    CanActivate,
    ConflictException,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/user/enums/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwt: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isProtected = this.reflector.getAllAndOverride<boolean>('istrue', [
            context.getHandler(),
            context.getClass(),
        ]);

        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request & { id?: number; role?: Role }>();
        const response = ctx.getResponse<Response>();

        if (!isProtected) {
            request.role = Role.USER;
            return true;
        }

        const cookies = request.headers.cookie;
        if (!cookies) throw new BadRequestException('Cookie mavjud emas');

        const parsedCookies = this.parseCookies(cookies);
        const accessToken = parsedCookies['access_token'];
        const refreshToken = parsedCookies['refresh_token'];


        if (!accessToken && !refreshToken) {
            throw new BadRequestException('Tokenlar mavjud emas');
        }

        try {
            const data = this.jwt.verify(accessToken);
            request.id = data.id;
            request.role = data.role;
            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError && refreshToken) {
                try {
                    const data = this.jwt.verify(refreshToken);

                    const newAccessToken = this.jwt.sign(
                        { id: data.id, role: data.role },
                        { expiresIn: '1h' },
                    );

                    response.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                    });

                    request.id = data.id;
                    request.role = data.role;
                    return true;
                } catch (refreshErr) {
                    throw new ForbiddenException('Refresh token yaroqsiz');
                }
            }

            if (error instanceof JsonWebTokenError) {
                throw new ConflictException('Token formati noto`g`ri');
            }

            throw new InternalServerErrorException('Token tekshiruvdagi server xatosi');
        }
    }

    private parseCookies(cookieHeader: string): Record<string, string> {
        return cookieHeader
            .split(';')
            .map((v) => v.trim().split('='))
            .reduce((acc, [key, val]) => {
                acc[key] = decodeURIComponent(val);
                return acc;
            }, {} as Record<string, string>);
    }
}
