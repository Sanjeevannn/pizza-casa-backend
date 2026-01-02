// src/users/dto/profile-image.dto.ts
import { IsNotEmpty } from 'class-validator';

export class ProfileImageDto {
  @IsNotEmpty()
  imageUrl: string; // client sends URL of uploaded image
}
