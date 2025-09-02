import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as path from "path";
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Back End API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter your JWT(token)`,
        name: 'JWT',
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
        in: 'header',
      },
      'JWT',
    ).addServer('/')
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      withCredentials: true,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, customOptions);

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
