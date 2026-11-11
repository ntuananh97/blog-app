import { applyDecorators } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, ValidationOptions } from 'class-validator';

export function IsTrimmedString(validationOptions?: ValidationOptions) {
  return applyDecorators(
    Transform(({ value }: TransformFnParams) =>
      typeof value === 'string' ? value.trim() : (value as unknown),
    ),
    IsString(validationOptions),
    IsNotEmpty(validationOptions),
  );
}
