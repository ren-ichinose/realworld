import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  tagList?: string[];
}
