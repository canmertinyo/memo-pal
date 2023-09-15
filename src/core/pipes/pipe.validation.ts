import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

@Injectable()
export class PipeValidation<T> implements PipeTransform {
  public async transform(value: T, { metatype }: ArgumentMetadata): Promise<T> {
    if (!metatype || !this.toValidate(metatype)) return value;

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, { whitelist: true });

    if (errors.length === 0) return value;

    const errMessages = errors.flatMap((error: ValidationError) =>
      Object.values(error.constraints),
    );

    throw new BadRequestException(errMessages);
  }

  public async toValidate(metatype: Function): Promise<boolean> {
    const types: Function[] = [Array, Object, String, Boolean, Number];

    return !types.includes(metatype);
  }
}
