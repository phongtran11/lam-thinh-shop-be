import 'dotenv/config';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'pino-nestjs';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TConfigs } from './configs/configs.type';
import { GlobalResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  app.use(helmet());

  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const routePrefix = 'api';

  app.setGlobalPrefix(routePrefix);

  const config = new DocumentBuilder()
    .setTitle('API Documentation v1')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${routePrefix}/v1/docs`, app, document);

  const appPort = app
    .get(ConfigService<TConfigs>)
    .getOrThrow('commonConfig.appPort', { infer: true });

  await app.listen(appPort, () => {
    app
      .get(Logger)
      .log(
        `Application is running on: http://localhost:${appPort}/${routePrefix}/v1/docs`,
      );
  });
}

void bootstrap();
