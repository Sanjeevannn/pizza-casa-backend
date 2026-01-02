// src/products/food/food.controller.ts
import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UseInterceptors, UploadedFile,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryV2 } from '../../common/cloudinary.config';
import { Role } from '../../common/roles.enum';
import { Types } from 'mongoose';
import { CategoriesService } from '../../categories/categories.service';

@Controller('food')
export class FoodController {
  constructor(
    private readonly foodService: FoodService,
    private readonly categoriesService: CategoriesService,
  ) { }

  // GET all foods (Customer / Cashier / Admin)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    try {
      return await this.foodService.findAll();
    } catch (err) {
      throw new InternalServerErrorException(err.message || 'Failed to get foods');
    }
  }

  // Admin only → Create food (JSON or multipart/form-data)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() body: CreateFoodDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      // required field guard (DTO + ValidationPipe should already validate)
      if (!body.name || body.price === undefined || !body.type || !body.categoryId) {
        throw new BadRequestException('Missing required fields: name, price, type, categoryId');
      }

      // Validate category exists and get name
      const category = await this.categoriesService.findById(body.categoryId);
      if (!category) throw new NotFoundException('Category not found');

      let imageUrl = body.image ?? ''; // if client provided an image URL in JSON
      if (file) {
        const upload = await cloudinaryV2.uploader.upload(file.path, {
          folder: 'food',
          overwrite: true,
        });
        imageUrl = upload.secure_url;
      }

      const foodData = {
        name: body.name,
        shortDescription: body.shortDescription ?? '',
        longDescription: body.longDescription ?? '',
        ingredients: body.ingredients ?? [],
        price: body.price,
        type: body.type,
        categoryId: new Types.ObjectId(body.categoryId),
        categoryName: category.name,
        image: imageUrl,
      };

      return await this.foodService.create(foodData);
    } catch (err: any) {
      // If we received a Mongoose validation error, pass it back clearly
      if (err.name === 'ValidationError') {
        throw new BadRequestException(err.message);
      }
      // If error is an HttpException above, rethrow
      if (err.status && err.response) throw err;
      throw new InternalServerErrorException(err.message || 'Failed to create food');
    }
  }

  // Admin only → Update food (details + optional image)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image')) // optional image
  async update(
    @Param('id') id: string,
    @Body() body: UpdateFoodDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      let dataToUpdate: Partial<UpdateFoodDto & { image?: string }> = { ...body };

      if (file) {
        const upload = await cloudinaryV2.uploader.upload(file.path, {
          folder: 'food',
          overwrite: true,
        });
        dataToUpdate.image = upload.secure_url;
      }

      return await this.foodService.update(id, dataToUpdate);
    } catch (err: any) {
      if (err.status && err.response) throw err;
      throw new InternalServerErrorException(err.message || 'Failed to update food');
    }
  }

  // Admin only → Delete food
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.foodService.delete(id);
    } catch (err: any) {
      if (err.status && err.response) throw err;
      throw new InternalServerErrorException(err.message || 'Failed to delete food');
    }
  }
}
