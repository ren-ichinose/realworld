import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import UserDTO from './dto/user.dto';
import UserResponse from './interfaces/auth.interface';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('users')
  async signUp(
    @Body('user') userDto: UserDTO,
  ): Promise<{ user: UserResponse }> {
    const user = await this.authService.signUp(userDto);
    return { user };
  }

  @Post('users/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body('user') authDto: AuthDto): Promise<{ user: UserResponse }> {
    const user = await this.authService.login(authDto);
    return { user };
  }
}
