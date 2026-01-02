// src/products/food/food.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Food, FoodDocument } from './schemas/food.schema';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food.name)
    private foodModel: Model<FoodDocument>,
  ) {}

  create(data: Partial<Food>) {
    return this.foodModel.create(data);
  }

  findAll() {
    return this.foodModel.find({ isActive: true });
  }

  async update(id: string, data: Partial<Food>) {
    const food = await this.foodModel.findByIdAndUpdate(id, data, { new: true });
    if (!food) throw new NotFoundException('Food not found');
    return food;
  }

  async delete(id: string) {
    const food = await this.foodModel.findByIdAndDelete(id);
    if (!food) throw new NotFoundException('Food not found');
    return { message: 'Food deleted successfully' };
  }
}
