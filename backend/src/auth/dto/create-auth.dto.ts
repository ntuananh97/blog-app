import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Username không được để trống' })
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  password: string;
}
