import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Global validation pipe that validates incoming DTOs using class-validator.
 * Transforms plain objects to class instances and validates them.
 */
@Injectable()
export class GlobalValidationPipe implements PipeTransform {
  /**
   * Transforms and validates the incoming value against the expected DTO class.
   * @param value - The incoming value to validate
   * @param metadata - Metadata about the parameter being validated
   * @returns The validated and transformed value
   * @throws BadRequestException if validation fails
   */
  async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    if (errors.length > 0) {
      const messages = errors.map((error) => {
        const constraints = error.constraints;
        if (constraints) {
          return Object.values(constraints).join(', ');
        }
        return `Invalid value for ${error.property}`;
      });

      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }

    return object;
  }

  /**
   * Determines if the metatype requires validation.
   * Primitive types (String, Boolean, Number, Array, Object) are skipped.
   */
  private toValidate(metatype: new (...args: unknown[]) => unknown): boolean {
    const types: (new (...args: unknown[]) => unknown)[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
