import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CursorQueryBlogDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cursor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
