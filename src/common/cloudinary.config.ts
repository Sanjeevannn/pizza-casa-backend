// src/common/cloudinary.config.ts
import { config as dotenvConfig } from 'dotenv';
dotenvConfig(); // load .env immediately

import { v2 as cloudinaryV2 } from 'cloudinary';

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinaryV2 };
