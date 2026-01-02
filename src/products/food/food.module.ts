// src/products/food/food.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { Food, FoodSchema } from './schemas/food.schema';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { CategoriesModule } from '../../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]),
    MulterModule.register({ dest: './uploads' }),
    CategoriesModule, // import so we can inject CategoriesService
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
