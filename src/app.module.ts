import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
