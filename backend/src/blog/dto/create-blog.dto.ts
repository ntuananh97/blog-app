import { IsTrimmedString } from 'src/common/decorator/is-trimmed-string.decorator';

export class CreateBlogDto {
  @IsTrimmedString()
  title: string;

  @IsTrimmedString()
  content: string;
}
