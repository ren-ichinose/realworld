import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import UserDTO from './dto/user.dto';
import UserResponse from './interfaces/auth.interface';
import AuthDto from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDto: UserDTO): Promise<UserResponse> {
    const crestedUser = await this.userService.create(userDto);
    const user = { ...crestedUser, token: null };
    return user;
  }

  async login(authDto: AuthDto): Promise<UserResponse> {
    const geteddUser = await this.userService.getByEmail(authDto.email);
    if (!geteddUser)
      throw new UnauthorizedException(
        'ユーザー名またはパスワードを確認してください',
      );

    const isValid = await bcrypt.compare(authDto.password, geteddUser.password);
    if (!isValid)
      throw new UnauthorizedException(
        'ユーザー名またはパスワードを確認してください',
      );

    const { id, username, email, bio, image } = geteddUser;
    const user = {
      username,
      email,
      bio,
      image,
      token: await this.generateJWT(id, email, username),
    };

    return user;
  }

  protected async generateJWT(
    id: number,
    email: string,
    username: string,
  ): Promise<string> {
    const payload = { sub: id, email, username };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
