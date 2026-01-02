// src/users/users.controller.ts
import { Controller, Get, Body, UseGuards, Req, Post, Put, Delete, Param, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { cloudinaryV2 } from '../common/cloudinary.config';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  //get all users 
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Req() req: any) {
    return {
      loggedInUser: req.user, // contains sub and role
      users: await this.usersService.findAll(),
    };
  }
  // GET single user by ID
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  // update user profile
  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Req() req: any, @Body() body: UpdateUserDto) {
    const userId = req.user.sub; // JWT user ID

    // Convert dob string to Date if exists
    const updateData = {
      ...body,
      dob: body.dob ? new Date(body.dob) : undefined,
    };
    return this.usersService.updateUser(userId, updateData);
  }

  //delete account
  @UseGuards(JwtAuthGuard)
  @Delete('delete-account')
  deleteAccount(
    @Req() req: any,
    @Body() body: DeleteAccountDto,
  ) {
    const userId = req.user.sub; // from JWT
    return this.usersService.deleteAccount(
      userId,
      body.currentPassword,
      body.reason,
    );
  }

  // PUT profile image
  @UseGuards(JwtAuthGuard)
  @Put('profile-images')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image uploaded');

    // Upload to Cloudinary
    const result = await cloudinaryV2.uploader.upload(file.path, {
      folder: 'profile_images',
      overwrite: true,
    });

    // Save URL in DB
    const updatedUser = await this.usersService.updateProfileImage(req.user.sub, result.secure_url);
    return updatedUser;
  }
}

