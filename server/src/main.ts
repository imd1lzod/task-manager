import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser"
import { ErrorHandler } from './filters/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: { enableImplicitConversion: true }
  }))

  app.useGlobalFilters(new ErrorHandler())

  const config = new DocumentBuilder()
    .setTitle('User')
    .setDescription('the user Api')
    .setVersion("0.1")
    .addBearerAuth()
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('', app, documentFactory)
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
