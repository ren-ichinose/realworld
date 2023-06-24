import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';

const mockPrismaService = () => ({
  user: {
    create: jest.fn(),
  },
});

const mockUser = {
  username: 'test',
  email: 'test@example.com',
  password: 'password',
};

describe('UserService', () => {
  let service: UserService;
  let prismaService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useFactory: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('create user', async () => {
    const createdUser = {
      id: 100,
      username: mockUser.username,
      email: mockUser.email,
      bio: null,
      image: null,
      password: mockUser.password,
      created_at: '2023-06-10 10:00:00.000',
      updated_at: '2023-06-10 10:00:00.000',
    };

    const expected = {
      username: mockUser.username,
      email: mockUser.email,
      bio: null,
      image: null,
    };

    prismaService.user.create.mockResolvedValue(createdUser);
    const result = await service.create(mockUser);
    expect(result).toEqual(expected);
  });
});
