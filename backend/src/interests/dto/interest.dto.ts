import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInterestDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  @Matches(/^[a-zA-Z0-9\s\-_áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Eliminar cualquier tag HTML y caracteres especiales peligrosos
      return value
        .replace(/<[^>]*>/g, '') // Eliminar tags HTML
        .replace(/[<>"'&]/g, '') // Eliminar caracteres peligrosos
        .trim();
    }
    return value;
  })
  name: string;
}

export class InterestResponseDto {
  id: string;
  name: string;
}