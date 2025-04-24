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

  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  });

  // Serve static files
  const staticPath = join(__dirname, '..', 'uploads');
  app.useStaticAssets(staticPath, {
    prefix: '/uploads/',
    maxAge: '30d',
    immutable: true,
  });

  // Use dynamic port from environment (for Render)
  const port = Number(process.env.PORT) || configService.get<number>('PORT') || 3000;

  // Start server
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Server is running on http://0.0.0.0:${port}`);
  logger.log(`📁 Static files are served from: ${staticPath}`);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.warn('SIGTERM received. Closing server...');
    await app.close();
    logger.log('Server closed.');
    process.exit(0);
  });
}

bootstrap().catch((err) => {
  console.error('🚨 Failed to start application:', err);
  process.exit(1);
});
