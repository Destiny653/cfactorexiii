import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  fullName: string;
}

export class CreateCommentDto {
  @IsString()
  body: string;

  @IsString()
  postId: string; // Post's _id (MongoDB ObjectId)

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}