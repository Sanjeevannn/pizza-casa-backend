// src/categories/dto/create-category.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
