import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsArray()
  tags: string[];

  @IsNumber()
  userId: number;
}