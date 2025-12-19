import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from './config/env-validation.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix to match Next.js API routes
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: '*',
  });

  const configService = app.get(ConfigService<Env>);
  const port = configService.get('PORT', { infer: true }) ?? 3000;

  await app.listen(port);
}
bootstrap();
