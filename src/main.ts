import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ParseIntPipe)

  const config = new DocumentBuilder()
    .setTitle('User')
    .setDescription('the user Api')
    .setVersion("0.1")
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('', app, documentFactory)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
