import 'dotenv/config';
import request from 'supertest';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthResDto } from 'src/modules/auth/dto/auth.dto';
import { RefreshTokensRepository } from 'src/modules/auth/repositories/refresh-token.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { SuccessResponseDto } from 'src/shared/dto/response.dto';
import { GlobalResponseInterceptor } from 'src/shared/interceptors/response.interceptor';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  const routePrefix = 'api';
  const api = (path: string) => `/${routePrefix}/v1${path}`;

  let accessToken: string;
  let refreshToken: string;

  const uniqueEmail = `e2e_${Date.now()}@example.com`;
  const password = 'Password123!';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalInterceptors(new GlobalResponseInterceptor());
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
    app.setGlobalPrefix(routePrefix);
    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
    await app.init();
  });

  const cleanUp = async () => {
    await app
      .get(RefreshTokensRepository)
      .createQueryBuilder('refresh_token')
      .delete()
      .where(
        (qb) => {
          return `EXISTS (${qb.select('1').from(User, 'u').where('u.email = :email').andWhere('refresh_token.user_id = u.id').getQuery()})`;
        },
        {
          email: uniqueEmail,
        },
      )
      .execute();

    await app.get(UsersRepository).delete({ email: uniqueEmail });
  };

  afterAll(async () => {
    await cleanUp();
    await app.close();
  });

  it('registers a new user and returns tokens', async () => {
    const res = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .post(api('/auth/register'))
      .send({
        email: uniqueEmail,
        password,
        passwordConfirm: password,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '0123456789',
      })
      .expect(201);
    const body = res.body as SuccessResponseDto<AuthResDto>;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe('success');
    expect(body.data.accessToken).toBeDefined();
    expect(body.data.refreshToken).toBeDefined();

    accessToken = body.data.accessToken;
    refreshToken = body.data.refreshToken;
  });

  it('logs in with the registered user', async () => {
    const res = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .post(api('/auth/login'))
      .send({ email: uniqueEmail, password })
      .expect(201);
    const body = res.body as SuccessResponseDto<AuthResDto>;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe('success');
    expect(body.data.accessToken).toBeDefined();
    expect(body.data.refreshToken).toBeDefined();
  });

  it('refreshes token with refresh token', async () => {
    const res = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .post(api('/auth/refresh-token'))
      .send({ refreshToken })
      .expect(201);
    const body = res.body as SuccessResponseDto<AuthResDto>;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe('success');
    expect(body.data.accessToken).toBeDefined();
    expect(body.data.refreshToken).toBeDefined();

    accessToken = body.data.accessToken;
    refreshToken = body.data.refreshToken;
  });

  it('logs out and revokes the refresh token', async () => {
    await request(app.getHttpServer() as unknown as import('http').Server)
      .post(api('/auth/logout'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken })
      .expect(204);
  });
});
