/**We want to store why users leave, Useful for business analytics later */

// src/users/schemas/delete-reason.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeleteReasonDocument = DeleteReason & Document;

@Schema({ timestamps: true })
export class DeleteReason {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    reason: string;
}

export const DeleteReasonSchema =
    SchemaFactory.createForClass(DeleteReason);
