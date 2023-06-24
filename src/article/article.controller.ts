import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Payload from 'src/interfaces/interface';
import { ArticleService } from './article.service';
import CreateArticleDto from './dto/create-article.dto';
import ResponseArticle from './interfaces/article.interface';
import UpdateArticleDto from './dto/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get(':slug')
  async getSingle(
    @Param('slug') slug: string,
  ): Promise<{ article: ResponseArticle }> {
    const article = await this.articleService.getSingle(slug);
    return { article };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body('article') createArticleDto: CreateArticleDto,
    @Req() { user }: { user: Payload },
  ): Promise<{ article: ResponseArticle }> {
    const article = await this.articleService.create(
      createArticleDto,
      user.sub,
    );
    return { article };
  }

  @Put(':slug')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('slug') slug: string,
    @Req() { user }: { user: Payload },
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<{ article: ResponseArticle }> {
    const article = await this.articleService.update(
      updateArticleDto,
      slug,
      user.sub,
    );
    return { article };
  }

  @Delete(':slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('slug') slug: string,
    @Req() { user }: { user: Payload },
  ): Promise<void> {
    await this.articleService.delete(slug, user.sub);
  }
}
