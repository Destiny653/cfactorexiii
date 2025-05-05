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
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        ...(configService.get('CORS_ORIGINS')?.split(',') || []),
        'http://localhost:5173',
        'https://localhost:5173',
        'https://cfactorexi.vercel.app/#',
        'https://cfactorexi.vercel.app',

      ];
      
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      
      logger.warn(`Blocked CORS request from origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Request-ID'],
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
  
  app.enableCors(corsOptions);

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
  // logger.log(`📁 Static files are served from: ${staticPath}`);
  // logger.log(`🌍 CORS settings: ${JSON.stringify(corsOptions, null, 2)}`);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.warn('SIGTERM received. Closing server...');
    await app.close();
    // logger.log('Server closed.');
    process.exit(0);
  });
}

bootstrap().catch((err) => {
  console.error('🚨 Failed to start application:', err);
  process.exit(1);
});