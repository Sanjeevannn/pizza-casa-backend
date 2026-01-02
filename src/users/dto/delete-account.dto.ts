/** Ensures password is provided, Ensures reason is not empty */

// src/users/dto/delete-account.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';

export class DeleteAccountDto {
    @IsNotEmpty()
    currentPassword: string;

    @MinLength(5)
    reason: string;
}
