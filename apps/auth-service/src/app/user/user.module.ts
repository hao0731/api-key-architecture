import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDefinition } from './user.schema';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([UserDefinition])],
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
