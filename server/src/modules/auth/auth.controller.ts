import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async create(@Body() createAuthDto: RegisterAuthDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.register(createAuthDto, res)
  }

  @Post('login')
  async login(@Body() body: LoginAuthDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(body, res)
  }

}
