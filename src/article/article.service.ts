import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Article } from '@prisma/client';
import CreateArticleDto from './dto/create-article.dto';
import ResponseArticle from './interfaces/article.interface';
import UpdateArticleDto from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getSingle(slug: string): Promise<ResponseArticle> {
    const getedArticle = await this.getArticleDataBySlug(slug);
    if (!getedArticle)
      throw new NotFoundException('ページが見つかりませんでした');

    const article = await this.buildResponseArticleData(getedArticle);
    if (!article) throw new BadRequestException('ページが見つかりませんでした');

    return article;
  }

  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
  ): Promise<ResponseArticle> {
    const { title, description, body, tagList } = createArticleDto;

    const slug = this.createSlug(title);
    const data = { slug, title, description, body, userId };
    const createdArticle = await this.prisma.article.create({ data });

    const article = await this.buildResponseArticleData(
      createdArticle,
      tagList,
    );
    if (!article) throw new BadRequestException('ページが見つかりませんでした');

    return article;
  }

  async update(
    updateArticleDto: UpdateArticleDto,
    slug: string,
    userId: number,
  ): Promise<ResponseArticle> {
    const getedArticle = await this.getArticleDataBySlug(slug);
    if (!getedArticle || getedArticle.userId !== userId)
      throw new ForbiddenException('更新ができませんでした');

    const updatedSlug = this.createSlug(getedArticle.title);

    const data = { ...updateArticleDto, slug: updatedSlug };
    const updatedArticle = await this.prisma.article.update({
      where: { id: getedArticle.id },
      data,
    });

    const article = await this.buildResponseArticleData(updatedArticle);
    if (!article) throw new BadRequestException('ページが見つかりませんでした');

    return article;
  }

  async delete(slug: string, userId: number): Promise<void> {
    const getedArticle = await this.getArticleDataBySlug(slug);

    if (!getedArticle || getedArticle.userId !== userId)
      throw new ForbiddenException('削除ができませんでした');

    await this.prisma.article.delete({ where: { slug } });
  }

  private async getArticleDataBySlug(slug: string): Promise<Article | null> {
    const getedArticle = await this.prisma.article.findUnique({
      where: { slug },
    });
    return getedArticle;
  }

  private async buildResponseArticleData(
    articleData: Article,
    tagListData?: string[],
  ): Promise<ResponseArticle | null> {
    const getedUser = await this.userService.getByid(articleData.userId);
    if (!getedUser) return null;

    const { id, userId, slug, ...rest } = articleData;
    const { username, bio, image } = getedUser;

    const author = {
      username,
      bio,
      image,
      following: false,
    };

    const article = {
      slug,
      ...rest,
      tagList: tagListData || [],
      favorited: false,
      favoritesCount: 0,
      author,
    };

    return article;
  }

  private createSlug(title: string): string {
    const cleanedTitle = title.toLowerCase().replace(/\s+/g, '-');
    const validSlug = cleanedTitle.replace(/[^a-z0-9-]/g, '');
    return validSlug;
  }
}
