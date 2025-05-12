import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  const allowedOrigins = [
    process.env.FRONTEND_URL, // e.g., https://toyxona.uz
    process.env.FRONTEND_DEV_URL || 'http://localhost:3000', // Development fallback
  ].filter(Boolean);

  console.log('Allowed CORS origins:', allowedOrigins);

  interface CorsOptionsDelegate {
    origin?: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => void;
    methods?: string;
    allowedHeaders?: string;
    credentials?: boolean;
  }

  const corsOptions: CorsOptionsDelegate = {
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('To‘yxona API')
    .setDescription(
      'Toshkent shahridagi to‘yxonalarni onlayn bron qilish tizimi',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
