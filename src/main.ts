import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // Bu qator qo'shildi

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // NestExpressApplication tipini ko'rsatdik

  // CORS configuration
  app.enableCors({
    origin: [
      'https://your-frontend-domain.com', // Replace with your production frontend URL
      'http://localhost:5173', // Allow localhost for development (optional)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies or auth headers (if needed)
  });

  // Global validation pipe qo'shish
  app.useGlobalPipes(new ValidationPipe());

  // Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle("To'yxona API")
    .setDescription(
      "Toshkent shahridagi to'yxonalarni onlayn bron qilish tizimi",
    )
    .setVersion('1.0')
    .addBearerAuth() // JWT autentifikatsiyasi uchun
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
