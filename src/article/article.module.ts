import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [JwtModule, PrismaModule, UserModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
