import 'dotenv/config';
import helmet from 'helmet';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from 'src/app.module';
import { Configurations } from './shared/configs';
import { HttpExceptionFilter } from './shared/filters/http-exceptions';
import { GlobalResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.set('query parser', 'extended');
  app.use(helmet());
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
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
    .get(ConfigService<Configurations>)
    .getOrThrow('app.port', { infer: true });

  await app.listen(appPort, () => {
    const logger = new Logger('Bootstrap');
    logger.log(
      `Swagger is running on: http://localhost:${appPort}/${routePrefix}/v1/docs`,
    );
  });
}

void bootstrap();
