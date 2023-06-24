import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

const mockPrismaService = () => ({
  user: {
    create: jest.fn(),
  },
});

const mockUser = {
  user: {
    username: 'test',
    email: 'test@example.com',
    password: 'password',
  },
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
    })
      .overrideProvider(PrismaService)
      .useFactory({ factory: mockPrismaService })
      .compile();

    prismaService = moduleFixture.get(PrismaService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST)', () => {
    const createdUser = {
      id: 100,
      username: mockUser.user.username,
      email: mockUser.user.email,
      bio: null,
      image: null,
      password: mockUser.user.password,
      created_at: '2023-06-10 10:00:00.000',
      updated_at: '2023-06-10 10:00:00.000',
    };

    const expectedResponse = {
      user: {
        username: mockUser.user.username,
        email: mockUser.user.email,
        bio: null,
        image: null,
        token: null,
      },
    };

    prismaService.user.create.mockResolvedValue(createdUser);

    return request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201)
      .expect(expectedResponse);
  });
});
