import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
/**
 * Transforma un valor en un identificador de MongoDB.
 * @param value El valor a transformar.
 * @param metadata: ArgumentMetadata, Los metadatos de los argumentos no usada.
 * @returns El identificador de MongoDB.
 * @throws BadRequestException si el valor no es un identificador de MongoDB válido.
 */
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string) {
    if (!isValidObjectId(value))
      throw new BadRequestException(`${value} is not valid `);
    return value;
  }
}
