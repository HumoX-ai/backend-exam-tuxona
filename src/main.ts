import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

console.log('JWT_SECRET:', process.env.JWT_SECRET);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Global validatsiya pipe qo'shish
  app.useGlobalPipes(new ValidationPipe());

  // Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('To‘yxona API')
    .setDescription(
      'Toshkent shahridagi to‘yxonalarni onlayn bron qilish tizimi',
    )
    .setVersion('1.0')
    .addBearerAuth() // JWT autentifikatsiyasi uchun
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Avtorizatsiyani saqlash
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
