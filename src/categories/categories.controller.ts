// src/categories/categories.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { cloudinaryV2 } from '../common/cloudinary.config';
import type { Express } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // CUSTOMER & USER - GET ALL CATEGORIES
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCategories() {
    return this.categoriesService.findAll();
  }

  // ADMIN - CREATE CATEGORY
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(@Body() body: CreateCategoryDto, @UploadedFile() file: Express.Multer.File) {
    let imageUrl: string | undefined = undefined;

    if (file) {
      const result = await cloudinaryV2.uploader.upload(file.path, {
        folder: 'categories',
        overwrite: true,
      });
      imageUrl = result.secure_url;
    }

    return this.categoriesService.createCategory(body.name, imageUrl);
  }

  // ADMIN - UPDATE CATEGORY
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl;
    if (file) {
      const result = await cloudinaryV2.uploader.upload(file.path, {
        folder: 'categories',
        overwrite: true,
      });
      imageUrl = result.secure_url;
    }
    return this.categoriesService.updateCategory(id, body.name, imageUrl);
  }

  // ADMIN - DELETE CATEGORY
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
