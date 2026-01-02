// src/products/food/ update-food.dto.ts
import { IsOptional, IsString, IsNumber, IsArray, IsEnum } from 'class-validator';

export class UpdateFoodDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsOptional()
  @IsArray()
  ingredients?: string[];

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(['halal', 'haram'])
  type?: 'halal' | 'haram';

  @IsOptional()
  @IsString()
  image?: string;
}
