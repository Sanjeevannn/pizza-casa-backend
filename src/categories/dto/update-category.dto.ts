// src/categories/dto/update-category.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;
}
