import { IsInt, IsOptional } from 'class-validator';
import { IsTrimmedString } from 'src/common/decorator/is-trimmed-string.decorator';

export class CreateCommentDto {
  @IsTrimmedString()
  message: string;

  @IsOptional()
  @IsInt()
  parentId: number;
}
