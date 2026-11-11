import { IsTrimmedString } from 'src/common/decorator/is-trimmed-string.decorator';

export class UpdateCommentDto {
  @IsTrimmedString()
  message: string;
}
