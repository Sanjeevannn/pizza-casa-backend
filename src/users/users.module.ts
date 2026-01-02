/* forFeature → tells NestJS about this collection
   exports → other modules (Auth) can use UsersService*/

//src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { DeleteReason, DeleteReasonSchema } from './schemas/delete-reason.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      // NestJS must know this collection exists.
      { name: DeleteReason.name, schema: DeleteReasonSchema },
    ]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
