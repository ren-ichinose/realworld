import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

const mockUserService = () => ({
  create: jest.fn(),
});

const mockUser = {
  username: 'test',
  email: 'test@example.com',
  password: 'password',
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: 3600 },
        }),
      ],
      providers: [
        AuthService,
        { provide: UserService, useFactory: mockUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('signup', async () => {
    const expected = {
      username: mockUser.username,
      email: mockUser.email,
      bio: null,
      image: null,
      token: null,
    };

    const createdUser = {
      username: mockUser.username,
      email: mockUser.email,
      bio: null,
      image: null,
    };

    userService.create.mockResolvedValue(createdUser);
    const result = await service.signUp(mockUser);

    expect(result).toEqual(expected);
  });
});
