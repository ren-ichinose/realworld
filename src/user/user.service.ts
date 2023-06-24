import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import UserDTO from '../auth/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userDto: UserDTO,
  ): Promise<Omit<User, 'id' | 'password' | 'created_at' | 'updated_at'>> {
    const { username, email, password } = userDto;

    const salt = await bcrypt.genSalt();
    const hasshedPassword = await bcrypt.hash(password, salt);

    /* eslint-disable @typescript-eslint/naming-convention */

    const {
      id,
      password: createdUserPassword,
      created_at,
      updated_at,
      ...rest
    } = await this.prisma.user.create({
      data: { username, email, password: hasshedPassword },
    });

    /* eslint-enable */

    return rest;
  }

  async getByEmail(
    email: string,
  ): Promise<Omit<User, 'created_at' | 'updated_at'> | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }

    /* eslint-disable @typescript-eslint/naming-convention */

    const { created_at, updated_at, ...rest } = user;
    return rest;

    /* eslint-enable */
  }

  async getByid(
    id: number,
  ): Promise<Omit<User, 'created_at' | 'updated_at'> | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return null;
    }

    /* eslint-disable @typescript-eslint/naming-convention */

    const { created_at, updated_at, ...rest } = user;
    return rest;

    /* eslint-enable */
  }
}
