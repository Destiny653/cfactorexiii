import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Enhanced CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, // Cache CORS preflight for 24 hours
  });

  // Static files configuration
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
    maxAge: '30d', // Cache static files for 30 days
    immutable: true, // For better caching of immutable files
  });

  // Get port from environment or use default
  const port = configService.get<number>('PORT') || 3000;

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.log('SIGTERM received. Closing server...');
    app.close().then(() => {
      logger.log('Server successfully closed');
      process.exit(0);
    });
  });

  await app.listen(port, '0.0.0.0', () => {
    logger.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
    logger.log(`📁 Serving static files from: ${join(__dirname, '..', 'uploads')}`);
  });
}

bootstrap().catch(err => {
  console.error('Application failed to start!', err);
  process.exit(1);
});