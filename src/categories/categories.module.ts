// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})

export class CategoriesModule { }
