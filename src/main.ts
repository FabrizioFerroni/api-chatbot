import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configApp } from './config/app/config.app';
import { CustomExceptionFilter } from './shared/filters/exceptions.filter';
import { configStrings } from './config/app/config.strings';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger/config.swagger.app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const hostCors = configApp().frontHost;
  const hostMethods = configApp().hostMethod;
  const hostallowedHeaders = configApp().hostAllowedHeader;
  const hostCredentials = configApp().hostCredentials;
  const entorno = configApp().env;
  const apiPort = configApp().apiPort;
  const tz = configApp().tz;

  app.enableCors({
    origin: hostCors,
    credentials: hostCredentials,
    methods: hostMethods,
    allowedHeaders: hostallowedHeaders,
  });

  app.useGlobalFilters(new CustomExceptionFilter());

  app.use((req, res, next) => {
    req.timezone = tz;
    res.removeHeader('X-Powered-By');
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false,
      },
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix(configStrings().apiVersion, {
    exclude: ['estado', { path: 'auth/(.*)', method: RequestMethod.ALL }],
  });

  setupSwagger(app, entorno);

  await app.listen(apiPort);
}

bootstrap();
