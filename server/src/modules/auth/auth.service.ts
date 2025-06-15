import { BadRequestException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/prisma/prisma.client';
import * as bcrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }
  async register(body: RegisterAuthDto, res: Response) {
    await this.checkExistingUser(body.email)

    const hashedPassword = bcrypt.hashSync(body.password)

    const user = await this.prisma.user.create({ data: { name: body.name, email: body.email, password: hashedPassword } })

    const payload = { id: user.id, role: user.role }

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1h'
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d'
    })

    res.cookie('access_token', accessToken)
    res.cookie('refresh_token', refreshToken)

    return {
      message: 'Foydalanuvchi muvaffaqiyatli ro`yxatdan o`tdi',
      data: user,
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
  }

  async login(body: LoginAuthDto,  res: Response) {

    await this.checkNotExistingUser(body.email)

    const user: any = await this.prisma.user.findUnique({ where: { email: body.email } })

    const passedPassword = bcrypt.compareSync(body.password, user.password)

    if (!passedPassword) {
      return res.send('Parol xato kiritildi!')
    }

    const payload = { id: user.id, role: user.role }

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1h'
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d'
    })

    res.cookie('access_token', accessToken)
    res.cookie('refresh_token', refreshToken)

    return {
      message: 'Foydalanuvchi muvaffaqiyatli tizimga kirdi!',
      tokes: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
  }

  async checkExistingUser(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (user) {
      throw new BadRequestException(
        'Bunday emaildagi foydalanuvchi allaqachon ro`xatdan o`tgan! | Boshqa emaildan urinib ko`ring'
      )
    }
  }

  async checkNotExistingUser(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new BadRequestException(
        'Bunday emaildagi foydalanuvchi mavjud emas!\nBoshqa emaildan urinib ko`ring'
      )
    }
  }

  async refreshToken(oldToken: string) {
    try {
      const payload = this.jwtService.verify(oldToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const user = await this.prisma.user.findUnique(payload.id);
      if (!user) {
        throw new UnauthorizedException();
      }

      const newAccessToken = this.jwtService.sign(
        { id: user.id, role: user.role },
        { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '1h' },
      );

      const newRefreshToken = this.jwtService.sign(
        { id: user.id, role: user.role },
        { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
