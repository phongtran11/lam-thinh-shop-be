import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { GlobalResponseInterceptor } from './shared/interceptors/response.interceptor';
import { Logger, LoggerErrorInterceptor } from 'pino-nestjs';

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

  const version = 'v1';
  const routePrefix = `api/${version}`;

  app.setGlobalPrefix(routePrefix);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .setVersion(version)
    .addGlobalResponse({
      status: 400,
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${routePrefix}/docs`, app, document);

  await app.listen(process.env.APP_PORT ?? 3000, () => {
    app
      .get(Logger)
      .log(
        `Application is running on: http://localhost:${process.env.APP_PORT ?? 3000}/${routePrefix}`,
      );
  });
}

void bootstrap();
